import { Prisma } from "@/generated/prisma/client";
import { decrypt, encrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import type { Breakdown, Platform } from "@/lib/types";
import { providerFor } from "@/lib/sync/providers";
import {
  AUTO_REFRESH_MIN_MS,
  SYNC_WINDOW_MS,
  followerSnapshots,
  isSyncDue,
  manualRefreshMinMs,
} from "@/lib/sync/sync-rules";
import { TokenExpiredError, type FetchedAccount, type TokenSet } from "@/lib/sync/types";

// Enregistrement des comptes reliés et synchronisation de leurs statistiques (spec 5.5 et 5.6).

function encryptedTokens(tokens: TokenSet) {
  return {
    accessToken: encrypt(tokens.accessToken),
    refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
    tokenExpiresAt: tokens.expiresAt,
  };
}

function json(breakdowns: Breakdown[]) {
  return breakdowns.map(({ label, count }) => ({ label, count }));
}

export function syncSince(now: Date): Date {
  return new Date(now.getTime() - SYNC_WINDOW_MS);
}

/** Écrit publications, relevés d'abonnés et audience, puis marque la connexion comme à jour. */
async function saveAccount(connectionId: string, account: FetchedAccount, now: Date): Promise<void> {
  await prisma.$transaction(
    async (tx) => {
      for (const { platform: _platform, ...post } of account.posts) {
        void _platform;
        await tx.post.upsert({
          where: { connectionId_externalId: { connectionId, externalId: post.externalId } },
          create: { connectionId, ...post },
          update: post,
        });
      }
      for (const snapshot of followerSnapshots(account, now)) {
        await tx.accountSnapshot.upsert({
          where: { connectionId_date: { connectionId, date: snapshot.date } },
          create: { connectionId, ...snapshot },
          update: { followers: snapshot.followers },
        });
      }
      // Audience absente cette fois (erreur, moins de 100 abonnés) : l'ancienne est conservée.
      if (account.audience) {
        const audience = {
          ages: json(account.audience.ages),
          genders: json(account.audience.genders),
          countries: json(account.audience.countries),
        };
        await tx.audience.upsert({ where: { connectionId }, create: { connectionId, ...audience }, update: audience });
      }
      await tx.socialConnection.update({
        where: { id: connectionId },
        data: { username: account.username, avatarUrl: account.avatarUrl, status: "ACTIVE", lastSyncedAt: now },
      });
    },
    { timeout: 30_000 },
  );
}

/**
 * Relie un compte au créateur après l'autorisation (retour OAuth). Refusé si ce compte Instagram/TikTok
 * appartient déjà à un autre profil AVERO. Un autre compte du même réseau déjà relié est remplacé.
 */
export async function linkAccount(params: {
  creatorId: string;
  platform: Platform;
  simulated: boolean;
  tokens: TokenSet;
  account: FetchedAccount;
  now: Date;
}): Promise<"connected" | "already_linked"> {
  const { creatorId, platform, simulated, tokens, account, now } = params;
  const owner = await prisma.socialConnection.findUnique({
    where: { platform_externalUserId: { platform, externalUserId: account.externalUserId } },
  });
  if (owner && owner.creatorId !== creatorId) return "already_linked";

  const current = await prisma.socialConnection.findUnique({ where: { creatorId_platform: { creatorId, platform } } });
  if (current && current.externalUserId !== account.externalUserId) {
    await prisma.socialConnection.delete({ where: { id: current.id } }); // ses données partent avec (cascade)
  }

  const data = {
    externalUserId: account.externalUserId,
    username: account.username,
    avatarUrl: account.avatarUrl,
    ...encryptedTokens(tokens),
    status: "ACTIVE" as const,
    simulated,
  };
  try {
    const connection = await prisma.socialConnection.upsert({
      where: { creatorId_platform: { creatorId, platform } },
      create: { creatorId, platform, ...data },
      update: data,
    });
    await saveAccount(connection.id, account, now);
  } catch (error) {
    // Relié par quelqu'un d'autre au même instant : contrainte d'unicité (réseau, compte).
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "already_linked";
    throw error;
  }
  return "connected";
}

export type SyncResult = "ok" | "expired" | "failed";

/**
 * Met à jour une connexion : renouvelle le jeton si besoin, relit le compte et enregistre.
 * Jeton expiré ou révoqué → EXPIRED (anciennes données gardées). Autre erreur → données gardées.
 * Le connecteur dépend de la connexion (simulée ou non), jamais de OAUTH2_MODE.
 */
export async function syncConnection(connectionId: string, now = new Date()): Promise<SyncResult> {
  const connection = await prisma.socialConnection.findUnique({ where: { id: connectionId } });
  if (!connection) return "failed";
  const provider = providerFor(connection.platform, connection.simulated);

  try {
    let tokens: TokenSet;
    try {
      tokens = {
        accessToken: decrypt(connection.accessToken),
        refreshToken: connection.refreshToken ? decrypt(connection.refreshToken) : null,
        expiresAt: connection.tokenExpiresAt ?? now,
      };
    } catch {
      throw new TokenExpiredError("Jeton enregistré illisible.");
    }

    const refreshed = connection.tokenExpiresAt ? await provider.refreshIfNeeded(tokens, now) : null;
    if (refreshed) {
      tokens = refreshed;
      await prisma.socialConnection.update({ where: { id: connection.id }, data: encryptedTokens(refreshed) });
    }

    const account = await provider.fetchAccount(tokens.accessToken, syncSince(now));
    await saveAccount(connection.id, account, now);
    return "ok";
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      await prisma.socialConnection.update({ where: { id: connection.id }, data: { status: "EXPIRED" } });
      return "expired";
    }
    console.error(`Synchronisation ${connection.platform} impossible :`, error instanceof Error ? error.message : error);
    return "failed";
  }
}

/** Ouverture du tableau de bord : met à jour les connexions actives dont les données ont plus de 24 h. */
export async function syncStaleConnections(creatorId: string, now = new Date()): Promise<void> {
  const connections = await prisma.socialConnection.findMany({
    where: { creatorId, status: "ACTIVE" },
    select: { id: true, lastSyncedAt: true },
  });
  await Promise.all(
    connections.filter((c) => isSyncDue(c.lastSyncedAt, now, AUTO_REFRESH_MIN_MS)).map((c) => syncConnection(c.id, now)),
  );
}

/** Bouton « Actualiser » : ignoré si la dernière synchro est trop récente. */
export async function refreshCreatorConnection(
  creatorId: string,
  platform: Platform,
  now = new Date(),
): Promise<SyncResult | "up_to_date" | "missing"> {
  const connection = await prisma.socialConnection.findUnique({ where: { creatorId_platform: { creatorId, platform } } });
  if (!connection) return "missing";
  if (!isSyncDue(connection.lastSyncedAt, now, manualRefreshMinMs(connection.simulated))) return "up_to_date";
  return syncConnection(connection.id, now);
}

/** Bouton « Déconnecter » : supprime la connexion et toutes ses données (cascade). */
export async function disconnectCreatorPlatform(creatorId: string, platform: Platform): Promise<void> {
  await prisma.socialConnection.deleteMany({ where: { creatorId, platform } });
}

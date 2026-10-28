import type { Prisma } from "@/generated/prisma/client";
import type { Breakdown, CreatorSource, NetworkData } from "@/lib/types";

/** Ce que la base renvoie pour un créateur : profil, connexions, relevés, publications et audience. */
export const CREATOR_INCLUDE = {
  connections: { include: { snapshots: true, posts: true, audience: true } },
} satisfies Prisma.CreatorProfileInclude;

export type CreatorProfileRow = Prisma.CreatorProfileGetPayload<{ include: typeof CREATOR_INCLUDE }>;
type ConnectionRow = CreatorProfileRow["connections"][number];

/** Lit une liste { label, count } stockée en JSON ; les entrées mal formées sont ignorées. */
export function parseBreakdowns(json: unknown): Breakdown[] {
  if (!Array.isArray(json)) return [];
  return json.filter(
    (item): item is Breakdown =>
      typeof item === "object" &&
      item !== null &&
      typeof item.label === "string" &&
      typeof item.count === "number" &&
      Number.isFinite(item.count),
  ).map(({ label, count }) => ({ label, count }));
}

function toNetwork(connection: ConnectionRow): NetworkData {
  const { platform, audience } = connection;
  return {
    platform,
    username: connection.username,
    avatarUrl: connection.avatarUrl,
    status: connection.status,
    // Pas encore synchronisé : on affiche la date de connexion du compte.
    lastSyncedAt: connection.lastSyncedAt ?? connection.createdAt,
    snapshots: [...connection.snapshots]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, followers }) => ({ date, followers })),
    posts: connection.posts.map((post) => ({
      externalId: post.externalId,
      platform,
      publishedAt: post.publishedAt,
      caption: post.caption,
      thumbnailUrl: post.thumbnailUrl,
      permalink: post.permalink,
      views: post.views,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      saves: post.saves,
      reach: post.reach,
    })),
    audience: audience && {
      ages: parseBreakdowns(audience.ages),
      genders: parseBreakdowns(audience.genders),
      countries: parseBreakdowns(audience.countries),
    },
  };
}

/** Convertit un créateur lu dans la base au format utilisé par le calcul des KPI et les pages. */
export function toCreatorSource(profile: CreatorProfileRow): CreatorSource {
  return {
    creatorId: profile.id,
    displayName: profile.displayName,
    networks: profile.connections.map(toNetwork),
  };
}

// Remplit la base avec les 8 créateurs d'exemple (mêmes données que la phase A).
// Lancement : « pnpm run db:seed ». Peut être relancé : les créateurs sont mis à jour, jamais dupliqués,
// et leurs chiffres sont recalculés par rapport à la date du jour.
// Seuls les comptes demo+N@avero.test sont touchés : les autres comptes de la base ne changent pas.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { generateMockCreators } from "../src/lib/data/mock/generate";
import type { Breakdown } from "../src/lib/types";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

/** Liste { label, count } prête à être stockée en JSON. */
function json(breakdowns: Breakdown[]) {
  return breakdowns.map(({ label, count }) => ({ label, count }));
}

/** Jour du relevé (sans l'heure), comme la colonne « date » de la base. */
function day(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

async function main() {
  const creators = generateMockCreators(new Date());

  for (const [index, creator] of creators.entries()) {
    const n = index + 1;
    const userId = `seed-user-${n}`;

    await prisma.$transaction(async (tx) => {
      // Compte sans mot de passe : personne ne peut s'y connecter.
      await tx.user.upsert({
        where: { id: userId },
        create: { id: userId, email: `demo+${n}@avero.test`, name: creator.displayName, role: "CREATOR" },
        update: { name: creator.displayName },
      });
      const profile = await tx.creatorProfile.upsert({
        where: { userId },
        create: { userId, displayName: creator.displayName },
        update: { displayName: creator.displayName },
      });

      for (const network of creator.networks) {
        const fields = {
          username: network.username,
          avatarUrl: network.avatarUrl,
          // Jeton factice : ces comptes ne sont jamais synchronisés avec Instagram ou TikTok.
          accessToken: "seed-jeton-factice",
          status: network.status,
          lastSyncedAt: network.lastSyncedAt,
          // Comptes fictifs : jamais synchronisés avec le vrai Instagram ou TikTok.
          simulated: true,
        };
        const connection = await tx.socialConnection.upsert({
          where: { platform_externalUserId: { platform: network.platform, externalUserId: `seed-${n}` } },
          create: { creatorId: profile.id, platform: network.platform, externalUserId: `seed-${n}`, ...fields },
          update: fields,
        });

        // Les relevés et publications sont remplacés à chaque lancement.
        await tx.accountSnapshot.deleteMany({ where: { connectionId: connection.id } });
        await tx.accountSnapshot.createMany({
          data: network.snapshots.map((s) => ({ connectionId: connection.id, date: day(s.date), followers: s.followers })),
        });
        await tx.post.deleteMany({ where: { connectionId: connection.id } });
        await tx.post.createMany({
          data: network.posts.map((post) => ({
            connectionId: connection.id,
            externalId: post.externalId,
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
        });

        if (network.audience) {
          const { ages, genders, countries } = network.audience;
          const audience = { ages: json(ages), genders: json(genders), countries: json(countries) };
          await tx.audience.upsert({
            where: { connectionId: connection.id },
            create: { connectionId: connection.id, ...audience },
            update: audience,
          });
        } else {
          await tx.audience.deleteMany({ where: { connectionId: connection.id } });
        }
      }
    });

    console.log(`✓ ${creator.displayName} (${creator.networks.map((n) => n.platform).join(" + ")})`);
  }
}

main()
  .then(() => console.log("Créateurs d'exemple enregistrés."))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

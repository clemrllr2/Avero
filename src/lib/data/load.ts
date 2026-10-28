import { prisma } from "@/lib/db";
import { CREATOR_INCLUDE, toCreatorSource } from "@/lib/data/convert";
import type { CreatorSourceLoader } from "@/lib/data/creator-data";

/** Historique chargé : couvre les KPI (30 jours) et les graphiques (8 semaines). */
const HISTORY_DAYS = 60;

/** Créateurs ayant au moins un réseau relié, avec leurs 60 derniers jours de données. */
export const loadCreatorSources: CreatorSourceLoader = async (where) => {
  const since = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000);
  const profiles = await prisma.creatorProfile.findMany({
    where: {
      connections: { some: {} },
      ...(where?.creatorIds && { id: { in: where.creatorIds } }),
    },
    include: {
      connections: {
        orderBy: { platform: "asc" },
        include: {
          ...CREATOR_INCLUDE.connections.include,
          snapshots: { where: { date: { gte: since } }, orderBy: { date: "asc" } },
          posts: { where: { publishedAt: { gte: since } } },
        },
      },
    },
  });
  return profiles.map(toCreatorSource);
};

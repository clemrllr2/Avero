import type { AudienceData, CreatorSource, NetworkData, Platform, PostData } from "@/lib/types";

const DAY = 24 * 60 * 60 * 1000;

/** Générateur pseudo-aléatoire à graine fixe (mulberry32) : mêmes données à chaque appel. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface NetworkSpec {
  platform: Platform;
  followers: number;
  /** Taux de croissance des abonnés sur 60 jours (0.1 = +10 %). */
  growth: number;
  /** Âge de la publication la plus récente, en jours. */
  newestPostAge?: number;
  snapshotCount?: number;
  status?: NetworkData["status"];
}

interface CreatorSpec {
  displayName: string;
  username: string;
  networks: NetworkSpec[];
}

const CREATORS: CreatorSpec[] = [
  {
    displayName: "Léa Martin",
    username: "lea.martin",
    networks: [
      { platform: "INSTAGRAM", followers: 48_200, growth: 0.12 },
      { platform: "TIKTOK", followers: 126_000, growth: 0.2 },
    ],
  },
  { displayName: "Hugo Bernard", username: "hugo.cuisine", networks: [{ platform: "INSTAGRAM", followers: 215_000, growth: 0.04 }] },
  { displayName: "Inès Robert", username: "ines.danse", networks: [{ platform: "TIKTOK", followers: 890_000, growth: 0.15 }] },
  {
    displayName: "Yanis Petit",
    username: "yanis.tech",
    networks: [
      { platform: "INSTAGRAM", followers: 12_400, growth: 0.08 },
      { platform: "TIKTOK", followers: 33_000, growth: 0.1, status: "EXPIRED" },
    ],
  },
  { displayName: "Chloé Durand", username: "chloe.illustre", networks: [{ platform: "INSTAGRAM", followers: 85, growth: 0.3 }] },
  { displayName: "Lucas Moreau", username: "lucas.voyage", networks: [{ platform: "TIKTOK", followers: 54_000, growth: -0.02, newestPostAge: 45 }] },
  {
    displayName: "Manon Lefèvre",
    username: "manon.mode",
    networks: [
      { platform: "INSTAGRAM", followers: 9_800, growth: 0, snapshotCount: 1 },
      { platform: "TIKTOK", followers: 21_500, growth: 0, snapshotCount: 1 },
    ],
  },
  { displayName: "Nathan Garcia", username: "nathan.fit", networks: [{ platform: "INSTAGRAM", followers: 402_000, growth: 0.06 }] },
];

const CAPTIONS = [
  "Ma routine du matin",
  "3 astuces que personne ne connaît",
  "Avant / après",
  "Réponse à vos questions",
  "Une journée avec moi",
  "Le test honnête",
  "Collab surprise",
  "Behind the scenes",
];

const AGE_BUCKETS = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const AGE_WEIGHTS = [0.06, 0.34, 0.31, 0.15, 0.08, 0.04, 0.02];
const COUNTRIES = ["FR", "BE", "CH", "CA", "MA"];
const COUNTRY_WEIGHTS = [0.72, 0.1, 0.07, 0.06, 0.05];

function buildAudience(followers: number, random: () => number): AudienceData {
  const female = 0.35 + random() * 0.3;
  return {
    ages: AGE_BUCKETS.map((label, i) => ({ label, count: Math.round(followers * AGE_WEIGHTS[i]) })),
    genders: [
      { label: "F", count: Math.round(followers * female) },
      { label: "M", count: Math.round(followers * (0.97 - female)) },
      { label: "U", count: Math.round(followers * 0.03) },
    ],
    countries: COUNTRIES.map((label, i) => ({ label, count: Math.round(followers * COUNTRY_WEIGHTS[i]) })),
  };
}

/** Un réseau fictif complet ; aussi utilisé par le connecteur simulé (src/lib/sync/simulated.ts). */
export function buildNetwork(
  creatorId: string,
  username: string,
  spec: NetworkSpec,
  seed: number,
  now: Date,
): NetworkData {
  const random = seeded(seed);
  const isInstagram = spec.platform === "INSTAGRAM";
  const newest = spec.newestPostAge ?? 1;

  const posts: PostData[] = Array.from({ length: 20 }, (_, i) => {
    const ageInDays = newest + i * 3 + random() * 2;
    const views = Math.round(spec.followers * (0.15 + random() * (isInstagram ? 0.6 : 1.4)));
    return {
      externalId: `${creatorId}-${spec.platform}-${i}`,
      platform: spec.platform,
      publishedAt: new Date(now.getTime() - ageInDays * DAY),
      caption: CAPTIONS[i % CAPTIONS.length],
      thumbnailUrl: null,
      permalink: null,
      views,
      likes: Math.round(views * (0.03 + random() * 0.07)),
      comments: Math.round(views * (0.002 + random() * 0.01)),
      shares: Math.round(views * (0.001 + random() * 0.02)),
      saves: isInstagram ? Math.round(views * (0.005 + random() * 0.02)) : null,
      reach: isInstagram ? Math.round(views * (0.6 + random() * 0.3)) : null,
    };
  });

  const snapshotCount = spec.snapshotCount ?? 10;
  const snapshots = Array.from({ length: snapshotCount }, (_, i) => {
    const ageInDays = snapshotCount === 1 ? 0 : Math.round(60 - (i * 60) / (snapshotCount - 1));
    const progress = snapshotCount === 1 ? 1 : i / (snapshotCount - 1);
    const start = spec.followers / (1 + spec.growth);
    return {
      date: new Date(now.getTime() - ageInDays * DAY),
      followers: Math.round(start + (spec.followers - start) * progress),
    };
  });

  return {
    platform: spec.platform,
    username,
    avatarUrl: null,
    status: spec.status ?? "ACTIVE",
    lastSyncedAt: new Date(now.getTime() - Math.round(random() * 20) * 60 * 60 * 1000),
    snapshots,
    posts,
    // Instagram ne fournit l'audience qu'à partir de 100 abonnés ; TikTok jamais.
    audience: isInstagram && spec.followers >= 100 ? buildAudience(spec.followers, random) : null,
  };
}

export function generateMockCreators(now: Date): CreatorSource[] {
  return CREATORS.map((spec, index) => {
    const creatorId = `c${index + 1}`;
    return {
      creatorId,
      displayName: spec.displayName,
      networks: spec.networks.map((network, j) =>
        buildNetwork(creatorId, spec.username, network, (index + 1) * 100 + j, now),
      ),
    };
  });
}

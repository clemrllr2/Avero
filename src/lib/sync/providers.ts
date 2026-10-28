import type { Platform } from "@/lib/types";
import { instagramProvider } from "@/lib/sync/instagram";
import { simulatedProvider } from "@/lib/sync/simulated";
import { tiktokProvider } from "@/lib/sync/tiktok";
import type { PlatformProvider } from "@/lib/sync/types";

/** Connecteur à utiliser : simulé, ou le vrai Instagram / TikTok. */
export function providerFor(platform: Platform, simulated: boolean): PlatformProvider {
  if (simulated) return simulatedProvider(platform);
  return platform === "INSTAGRAM" ? instagramProvider : tiktokProvider;
}

/** Mode réel : les clés de l'app Meta ou TikTok sont-elles dans .env ? */
export function isPlatformConfigured(platform: Platform): boolean {
  const env = process.env;
  return platform === "INSTAGRAM"
    ? Boolean(env.INSTAGRAM_CLIENT_ID && env.INSTAGRAM_CLIENT_SECRET)
    : Boolean(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET);
}

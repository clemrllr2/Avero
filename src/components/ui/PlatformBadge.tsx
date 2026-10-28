import { Icon } from "@/components/visual/Icon";
import type { Platform } from "@/lib/types";

export const PLATFORM_NAMES: Record<Platform, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
};

/** Fond aux couleurs du réseau (bandeaux des cartes réseau et de l'écran d'autorisation). */
export const PLATFORM_BANNERS: Record<Platform, string> = {
  INSTAGRAM: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
  TIKTOK:
    "bg-[#0b0b16] bg-[radial-gradient(circle_at_20%_30%,rgba(37,244,238,0.45),transparent_45%),radial-gradient(circle_at_85%_70%,rgba(254,44,85,0.45),transparent_45%)]",
};

export const PLATFORM_ICONS = { INSTAGRAM: "instagram", TIKTOK: "tiktok" } as const;

const tone: Record<Platform, string> = {
  INSTAGRAM: "text-instagram",
  TIKTOK: "text-tiktok",
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-medium">
      <Icon name={PLATFORM_ICONS[platform]} className={`size-3.5 ${tone[platform]}`} />
      {PLATFORM_NAMES[platform]}
    </span>
  );
}

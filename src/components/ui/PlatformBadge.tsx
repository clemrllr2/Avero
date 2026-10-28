import type { Platform } from "@/lib/types";

export const PLATFORM_NAMES: Record<Platform, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
};

const dot: Record<Platform, string> = {
  INSTAGRAM: "bg-instagram",
  TIKTOK: "bg-tiktok",
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-medium">
      <span aria-hidden className={`size-2 rounded-full ${dot[platform]}`} />
      {PLATFORM_NAMES[platform]}
    </span>
  );
}

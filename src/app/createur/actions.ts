"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { isPlatform } from "@/lib/sync/platforms";
import { disconnectCreatorPlatform, refreshCreatorConnection } from "@/lib/sync/sync";
import type { Platform } from "@/lib/types";

const RESULT_QUERY = {
  ok: "success=refreshed",
  up_to_date: "success=up_to_date",
  expired: "error=expired",
  failed: "error=sync_failed",
  missing: "",
} as const;

export async function refreshAction(platform: Platform): Promise<void> {
  const user = await requireRole("CREATOR");
  if (!isPlatform(platform)) redirect("/createur/reseaux");
  const result = await refreshCreatorConnection(user.profileId, platform);
  redirect(`/createur/reseaux?${RESULT_QUERY[result]}`);
}

export async function disconnectAction(platform: Platform): Promise<void> {
  const user = await requireRole("CREATOR");
  if (!isPlatform(platform)) redirect("/createur/reseaux");
  await disconnectCreatorPlatform(user.profileId, platform);
  redirect("/createur/reseaux?success=disconnected");
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { requireRole } from "@/lib/session";
import { currentOAuthMode } from "@/lib/sync/mode";
import { callbackUrl, STATE_COOKIE_OPTIONS, stateCookieName } from "@/lib/sync/oauth-cookie";
import { createState, stateCookieValue } from "@/lib/sync/oauth-state";
import { platformFromSlug } from "@/lib/sync/platforms";
import { isPlatformConfigured, providerFor } from "@/lib/sync/providers";

/** Bouton « Connecter » : envoie le créateur vers l'écran d'autorisation (simulé ou du vrai réseau). */
export async function GET(request: NextRequest, { params }: RouteContext<"/api/connect/[platform]">) {
  const { platform: slug } = await params;
  const platform = platformFromSlug(slug);
  if (!platform) return new Response("Réseau inconnu.", { status: 404 });
  await requireRole("CREATOR");

  const simulated = currentOAuthMode() === "simulated";
  if (!simulated && !isPlatformConfigured(platform)) redirect("/createur/reseaux?error=not_configured");

  const state = createState();
  (await cookies()).set(stateCookieName(slug), stateCookieValue(state, simulated), STATE_COOKIE_OPTIONS);
  redirect(providerFor(platform, simulated).authorizeUrl(state, callbackUrl(slug, request.url)));
}

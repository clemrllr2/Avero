import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { requireRole } from "@/lib/session";
import { callbackUrl, STATE_COOKIE_OPTIONS, stateCookieName } from "@/lib/sync/oauth-cookie";
import { parseStateCookie, verifyState } from "@/lib/sync/oauth-state";
import { platformFromSlug } from "@/lib/sync/platforms";
import { providerFor } from "@/lib/sync/providers";
import { linkAccount, syncSince } from "@/lib/sync/sync";
import { NotProfessionalAccountError } from "@/lib/sync/types";

function back(query: string): never {
  redirect(`/createur/reseaux?${query}`);
}

/** Retour de l'écran d'autorisation : vérifie le state, récupère les jetons et le compte, l'enregistre. */
export async function GET(request: NextRequest, { params }: RouteContext<"/api/connect/[platform]/callback">) {
  const { platform: slug } = await params;
  const platform = platformFromSlug(slug);
  if (!platform) return new Response("Réseau inconnu.", { status: 404 });
  const user = await requireRole("CREATOR");

  // Le state ne sert qu'une fois.
  const jar = await cookies();
  const saved = parseStateCookie(jar.get(stateCookieName(slug))?.value);
  jar.set(stateCookieName(slug), "", { ...STATE_COOKIE_OPTIONS, maxAge: 0 });

  const query = request.nextUrl.searchParams;
  if (query.get("error")) back("error=cancelled");
  if (!saved || !verifyState(query.get("state"), saved.state)) back("error=invalid_state");
  const code = query.get("code");
  if (!code) back("error=connect_failed");

  let result: "connected" | "already_linked";
  try {
    const provider = providerFor(platform, saved.simulated);
    const now = new Date();
    const tokens = await provider.exchangeCode(code, callbackUrl(slug, request.url));
    const account = await provider.fetchAccount(tokens.accessToken, syncSince(now));
    result = await linkAccount({ creatorId: user.profileId, platform, simulated: saved.simulated, tokens, account, now });
  } catch (error) {
    if (error instanceof NotProfessionalAccountError) back("error=not_professional");
    console.error(`Connexion ${platform} impossible :`, error instanceof Error ? error.message : error);
    back("error=connect_failed");
  }
  back(result === "already_linked" ? "error=already_linked" : "success=connected");
}

import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/session";
import { platformFromSlug, slugFor } from "@/lib/sync/platforms";
import { encodeSimulatedCode, parseConsentForm } from "@/lib/sync/simulated";

/** 303 : le navigateur suit la redirection en GET, comme après un vrai écran d'autorisation. */
function go(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

/**
 * Réponse de l'écran d'autorisation simulé : renvoie vers le même retour que les vrais réseaux,
 * avec un code (« Autoriser ») ou error=access_denied (« Refuser »). L'adresse de retour est
 * toujours celle d'AVERO, jamais une adresse reçue dans le formulaire.
 */
export async function POST(request: NextRequest, { params }: RouteContext<"/oauth/simulation/[platform]/authorize">) {
  const platform = platformFromSlug((await params).platform);
  if (!platform) return new Response("Réseau inconnu.", { status: 404 });
  await requireRole("CREATOR");

  const form = await request.formData();
  const text = (key: string) => String(form.get(key) ?? "");
  const slug = slugFor(platform);
  const callback = `/api/connect/${slug}/callback`;
  const state = text("state");

  if (text("decision") !== "allow") return go(`${callback}?${new URLSearchParams({ error: "access_denied", state })}`, request);

  const result = parseConsentForm(Object.fromEntries(form), platform, new Date());
  if (!result.ok) {
    // Retour sur l'écran avec les choix saisis ; le message est recalculé par la page.
    const back = new URLSearchParams({ state, error: "1", username: text("username"), size: text("size"), scenario: text("scenario") });
    return go(`/oauth/simulation/${slug}?${back}`, request);
  }
  return go(`${callback}?${new URLSearchParams({ code: encodeSimulatedCode(result.grant), state })}`, request);
}

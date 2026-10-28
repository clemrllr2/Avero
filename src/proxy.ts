import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Vérification rapide : sans cookie de session, direction la page de connexion.
 * La session elle-même et le rôle sont vérifiés dans chaque page (requireRole).
 */
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/createur/:path*", "/marque/:path*"],
};

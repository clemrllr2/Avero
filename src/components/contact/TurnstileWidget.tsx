"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { TURNSTILE_FIELD } from "@/lib/turnstile";

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Case de vérification Cloudflare Turnstile. Elle ajoute au formulaire un champ caché contenant le jeton,
 * vérifié ensuite par le serveur. `resetKey` : à chaque changement, un nouveau widget est affiché
 * (un jeton ne sert qu'une fois, donc après chaque tentative d'envoi).
 */
export function TurnstileWidget({
  siteKey,
  resetKey,
  onVerified,
}: {
  siteKey: string;
  resetKey: unknown;
  onVerified: (verified: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Appelé par Cloudflare (hors affichage React) : toujours la dernière version de onVerified.
  const report = useEffectEvent((verified: boolean) => onVerified(verified));

  useEffect(() => {
    const turnstile = window.turnstile;
    if (!ready || !turnstile || !container.current) return;
    report(false);
    const id = turnstile.render(container.current, {
      sitekey: siteKey,
      language: "fr",
      theme: "light",
      "response-field-name": TURNSTILE_FIELD,
      callback: () => report(true),
      "expired-callback": () => report(false),
      "error-callback": () => report(false),
    });
    return () => turnstile.remove(id);
  }, [ready, siteKey, resetKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}

"use client";

import { useActionState } from "react";
import { simulatedConsentAction, type ConsentState } from "@/app/oauth/simulation/[platform]/actions";
import { FormError } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { PLATFORM_NAMES } from "@/components/ui/PlatformBadge";
import { slugFor } from "@/lib/sync/platforms";
import type { SimulatedScenario, SimulatedSize } from "@/lib/sync/simulated";
import type { Platform } from "@/lib/types";

const PERMISSIONS: Record<Platform, string[]> = {
  INSTAGRAM: [
    "Ton profil : nom d'utilisateur, photo et nombre d'abonnés",
    "Tes publications et leurs statistiques : vues, likes, commentaires, partages, enregistrements",
    "L'audience de ton compte : âge, genre et pays",
  ],
  TIKTOK: [
    "Ton profil : nom d'utilisateur et photo",
    "Tes statistiques : nombre d'abonnés",
    "Tes vidéos et leurs statistiques : vues, likes, commentaires, partages",
  ],
};

const SIZES: { value: SimulatedSize; label: string; hint: string }[] = [
  { value: "small", label: "Petit", hint: "moins de 20 k" },
  { value: "medium", label: "Moyen", hint: "20 k à 200 k" },
  { value: "large", label: "Gros", hint: "plus de 200 k" },
];

const SCENARIOS: { value: SimulatedScenario; label: string; instagramOnly?: boolean }[] = [
  { value: "ok", label: "Tout fonctionne" },
  { value: "personal_account", label: "Compte personnel (non professionnel)", instagramOnly: true },
  { value: "already_linked", label: "Compte déjà relié à un autre profil AVERO" },
  { value: "revoked_later", label: "Accès révoqué à la prochaine actualisation" },
  { value: "unavailable_later", label: "Réseau indisponible à la prochaine actualisation" },
];

const ACCENT: Record<Platform, { bar: string; dot: string; ring: string }> = {
  INSTAGRAM: { bar: "bg-instagram", dot: "bg-instagram", ring: "has-checked:border-instagram has-checked:bg-instagram/5" },
  TIKTOK: { bar: "bg-tiktok", dot: "bg-tiktok", ring: "has-checked:border-tiktok has-checked:bg-tiktok/5" },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Écran d'autorisation du mode simulé : même rôle que celui d'Instagram ou TikTok, aux couleurs d'AVERO. */
export function SimulatedConsent({
  platform,
  state,
  suggestedUsername,
}: {
  platform: Platform;
  state: string;
  suggestedUsername: string;
}) {
  const [result, action, pending] = useActionState<ConsentState, FormData>(simulatedConsentAction, {});
  const name = PLATFORM_NAMES[platform];
  const accent = ACCENT[platform];
  const values = result.values;

  return (
    <section className="w-full max-w-[460px] overflow-hidden rounded-3xl border border-line bg-surface">
      <div aria-hidden className={`h-1.5 ${accent.bar}`} />
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="display text-base">AVERO</span>
            <span aria-hidden className="h-px w-5 bg-ink/25" />
            <span className="flex items-center gap-1.5">
              <span aria-hidden className={`size-2.5 rounded-full ${accent.dot}`} />
              {name}
            </span>
          </p>
          <span className="rounded-full bg-signal px-2.5 py-1 text-xs font-semibold text-ink">Simulation</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="display text-[26px] leading-tight font-extrabold">AVERO souhaite accéder à ton compte {name}</h1>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {PERMISSIONS[platform].map((permission) => (
              <li key={permission} className="flex gap-2.5">
                <CheckIcon />
                {permission}
              </li>
            ))}
          </ul>
        </div>

        <form action={action} className="flex flex-col gap-5">
          <input type="hidden" name="platform" value={slugFor(platform)} />
          <input type="hidden" name="state" value={state} />

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Nom d&apos;utilisateur {name}</span>
            <span className="flex items-center rounded-[10px] border border-line bg-surface focus-within:border-cobalt">
              <span aria-hidden className="pl-3.5 text-muted">
                @
              </span>
              <input
                name="username"
                required
                maxLength={31}
                autoComplete="off"
                defaultValue={values?.username ?? suggestedUsername}
                className="w-full bg-transparent py-3 pr-3.5 pl-1 text-[15px] outline-none"
              />
            </span>
            <span className="text-xs text-muted">Les chiffres sont générés à partir de ce nom : toujours les mêmes pour un même nom.</span>
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-sm font-medium">Taille du compte</legend>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <label
                  key={size.value}
                  className={`flex cursor-pointer flex-col rounded-xl border border-line px-3 py-2.5 has-focus-visible:outline-2 has-focus-visible:outline-cobalt ${accent.ring}`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size.value}
                    defaultChecked={(values?.size ?? "medium") === size.value}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">{size.label}</span>
                  <span className="text-xs text-muted">{size.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Scénario de test</span>
            <select
              name="scenario"
              defaultValue={values?.scenario ?? "ok"}
              className="rounded-[10px] border border-line bg-surface px-3 py-3 text-[15px] outline-none focus:border-cobalt"
            >
              {SCENARIOS.filter((s) => !s.instagramOnly || platform === "INSTAGRAM").map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <FormError message={result.error} />

          <div className="grid grid-cols-2 gap-3">
            <Button type="submit" name="decision" value="deny" variant="secondary" formNoValidate disabled={pending}>
              Refuser
            </Button>
            <Button type="submit" name="decision" value="allow" disabled={pending}>
              {pending ? "Connexion…" : "Autoriser"}
            </Button>
          </div>
        </form>

        <p className="rounded-xl bg-paper px-4 py-3 text-sm text-muted">
          Mode simulé : aucune donnée n&apos;est lue sur {name}. Tu pourras déconnecter ce compte à tout moment depuis
          « Mes réseaux ».
        </p>
      </div>
    </section>
  );
}

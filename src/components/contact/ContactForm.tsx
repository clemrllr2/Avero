"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { contactAction, type ContactState } from "@/app/contact/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import { TurnstileWidget } from "@/components/contact/TurnstileWidget";
import { Button, buttonClass } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/visual/Icon";
import { CONTACT_MESSAGE_MAX, CONTACT_MESSAGE_MIN, CONTACT_TOPICS, faqForTopic, type ContactTopic } from "@/lib/contact";

/** Clé publique Cloudflare Turnstile ; sans elle, pas de case de vérification (développement). */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Ce que chaque profil peut demander : aide à choisir la bonne case. */
const TOPIC_DETAILS: Record<ContactTopic, { icon: IconName; hint: string; tone: string }> = {
  CREATOR: {
    icon: "user",
    hint: "Relier un compte, statistiques, confidentialité",
    tone: "bg-gradient-to-br from-instagram to-violet text-white",
  },
  BRAND: { icon: "building", hint: "Plans, liste des créateurs, export", tone: "bg-cobalt text-white" },
  OTHER: { icon: "chat", hint: "Presse, partenariat, autre sujet", tone: "bg-signal text-ink" },
};

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(contactAction, {});
  const [topic, setTopic] = useState<ContactTopic | undefined>(state.values?.topic as ContactTopic | undefined);
  const [length, setLength] = useState(state.values?.message.length ?? 0);
  const [verified, setVerified] = useState(false);
  const waitingForCheck = Boolean(TURNSTILE_SITE_KEY) && !verified;
  const answers = faqForTopic(topic);

  if (state.sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-5 py-4">
        <span aria-hidden className="grid size-14 place-items-center rounded-2xl bg-tiktok text-white">
          <Icon name="check" className="size-7" />
        </span>
        <h2 className="display text-[28px] leading-tight font-extrabold">Message envoyé</h2>
        <p className="max-w-[46ch] text-muted">
          Merci ! Nous vous répondrons à{" "}
          <strong className="font-semibold break-all text-ink">{state.replyTo ?? "l'adresse indiquée"}</strong>. Pensez à
          vérifier vos courriers indésirables.
        </p>
        <Link href="/" className={buttonClass("secondary", "mt-2")}>
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium">Vous êtes</legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {CONTACT_TOPICS.map(({ value, label }) => {
            const details = TOPIC_DETAILS[value];
            return (
              <label
                key={value}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border sm:flex-col sm:items-start border-line bg-surface p-4 transition-[border-color,box-shadow] hover:border-ink/25 has-checked:border-cobalt has-checked:shadow-[0_0_0_1px_var(--color-cobalt)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cobalt"
              >
                <input
                  type="radio"
                  name="topic"
                  value={value}
                  required
                  checked={topic === value}
                  onChange={() => setTopic(value)}
                  className="sr-only"
                />
                <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-xl ${details.tone}`}>
                  <Icon name={details.icon} className="size-4.5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">{label}</span>
                  <span className="text-xs leading-snug text-muted">{details.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Réponses rapides : apparaissent quand on choisit son profil (s'ouvre en douceur, sauf animations réduites). */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
          answers.length ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={answers.length === 0}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 rounded-2xl bg-paper p-2">
            <p className="px-3 pt-2 pb-1 text-sm text-muted">La réponse est peut-être ici :</p>
            {answers.map((item) => (
              <details key={item.question} className="group rounded-xl open:bg-surface">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-surface [&::-webkit-details-marker]:hidden">
                  <Icon name={item.icon} className="size-4 shrink-0 text-cobalt" />
                  <span className="flex-1">{item.question}</span>
                  <span aria-hidden className="text-lg text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-3 pb-3 pl-10 text-sm leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField label="Nom" name="name" autoComplete="name" maxLength={80} required defaultValue={state.values?.name} />
        <AuthField label="E-mail" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={CONTACT_MESSAGE_MIN}
          maxLength={CONTACT_MESSAGE_MAX}
          defaultValue={state.values?.message}
          onChange={(e) => setLength(e.target.value.length)}
          placeholder={
            topic === "BRAND"
              ? "Par exemple : quel plan choisir pour comparer une dizaine de créateurs ?"
              : topic === "CREATOR"
                ? "Par exemple : mon compte TikTok ne se met plus à jour."
                : "Décrivez votre demande."
          }
          className="resize-y rounded-[10px] border border-line bg-surface px-3.5 py-3 text-[15px] outline-none placeholder:text-muted/60 focus:border-cobalt"
        />
        <span className="self-end text-xs text-muted tabular-nums">
          {length} / {CONTACT_MESSAGE_MAX}
        </span>
      </label>

      {/* Piège à robots : invisible et ignoré par les personnes, rempli par les robots qui remplissent tout. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {TURNSTILE_SITE_KEY && <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} resetKey={state} onVerified={setVerified} />}

      <FormError message={state.error} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          disabled={pending || waitingForCheck}
          title={waitingForCheck ? "Patientez pendant la vérification anti-robot" : undefined}
          className="px-6 py-3.5"
        >
          {pending ? "Envoi…" : "Envoyer le message"}
        </Button>
        <p className="text-xs text-muted sm:max-w-[30ch] sm:text-right">
          Votre nom et votre e-mail servent uniquement à vous répondre.
        </p>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { contactAction, type ContactState } from "@/app/contact/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/visual/Icon";
import { CONTACT_MESSAGE_MAX, CONTACT_MESSAGE_MIN, CONTACT_TOPICS } from "@/lib/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(contactAction, {});
  const [length, setLength] = useState(state.values?.message.length ?? 0);

  if (state.sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <span aria-hidden className="grid size-12 place-items-center rounded-2xl bg-tiktok/15 text-tiktok">
          <Icon name="check" className="size-6" />
        </span>
        <h2 className="display text-2xl font-bold">Message envoyé</h2>
        <p className="text-muted">Merci ! Nous vous répondrons à l&apos;adresse e-mail que vous avez indiquée.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">Vous êtes</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {CONTACT_TOPICS.map((topic) => (
            <label
              key={topic.value}
              className="flex cursor-pointer items-center justify-center rounded-xl border border-line px-3 py-3 text-sm font-semibold transition-colors has-checked:border-cobalt has-checked:bg-cobalt/5 has-checked:text-cobalt has-focus-visible:outline-2 has-focus-visible:outline-cobalt"
            >
              <input
                type="radio"
                name="topic"
                value={topic.value}
                required
                defaultChecked={state.values?.topic === topic.value}
                className="sr-only"
              />
              {topic.label}
            </label>
          ))}
        </div>
      </fieldset>

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
          className="resize-y rounded-[10px] border border-line bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-cobalt"
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

      <FormError message={state.error} />

      <Button type="submit" disabled={pending} className="self-start px-6 py-3.5">
        {pending ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}

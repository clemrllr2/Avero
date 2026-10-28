"use client";

import { useActionState } from "react";
import { signInAction, type FormState } from "@/app/(auth)/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";

export function SignInForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signInAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthField label="E-mail" name="email" type="email" autoComplete="email" required />
      <AuthField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {/* Mode démo : à retirer quand Better Auth sera branché (tâche B2). */}
      <fieldset className="flex flex-col gap-2 rounded-[10px] border border-dashed border-ink/25 p-3.5">
        <legend className="px-1 text-sm font-medium">Mode démo : se connecter en tant que</legend>
        <label className="flex items-center gap-2 text-[15px]">
          <input type="radio" name="demoRole" value="CREATOR" defaultChecked /> Créateur (Léa Martin)
        </label>
        <label className="flex items-center gap-2 text-[15px]">
          <input type="radio" name="demoRole" value="BRAND" /> Marque
        </label>
      </fieldset>
      <FormError message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}

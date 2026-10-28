"use client";

import { useActionState } from "react";
import { signInAction, type FormState } from "@/app/(auth)/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";

export function SignInForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signInAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthField
        label="E-mail"
        name="email"
        type="email"
        defaultValue={state.values?.email}
        autoComplete="email"
        required
      />
      <AuthField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <FormError message={state.error} />
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}

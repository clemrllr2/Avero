"use client";

import { useActionState } from "react";
import { signUpAction, type FormState } from "@/app/(auth)/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/lib/types";
import { MIN_PASSWORD_LENGTH } from "@/lib/validation";

export function SignUpForm({ role }: { role: Role }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signUpAction, {});
  const isCreator = role === "CREATOR";

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="role" value={role} />
      <AuthField
        label={isCreator ? "Nom d'affichage" : "Nom de l'entreprise"}
        name="name"
        autoComplete={isCreator ? "nickname" : "organization"}
        required
      />
      <AuthField label="E-mail" name="email" type="email" autoComplete="email" required />
      <AuthField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={MIN_PASSWORD_LENGTH}
        hint={`${MIN_PASSWORD_LENGTH} caractères minimum.`}
        required
      />
      <FormError message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? "Création du compte…" : "Créer mon compte"}
      </Button>
    </form>
  );
}

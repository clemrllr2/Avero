"use client";

import { useActionState } from "react";
import { signInAction, type FormState } from "@/app/(auth)/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/lib/types";

export function SignInForm({ demoRole }: { demoRole: Role }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signInAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Mode démo : le rôle vient de l'onglet choisi (retiré quand Better Auth sera branché, tâche B2). */}
      <input type="hidden" name="demoRole" value={demoRole} />
      <AuthField label="E-mail" name="email" type="email" autoComplete="email" required />
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
      <p className="rounded-xl border border-dashed border-ink/20 px-3.5 py-2.5 text-sm text-muted">
        Mode démo : n&apos;importe quel e-mail et mot de passe fonctionnent.
      </p>
    </form>
  );
}

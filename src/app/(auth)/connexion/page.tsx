import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="display text-3xl font-extrabold">Se connecter</h1>
      <SignInForm />
      <p className="text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription?role=createur" className="font-semibold text-cobalt underline-offset-4 hover:underline">
          Créateur
        </Link>{" "}
        ou{" "}
        <Link href="/inscription?role=marque" className="font-semibold text-cobalt underline-offset-4 hover:underline">
          marque
        </Link>
      </p>
    </div>
  );
}

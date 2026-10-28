import Link from "next/link";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage({ searchParams }: PageProps<"/inscription">) {
  return (
    <div className="flex flex-col gap-8">
      {/* Le contenu dépend de ?role= : il est lu dans un Suspense (règle Next 16). */}
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <SignUpContent searchParams={searchParams} />
      </Suspense>
      <p className="text-sm text-muted">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-cobalt underline-offset-4 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

async function SignUpContent({ searchParams }: Pick<PageProps<"/inscription">, "searchParams">) {
  const { role } = await searchParams;
  const isBrand = role === "marque";

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="display text-3xl font-extrabold">
          {isBrand ? "Créer un compte marque" : "Créer un compte créateur"}
        </h1>
        <p className="text-muted">
          {isBrand
            ? "Vous démarrez avec le plan Free : le nombre de vues de chaque créateur, avec tri."
            : "Ensuite, tu relies Instagram et TikTok pour voir tes statistiques."}
        </p>
        <p className="text-sm">
          <Link
            href={isBrand ? "/inscription?role=createur" : "/inscription?role=marque"}
            className="text-cobalt underline-offset-4 hover:underline"
          >
            {isBrand ? "Vous êtes créateur ?" : "Tu représentes une marque ?"}
          </Link>
        </p>
      </div>

      {/* key : réinitialise le formulaire quand on change de type de compte */}
      <SignUpForm key={isBrand ? "BRAND" : "CREATOR"} role={isBrand ? "BRAND" : "CREATOR"} />
    </>
  );
}

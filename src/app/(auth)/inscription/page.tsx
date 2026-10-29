import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RoleTabs } from "@/components/auth/RoleTabs";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { parseRoleSlug, roleFromSlug } from "@/lib/roles";
import { pageMetadata } from "@/lib/site";

// Canonique sans ?role= : les variantes créateur et marque comptent comme une seule page pour Google.
export const metadata: Metadata = pageMetadata({
  title: "Créer un compte créateur ou marque",
  description:
    "Créez votre compte AVERO gratuitement. Créateurs : reliez Instagram et TikTok. Marques : trouvez des créateurs sur des statistiques vérifiées.",
  path: "/inscription",
});

export default function SignUpPage({ searchParams }: PageProps<"/inscription">) {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="display text-[34px] leading-tight font-extrabold">Créer un compte</h1>
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
  const slug = parseRoleSlug((await searchParams).role);

  return (
    <>
      <RoleTabs value={slug} basePath="/inscription" />
      <p className="-mt-2 text-muted">
        {slug === "marque"
          ? "Vous démarrez avec le plan Free : le nombre de vues de chaque créateur, avec tri."
          : "Ensuite, tu relies Instagram et TikTok pour voir tes statistiques."}
      </p>
      {/* key : réinitialise le formulaire quand on change d'onglet */}
      <SignUpForm key={slug} role={roleFromSlug(slug)} />
    </>
  );
}

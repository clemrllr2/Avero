import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RoleTabs } from "@/components/auth/RoleTabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { parseRoleSlug } from "@/lib/roles";
import { pageMetadata } from "@/lib/site";

// Page utile aux membres seulement : pas d'intérêt à apparaître dans Google (les liens restent suivis).
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Se connecter",
    description: "Connectez-vous à votre espace AVERO, créateur ou marque, pour retrouver vos statistiques Instagram et TikTok.",
    path: "/connexion",
  }),
  robots: { index: false, follow: true },
};

export default function SignInPage({ searchParams }: PageProps<"/connexion">) {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="display text-[34px] leading-tight font-extrabold">Se connecter</h1>
      {/* Le contenu dépend de ?role= : il est lu dans un Suspense (règle Next 16). */}
      <Suspense fallback={<p className="text-muted">Chargement…</p>}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SignInContent({ searchParams }: Pick<PageProps<"/connexion">, "searchParams">) {
  const slug = parseRoleSlug((await searchParams).role);
  const isBrand = slug === "marque";

  return (
    <>
      <RoleTabs value={slug} basePath="/connexion" />
      <p className="-mt-2 text-muted">
        {isBrand
          ? "Retrouvez les statistiques des créateurs selon votre plan."
          : "Retrouve tes statistiques Instagram et TikTok."}
      </p>
      <SignInForm />
      <p className="text-sm text-muted">
        {isBrand ? "Pas encore de compte marque ?" : "Pas encore de compte créateur ?"}{" "}
        <Link
          href={`/inscription?role=${slug}`}
          className="font-semibold text-cobalt underline-offset-4 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </>
  );
}

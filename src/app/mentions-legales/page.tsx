import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";

export const metadata: Metadata = {
  title: "Mentions légales — AVERO",
};

const UPDATED_ON = "28 octobre 2026";

/** Information que l'éditeur du site doit fournir avant la mise en ligne. */
function ToFill({ children = "À compléter" }: { children?: string }) {
  return <mark className="rounded bg-signal/60 px-1 text-ink">[{children}]</mark>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-line pt-8">
      <h2 className="display text-xl font-bold">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}

export default function LegalNoticePage() {
  return (
    <>
      <SiteNav anchorsBase="/" />
      <header className="section-dark grain">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pt-36 pb-16 sm:px-8">
          <h1 className="display text-[40px] leading-tight font-extrabold sm:text-[52px]">Mentions légales</h1>
          <p className="text-paper/60">Dernière mise à jour : {UPDATED_ON}</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:px-8">
        <Section title="Éditeur du site">
          <p>
            Le site AVERO est édité par <strong><ToFill>raison sociale</ToFill></strong>,{" "}
            <ToFill>forme juridique</ToFill> au capital de <ToFill>montant</ToFill>, dont le siège
            est situé <ToFill>adresse</ToFill>, immatriculée sous le numéro SIRET <ToFill>numéro</ToFill>.
          </p>
          <p>
            Contact : <ToFill>adresse e-mail</ToFill>
          </p>
        </Section>

        <Section title="Directeur de la publication">
          <p>
            <ToFill>nom et fonction</ToFill>
          </p>
        </Section>

        <Section title="Hébergement">
          <p>
            <ToFill>À compléter au déploiement : nom, adresse et téléphone de l&apos;hébergeur</ToFill>
          </p>
        </Section>

        <Section title="Données personnelles">
          <p>
            <strong>Données collectées.</strong> Nom d&apos;affichage ou nom de l&apos;entreprise, adresse
            e-mail, et pour les créateurs, les statistiques des comptes Instagram et TikTok qu&apos;ils
            choisissent de relier.
          </p>
          <p>
            <strong>Finalité.</strong> Afficher ces statistiques au créateur concerné et aux marques
            inscrites sur AVERO, selon leur plan.
          </p>
          <p>
            <strong>Durée de conservation.</strong> Jusqu&apos;à la suppression du compte. Les données
            d&apos;un réseau sont supprimées dès que le créateur le déconnecte.
          </p>
          <p>
            <strong>Vos droits.</strong> Vous pouvez accéder à vos données, les rectifier ou les faire
            supprimer en écrivant à <ToFill>adresse e-mail</ToFill>. Vous pouvez aussi adresser une
            réclamation à la CNIL (cnil.fr).
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            AVERO utilise un seul cookie : le cookie de session, strictement nécessaire pour rester
            connecté. Il ne sert ni à la mesure d&apos;audience ni à la publicité, il ne demande donc
            pas de consentement.
          </p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>
            Les textes, le logo et l&apos;interface d&apos;AVERO sont protégés. Toute reproduction
            sans autorisation est interdite. Les noms Instagram et TikTok appartiennent à leurs
            propriétaires respectifs.
          </p>
        </Section>

        <p className="border-t border-line pt-8 text-sm text-muted">
          <Link href="/" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

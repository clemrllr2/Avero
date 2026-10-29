import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/content/PageShell";
import { GUIDES } from "@/content/guides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Guides Instagram et TikTok pour créateurs et marques",
  description:
    "Guides pratiques sur les statistiques Instagram et TikTok : taux d'engagement, faux abonnés, compte professionnel. Pour les créateurs et les marques.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <PageShell
      crumbs={[{ name: "Guides", path: "/guides" }]}
      title="Guides Instagram et TikTok"
      intro="Comprendre les statistiques, les vérifier et les présenter : des réponses claires, pour les créateurs comme pour les marques."
    >
      <ul className="grid gap-5 md:grid-cols-2">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group flex h-full flex-col gap-3 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-cobalt/40 sm:p-7"
            >
              <span className="text-sm text-muted">
                {guide.audience} · {guide.readingMinutes} min de lecture
              </span>
              <h2 className="display text-xl leading-snug font-bold group-hover:text-cobalt sm:text-2xl">{guide.heading}</h2>
              <p className="text-muted">{guide.description}</p>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/outils/calcul-taux-engagement"
            className="group flex h-full flex-col gap-3 rounded-3xl bg-night p-6 text-paper transition-colors hover:bg-night-soft sm:p-7"
          >
            <span className="text-sm text-paper/60">Outil gratuit</span>
            <h2 className="display text-xl leading-snug font-bold sm:text-2xl">Calculateur de taux d&apos;engagement</h2>
            <p className="text-paper/70">Saisissez les chiffres d&apos;une publication et obtenez le taux par vues et par abonnés.</p>
          </Link>
        </li>
      </ul>
    </PageShell>
  );
}

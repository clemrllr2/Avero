import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideBlocks } from "@/components/content/GuideBlocks";
import { ContentSection, PageShell } from "@/components/content/PageShell";
import { buttonClass } from "@/components/ui/Button";
import { GUIDES, findGuide } from "@/content/guides";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { guideJsonLd } from "@/lib/structured-data";

// Tous les guides sont connus à l'avance : pages générées au build. Adresse inconnue → notFound() (404).
export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}` });
}

const DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const others = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <PageShell
      crumbs={[
        { name: "Guides", path: "/guides" },
        { name: guide.heading, path: `/guides/${guide.slug}` },
      ]}
      title={guide.heading}
      intro={guide.intro}
      meta={
        <>
          Pour : {guide.audience} · {guide.readingMinutes} min de lecture · Mis à jour le{" "}
          <time dateTime={guide.updatedOn}>{DATE.format(new Date(guide.updatedOn))}</time>
        </>
      }
      jsonLd={[guideJsonLd(SITE_URL, guide)]}
    >
      {guide.sections.map((section) => (
        <ContentSection key={section.heading} title={section.heading}>
          <GuideBlocks blocks={section.blocks} />
        </ContentSection>
      ))}

      <aside className="flex flex-col gap-5 rounded-3xl bg-night p-7 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div className="flex flex-col gap-2">
          <p className="display text-2xl font-bold">Des statistiques lues à la source</p>
          <p className="max-w-[48ch] text-paper/70">
            Créateurs, reliez Instagram et TikTok en un clic. Marques, comparez des chiffres impossibles à retoucher.
          </p>
        </div>
        <Link href="/inscription" className={buttonClass("primary", "shrink-0 px-6 py-3.5")}>
          Créer un compte gratuit
        </Link>
      </aside>

      <section className="flex flex-col gap-4">
        <h2 className="display text-xl font-bold">À lire aussi</h2>
        <ul className="flex flex-col gap-2">
          {others.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="font-semibold text-cobalt underline-offset-4 hover:underline">
                {g.heading}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

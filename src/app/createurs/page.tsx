import type { Metadata } from "next";
import Link from "next/link";
import { AudienceFaq } from "@/components/content/AudienceFaq";
import { ContentSection, PageShell } from "@/components/content/PageShell";
import { buttonClass } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/visual/Icon";
import { faqForTopic } from "@/lib/contact";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Statistiques Instagram et TikTok pour créateurs",
  description:
    "Créateur ? Relie Instagram et TikTok à AVERO et montre aux marques des statistiques vérifiées, toujours à jour : un kit média sans capture d'écran.",
  path: "/createurs",
});

const STATS: { icon: IconName; label: string; text: string }[] = [
  { icon: "eye", label: "Vues sur 30 jours", text: "Toutes tes publications Instagram et TikTok réunies." },
  { icon: "users", label: "Abonnés et évolution", text: "Ton nombre d'abonnés et sa progression sur 30 jours." },
  { icon: "heart", label: "Taux d'engagement", text: "Likes, commentaires et partages rapportés aux vues." },
  { icon: "chart", label: "Vues moyennes par publication", text: "Ce qu'une collaboration peut vraiment toucher." },
  { icon: "calendar", label: "Rythme de publication", text: "Le nombre de publications des 30 derniers jours." },
  { icon: "globe", label: "Audience Instagram", text: "Âge, genre et pays de ton audience." },
];

const STEPS = [
  { title: "Crée ton compte", text: "Gratuit, pour toujours." },
  { title: "Relie Instagram et TikTok", text: "Un clic par réseau. Pour Instagram, il faut un compte professionnel (gratuit)." },
  { title: "Tes chiffres sont prêts", text: "Ils se mettent à jour tout seuls et les marques les voient tels quels." },
];

export default function CreatorsPage() {
  return (
    <PageShell
      crumbs={[{ name: "Créateurs", path: "/createurs" }]}
      title="Tes statistiques Instagram et TikTok, vérifiées et toujours à jour"
      intro="Relie tes comptes en un clic : AVERO lit tes statistiques directement sur Instagram et TikTok. Plus de captures d'écran à envoyer, et des chiffres que les marques peuvent croire."
      meta={
        <Link href="/inscription?role=createur" className={buttonClass("primary", "mt-2 px-6 py-3.5")}>
          Créer mon compte créateur
        </Link>
      }
    >
      <ContentSection title="Un kit média qui se met à jour tout seul">
        <p>
          Un kit média en PDF est périmé dès qu&apos;il est envoyé, et une capture d&apos;écran se retouche en quelques secondes. Sur
          AVERO, tes chiffres sont lus à la source : ils restent à jour, et personne ne peut les modifier, pas même toi.
        </p>
      </ContentSection>

      <section className="flex flex-col gap-6">
        <h2 className="display text-[26px] font-bold sm:text-[32px]">Ce que tu obtiens</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat) => (
            <li key={stat.label} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
              <span aria-hidden className="grid size-10 place-items-center rounded-xl bg-cobalt/10 text-cobalt">
                <Icon name={stat.icon} className="size-5" />
              </span>
              <span className="font-semibold">{stat.label}</span>
              <span className="text-[15px] text-muted">{stat.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="display text-[26px] font-bold sm:text-[32px]">Comment ça marche</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-2xl bg-paper p-1">
              <span aria-hidden className="display grid size-9 shrink-0 place-items-center rounded-full bg-night text-sm font-bold text-paper">
                {i + 1}
              </span>
              <span className="flex flex-col gap-1 pt-1">
                <span className="font-semibold">{step.title}</span>
                <span className="text-[15px] text-muted">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-[15px] text-muted">
          Ton compte Instagram est personnel ?{" "}
          <Link href="/guides/compte-professionnel-instagram" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            Voici comment passer en compte professionnel
          </Link>
          .
        </p>
      </section>

      <ContentSection title="Tes données restent à toi">
        <p>
          Les marques voient uniquement des statistiques : vues, abonnés, engagement et, pour les marques Premium, la répartition de
          ton audience. Jamais tes messages ni tes identifiants. Tu peux déconnecter un réseau à tout moment : ses données sont
          alors supprimées d&apos;AVERO.
        </p>
      </ContentSection>

      <section className="flex flex-col gap-5">
        <h2 className="display text-[26px] font-bold sm:text-[32px]">Questions fréquentes</h2>
        <AudienceFaq items={faqForTopic("CREATOR")} />
      </section>

      <aside className="flex flex-col gap-5 rounded-3xl bg-night p-7 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <p className="display text-2xl font-bold">Prêt à montrer tes vrais chiffres ?</p>
        <Link href="/inscription?role=createur" className={buttonClass("primary", "shrink-0 px-6 py-3.5")}>
          Créer mon compte créateur
        </Link>
      </aside>
    </PageShell>
  );
}

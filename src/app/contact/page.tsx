import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { Aurora } from "@/components/visual/Aurora";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Une question sur AVERO, votre compte créateur ou marque, ou nos plans ? Écrivez-nous : nous répondons par e-mail, et la réponse est parfois déjà dans la FAQ.",
  path: "/contact",
});

/** Ce qui se passe après l'envoi : une vraie suite d'étapes, d'où la numérotation. */
const NEXT_STEPS = [
  { title: "Vous envoyez votre message", text: "En choisissant votre profil, la réponse s'affiche parfois tout de suite." },
  { title: "Nous le lisons", text: "Chaque message arrive directement à l'équipe AVERO." },
  { title: "Nous vous répondons par e-mail", text: "À l'adresse que vous indiquez dans le formulaire." },
];

export default function ContactPage() {
  return (
    <>
      <SiteNav anchorsBase="/" />
      <div className="section-dark grain relative isolate overflow-hidden">
        <Aurora />
        <div className="mx-auto max-w-7xl px-4 pt-36 pb-16 sm:px-8 lg:pb-40">
          <header className="flex flex-col gap-5">
            {/* Espace insécable avant « ? » et trait d'union insécable : pas de « ? » ni de « nous » seul en début de ligne. */}
            <h1 className="display text-[42px] leading-[1.02] font-extrabold sm:text-[56px]">
              Une question{"\u00a0"}? Écrivez{"\u2011"}nous.
            </h1>
            <p className="max-w-[44ch] text-lg text-paper/70">
              Créateur, marque ou simple curieux : décrivez votre demande, nous vous répondons par e-mail.
            </p>
          </header>
        </div>
      </div>

      {/* relative z-10 : la carte du formulaire passe au-dessus du bandeau sombre qu'elle chevauche. */}
      <main className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-8 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        {/* Sur ordinateur, la carte remonte sur le bandeau sombre ; la colonne de gauche reste sur fond clair. */}
        <section
          aria-label="Formulaire de contact"
          className="order-1 -mt-6 self-start rounded-[28px] border border-line bg-surface p-6 shadow-[0_40px_90px_-40px_rgba(15,16,48,0.45)] sm:p-8 lg:order-2 lg:-mt-32"
        >
          <ContactForm />
        </section>

        <aside className="order-2 flex flex-col gap-10 lg:order-1 lg:pt-14">
          <div className="flex flex-col gap-5">
            <h2 className="display text-xl font-bold">Après l&apos;envoi</h2>
            <ol className="flex flex-col gap-5">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="display grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 text-sm font-bold"
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5 pt-1.5">
                    <span className="font-semibold">{step.title}</span>
                    <span className="text-[15px] text-muted">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-8 text-[15px] text-muted">
            <p>
              Pas encore de compte ?{" "}
              <Link href="/inscription?role=createur" className="font-semibold text-cobalt underline-offset-4 hover:underline">
                Créer un compte créateur
              </Link>{" "}
              ou{" "}
              <Link href="/inscription?role=marque" className="font-semibold text-cobalt underline-offset-4 hover:underline">
                un compte marque
              </Link>
              .
            </p>
            <p>
              Toutes les réponses déjà publiées sont dans les{" "}
              <Link href="/#faq" className="font-semibold text-cobalt underline-offset-4 hover:underline">
                questions fréquentes
              </Link>
              .
            </p>
          </div>
        </aside>
      </main>

      <SiteFooter />
    </>
  );
}

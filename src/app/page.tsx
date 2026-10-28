import { AppHeader } from "@/components/AppHeader";
import { PlanComparison } from "@/components/PlanComparison";
import { ViewCounterFrames } from "@/components/home/ViewCounterFrames";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <AppHeader
        right={
          <ButtonLink href="/connexion" variant="ghost" className="px-3 py-2">
            Se connecter
          </ButtonLink>
        }
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 pt-12 pb-24 sm:px-6 sm:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col gap-6">
            <h1 className="display text-[30px] leading-[1.08] font-extrabold sm:text-[44px] lg:text-[56px] lg:leading-[1.05]">
              Les statistiques des créateurs, lues directement sur Instagram et TikTok.
            </h1>
            <p className="max-w-[52ch] text-lg text-muted">
              Les créateurs relient leurs comptes en un clic. Les marques comparent des chiffres
              qui viennent des réseaux, pas de captures d&apos;écran.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/inscription?role=createur">Je suis créateur</ButtonLink>
              <ButtonLink href="/inscription?role=marque" variant="secondary">
                Je suis une marque
              </ButtonLink>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[480px]">
            <ViewCounterFrames />
          </div>
        </section>

        <section className="grid gap-10 border-t border-line pt-12 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="display text-2xl font-bold">Pour les créateurs</h2>
            <p className="max-w-[48ch] text-muted">
              Vues, abonnés, engagement et audience de vos comptes Instagram et TikTok, réunis au
              même endroit et mis à jour à chaque visite. C&apos;est gratuit.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="display text-2xl font-bold">Pour les marques</h2>
            <p className="max-w-[48ch] text-muted">
              Classez les créateurs par vues réelles sans payer. Débloquez l&apos;engagement, les
              graphiques et l&apos;audience avec Basic ou Premium.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="display text-2xl font-bold">Trois plans pour les marques</h2>
          <PlanComparison />
        </section>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted sm:px-6">
          AVERO, version de lancement.
        </p>
      </footer>
    </>
  );
}

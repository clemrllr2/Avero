import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="section-dark grain flex min-h-svh flex-col items-start justify-center gap-6 px-6 sm:px-16">
      <p className="display text-[72px] leading-none font-extrabold text-paper/20 sm:text-[120px]">404</p>
      <h1 className="display text-3xl font-extrabold sm:text-5xl">Page introuvable</h1>
      <p className="max-w-[48ch] text-lg text-paper/70">
        Cette page n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
    </main>
  );
}

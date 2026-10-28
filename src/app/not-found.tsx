import { ButtonLink } from "@/components/ui/Button";
import { Aurora } from "@/components/visual/Aurora";
import { PostThumb } from "@/components/visual/PostThumb";

export default function NotFound() {
  return (
    <main className="section-dark grain relative isolate flex min-h-svh items-center overflow-hidden px-6 sm:px-16">
      <Aurora />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <p className="display text-gradient text-[96px] leading-none font-extrabold sm:text-[160px]">404</p>
          <h1 className="display text-3xl font-extrabold sm:text-5xl">Page introuvable</h1>
          <p className="max-w-[48ch] text-lg text-paper/70">
            Cette page n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        </div>
        <div aria-hidden className="relative mx-auto hidden h-[420px] w-full max-w-[380px] lg:block">
          <div className="float-slow absolute top-0 left-0 w-[46%] -rotate-6">
            <PostThumb seed="introuvable-1" className="opacity-90 ring-1 ring-white/20" />
          </div>
          <div className="float-slow absolute right-0 bottom-0 w-[50%] rotate-6" style={{ animationDelay: "-3s" }}>
            <PostThumb seed="introuvable-2" className="ring-1 ring-white/20" />
          </div>
        </div>
      </div>
    </main>
  );
}

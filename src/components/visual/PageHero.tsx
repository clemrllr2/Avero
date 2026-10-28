import type { ReactNode } from "react";
import { Aurora } from "@/components/visual/Aurora";

/**
 * Bannière sombre en haut des pages connectées : aurore, élément de tête facultatif (avatar…),
 * titre, sous-titre, contenu libre, et zone à droite (chiffre clé, bouton).
 */
export function PageHero({
  title,
  subtitle,
  leading,
  aside,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="section-dark relative isolate overflow-hidden rounded-[32px] px-6 py-8 sm:px-10 sm:py-10">
      <Aurora />
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {leading}
          <div className="flex flex-col gap-2">
            <h1 className="display text-3xl leading-tight font-extrabold sm:text-[40px]">{title}</h1>
            {subtitle && <div className="max-w-[60ch] text-paper/70">{subtitle}</div>}
            {children}
          </div>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </section>
  );
}

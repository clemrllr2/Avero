import { Reveal } from "@/components/motion/Reveal";
import { FAQ_ITEMS } from "@/lib/landing-content";

/**
 * Accordéon natif (<details name="faq"> : une seule question ouverte à la fois, fonctionne sans JavaScript).
 * L'ouverture est animée en CSS (voir .faq-item dans globals.css).
 */
export function Faq() {
  return (
    <section id="faq" className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-28 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:py-36">
        <Reveal>
          <h2 className="display text-[34px] leading-[1.05] font-extrabold sm:text-[48px]">
            Questions fréquentes
          </h2>
        </Reveal>
        <Reveal stagger={0.06} className="flex flex-col">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} name="faq" className="faq-item group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold sm:text-xl [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-xl transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[62ch] pb-6 text-muted">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

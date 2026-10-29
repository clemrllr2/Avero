import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/visual/Icon";
import { FAQ_ITEMS } from "@/lib/landing-content";

/**
 * Accordéon natif (<details name="faq"> : une seule question ouverte à la fois, fonctionne sans JavaScript).
 * L'ouverture est animée en CSS (voir .faq-item dans globals.css).
 */
export function Faq() {
  return (
    <section id="faq" className="dot-grid-ink border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-28 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:py-36">
        <Reveal className="flex flex-col gap-6">
          <h2 className="display text-[34px] leading-[1.05] font-extrabold sm:text-[48px]">
            Questions fréquentes
          </h2>
          <span aria-hidden className="grid size-20 place-items-center rounded-[28px] bg-gradient-to-br from-cobalt via-violet to-instagram text-white shadow-[0_24px_50px_-20px_rgba(124,92,255,0.8)]">
            <Icon name="question" className="size-9" />
          </span>
          <p className="text-muted">
            Une autre question ?{" "}
            <Link href="/contact" className="font-semibold text-cobalt underline-offset-4 hover:underline">
              Écrivez-nous
            </Link>
          </p>
        </Reveal>
        <Reveal stagger={0.06} className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              name="faq"
              className="faq-item group rounded-3xl border border-line bg-surface px-5 transition-colors open:border-cobalt/30 open:shadow-[0_20px_50px_-30px_rgba(59,70,241,0.5)] sm:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-lg font-semibold sm:text-xl [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-2xl bg-cobalt/8 text-cobalt transition-colors group-open:bg-cobalt group-open:text-white"
                >
                  <Icon name={item.icon} className="size-5" />
                </span>
                <span className="flex-1">{item.question}</span>
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-xl transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[62ch] pb-6 pl-14 text-muted">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

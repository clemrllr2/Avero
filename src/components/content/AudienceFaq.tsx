import { Icon } from "@/components/visual/Icon";
import type { FAQ_ITEMS } from "@/lib/landing-content";

/** Questions fréquentes d'un public (créateurs ou marques), en accordéon natif. */
export function AudienceFaq({ items }: { items: typeof FAQ_ITEMS }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details key={item.question} className="group rounded-2xl border border-line bg-surface px-5 open:border-cobalt/30">
          <summary className="flex cursor-pointer list-none items-center gap-3 py-4 font-semibold [&::-webkit-details-marker]:hidden">
            <Icon name={item.icon} className="size-4.5 shrink-0 text-cobalt" />
            <span className="flex-1">{item.question}</span>
            <span aria-hidden className="text-xl text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="pb-5 pl-7.5 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

import Link from "next/link";
import type { GuideBlock } from "@/content/guides";
import { Icon } from "@/components/visual/Icon";

/** Affiche les blocs d'un guide : paragraphe, liste, étapes numérotées, encadré, liens. */
export function GuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "p":
        return <p key={i}>{block.text}</p>;
      case "list":
        return (
          <ul key={i} className="flex flex-col gap-3">
            {block.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-cobalt/10 text-cobalt">
                  <Icon name="check" className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        );
      case "steps":
        // Une vraie suite d'actions : d'où la numérotation.
        return (
          <ol key={i} className="flex flex-col gap-3">
            {block.items.map((item, n) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="display grid size-7 shrink-0 place-items-center rounded-full border border-ink/15 text-sm font-bold">
                  {n + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
        );
      case "note":
        return (
          <p key={i} className="rounded-2xl border-l-4 border-signal bg-signal/15 px-5 py-4 text-[16px] text-ink">
            {block.text}
          </p>
        );
      case "links":
        return (
          <div key={i} className="flex flex-wrap gap-3">
            {block.items.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-ink/15 bg-surface px-4 py-2.5 text-[15px] font-semibold text-cobalt transition-colors hover:border-cobalt"
              >
                {link.label}
              </Link>
            ))}
          </div>
        );
    }
  });
}

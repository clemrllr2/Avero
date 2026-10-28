import Link from "next/link";
import { Icon, type IconName } from "@/components/visual/Icon";
import type { RoleSlug } from "@/lib/roles";

const TABS: { value: RoleSlug; label: string; icon: IconName }[] = [
  { value: "createur", label: "Je suis créateur", icon: "play" },
  { value: "marque", label: "Je suis une marque", icon: "building" },
];

/** Deux onglets (de simples liens) qui changent ?role= dans l'adresse de la page courante. */
export function RoleTabs({ value, basePath }: { value: RoleSlug; basePath: "/connexion" | "/inscription" }) {
  return (
    <nav aria-label="Type de compte" className="grid grid-cols-2 gap-1 rounded-2xl bg-ink/5 p-1">
      {TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <Link
            key={tab.value}
            href={`${basePath}?role=${tab.value}`}
            aria-current={active ? "page" : undefined}
            replace
            scroll={false}
            className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-center text-sm font-semibold whitespace-nowrap transition-colors ${
              active ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            <span
              aria-hidden
              className={`grid size-6 shrink-0 place-items-center rounded-lg ${
                active ? "bg-gradient-to-br from-cobalt to-violet text-white" : "bg-ink/5"
              }`}
            >
              <Icon name={tab.icon} className="size-3.5" />
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

import Link from "next/link";
import type { RoleSlug } from "@/lib/roles";

const TABS: { value: RoleSlug; label: string }[] = [
  { value: "createur", label: "Je suis créateur" },
  { value: "marque", label: "Je suis une marque" },
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
            className={`rounded-xl px-3 py-2.5 text-center text-[15px] font-semibold transition-colors ${
              active ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

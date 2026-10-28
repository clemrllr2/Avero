import type { AudienceData, Breakdown, NetworkData } from "@/lib/types";

const GENDERS: Record<string, string> = { F: "Femmes", M: "Hommes", U: "Non précisé" };
const COUNTRIES = new Intl.DisplayNames(["fr"], { type: "region" });

function share(items: Breakdown[]): { label: string; percent: number }[] {
  const total = items.reduce((sum, i) => sum + i.count, 0) || 1;
  return items.map((i) => ({ label: i.label, percent: Math.round((i.count / total) * 100) }));
}

function Bars({ title, items }: { title: string; items: { label: string; percent: number }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="truncate text-muted">{item.label}</span>
            <span className="h-2 rounded-full bg-ink/5">
              <span className="block h-full rounded-full bg-cobalt" style={{ width: `${item.percent}%` }} />
            </span>
            <span className="text-right tabular-nums">{item.percent} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AudienceBreakdown({ audience }: { audience: AudienceData }) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Bars title="Âge" items={share(audience.ages)} />
      <Bars
        title="Genre"
        items={share(audience.genders).map((g) => ({ ...g, label: GENDERS[g.label] ?? g.label }))}
      />
      <Bars
        title="Pays"
        items={share(audience.countries).map((c) => ({ ...c, label: COUNTRIES.of(c.label) ?? c.label }))}
      />
    </div>
  );
}

/** Audience Instagram (TikTok ne la fournit pas). */
export function AudiencePanel({ networks }: { networks: NetworkData[] }) {
  const instagram = networks.find((n) => n.platform === "INSTAGRAM");
  if (!instagram) {
    return <p className="text-muted">L&apos;audience est disponible pour les comptes Instagram uniquement.</p>;
  }
  if (!instagram.audience) {
    return <p className="text-muted">Audience disponible à partir de 100 abonnés sur Instagram.</p>;
  }
  return <AudienceBreakdown audience={instagram.audience} />;
}

import { GenderDonut } from "@/components/charts/GenderDonut";
import { Icon, type IconName } from "@/components/visual/Icon";
import type { AudienceData, Breakdown, NetworkData } from "@/lib/types";
import { countryFlag } from "@/lib/visual";

const GENDERS: Record<string, string> = { F: "Femmes", M: "Hommes", U: "Non précisé" };
const COUNTRIES = new Intl.DisplayNames(["fr"], { type: "region" });

function share(items: Breakdown[]): { label: string; percent: number }[] {
  const total = items.reduce((sum, i) => sum + i.count, 0) || 1;
  return items.map((i) => ({ label: i.label, percent: Math.round((i.count / total) * 100) }));
}

function Panel({ title, icon, children }: { title: string; icon: IconName; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-paper p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon name={icon} className="size-4 text-cobalt" />
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Barres horizontales en dégradé ; la plus forte part est mise en avant. */
function Bars({ items }: { items: { label: string; percent: number; flag?: string }[] }) {
  const max = Math.max(1, ...items.map((i) => i.percent));
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2 text-muted">
              {item.flag && (
                <span aria-hidden className="text-base leading-none">
                  {item.flag}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="font-semibold tabular-nums">{item.percent} %</span>
          </span>
          <span aria-hidden className="h-2 rounded-full bg-ink/6">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-cobalt to-violet"
              style={{ width: `${(item.percent / max) * 100}%` }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

function AudienceBreakdown({ audience }: { audience: AudienceData }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Panel title="Genre" icon="users">
        <GenderDonut items={share(audience.genders).map((g) => ({ ...g, label: GENDERS[g.label] ?? g.label }))} />
      </Panel>
      <Panel title="Âge" icon="calendar">
        <Bars items={share(audience.ages)} />
      </Panel>
      <Panel title="Pays" icon="globe">
        <Bars
          items={share(audience.countries).map((c) => ({
            ...c,
            label: COUNTRIES.of(c.label) ?? c.label,
            flag: countryFlag(c.label),
          }))}
        />
      </Panel>
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

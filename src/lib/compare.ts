export const MAX_COMPARED = 4;

/** Indice de la plus grande valeur ; null si aucune valeur ou si plusieurs créateurs sont à égalité en tête. */
export function bestIndex(values: (number | null)[]): number | null {
  let best: number | null = null;
  let tie = false;
  values.forEach((value, i) => {
    if (value === null) return;
    if (best === null || value > (values[best] as number)) {
      best = i;
      tie = false;
    } else if (value === values[best]) {
      tie = true;
    }
  });
  return tie ? null : best;
}

/**
 * Graphique radar : entrée [créateur][indicateur], chaque indicateur ramené entre 0 et 100
 * par rapport au meilleur créateur. Valeur absente, négative ou meilleur à 0 → 0.
 */
export function normalizeForRadar(values: (number | null)[][]): number[][] {
  const columns = values[0]?.length ?? 0;
  const max = Array.from({ length: columns }, (_, k) => Math.max(0, ...values.map((row) => row[k] ?? 0)));
  return values.map((row) =>
    row.map((v, k) => (v === null || v <= 0 || max[k] === 0 ? 0 : Math.round((v / max[k]) * 100))),
  );
}

/** Lit ?ids=c1,c2 : identifiants nettoyés, sans doublon, 4 au maximum. */
export function parseCompareIds(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return [];
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return [...new Set(ids)].slice(0, MAX_COMPARED);
}

/** Couleur de chaque créateur comparé, dans l'ordre de sélection (palette validée, skill dataviz). */
export const COMPARE_COLORS = ["#3b46f1", "#e8890c", "#0e9f9a", "#9b3fb5"] as const;

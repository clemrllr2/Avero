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

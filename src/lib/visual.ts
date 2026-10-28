/** Empreinte stable d'une chaîne (FNV-1a 32 bits, brassée). */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Brassage final (murmur3) : des chaînes proches donnent des empreintes très différentes.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Teintes des avatars : du bleu au rose framboise (215° à 345°), où le blanc reste lisible ; ni jaune ni vert. */
const HUE_START = 215;
const HUE_RANGE = 131;

/** Deux couleurs de dégradé (teintes voisines), toujours les mêmes pour un même nom, assez foncées pour des initiales blanches. */
export function avatarColors(seed: string): [string, string] {
  const hue = HUE_START + (hash(seed) % HUE_RANGE);
  return [`hsl(${hue} 72% 52%)`, `hsl(${(hue + 30) % 360} 72% 42%)`];
}

/** Dégradé des vignettes de posts : tout le cercle chromatique (le texte y repose sur un voile sombre). */
export function thumbColors(seed: string): [string, string] {
  const hue = hash(seed) % 360;
  return [`hsl(${hue} 80% 60%)`, `hsl(${(hue + 50) % 360} 75% 48%)`];
}

/** Nombre entier tiré d'une graine, entre 0 et max - 1 (choix des formes des vignettes). */
export function seededPick(seed: string, max: number): number {
  return hash(seed) % max;
}

/** « Léa Martin » → « LM » ; « nike » → « N » ; nom vide → « ? ». */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  // Array.from découpe par caractère (un emoji compte pour un seul caractère).
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : "";
  return (first + last).toUpperCase();
}

const round = (n: number) => Number(n.toFixed(2));

/**
 * Chemins SVG d'une mini-courbe : la plus petite valeur touche le bas, la plus grande le haut.
 * Valeurs absentes ou toutes égales : ligne plate à mi-hauteur.
 */
export function sparklinePath(values: number[], width: number, height: number): { line: string; area: string } {
  const points = values.length >= 2 ? values : [values[0] ?? 0, values[0] ?? 0];
  const min = Math.min(...points);
  const range = Math.max(...points) - min;
  const step = width / (points.length - 1);
  const coords = points.map((v, i) => {
    const y = range === 0 ? height / 2 : height - ((v - min) / range) * height;
    return `${round(i * step)} ${round(y)}`;
  });
  const line = `M${coords.join(" L")}`;
  return { line, area: `${line} L${width} ${height} L0 ${height} Z` };
}

/** Drapeau emoji d'un code pays ISO à 2 lettres (« FR » → 🇫🇷) ; chaîne vide si le code n'est pas valide. */
export function countryFlag(code: string): string {
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "";
  return String.fromCodePoint(...[...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

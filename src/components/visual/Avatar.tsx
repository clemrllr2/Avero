import { avatarColors, initials } from "@/lib/visual";

const SIZES = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[11px]",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl sm:size-24 sm:text-3xl",
};

/** Avatar dessiné : dégradé propre à chaque nom, initiales au centre. Décoratif (le nom est écrit à côté). */
export function Avatar({
  name,
  size = "md",
  ring = false,
  className = "",
}: {
  name: string;
  size?: keyof typeof SIZES;
  ring?: boolean;
  className?: string;
}) {
  const [from, to] = avatarColors(name);
  return (
    <span
      aria-hidden
      className={`display relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold text-white ${SIZES[size]} ${
        ring ? "ring-4 ring-white/90" : ""
      } ${className}`}
      style={{ backgroundImage: `radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.2), transparent 50%), linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials(name)}
    </span>
  );
}

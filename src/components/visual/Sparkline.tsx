import { useId } from "react";
import { sparklinePath } from "@/lib/visual";

const W = 100;
const H = 32;

/** Mini-courbe (trait + aire en dégradé) ; décorative, le chiffre voisin porte l'information. */
export function Sparkline({
  values,
  color = "#3b46f1",
  className = "h-10 w-full",
}: {
  values: number[];
  color?: string;
  className?: string;
}) {
  const id = useId();
  const { line, area } = sparklinePath(values, W, H);
  return (
    <svg aria-hidden viewBox={`0 -2 ${W} ${H + 4}`} preserveAspectRatio="none" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

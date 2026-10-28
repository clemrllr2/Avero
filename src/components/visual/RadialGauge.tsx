import type { ReactNode } from "react";

/** Anneau de progression : `value` entre 0 et 1 (bornée), contenu libre au centre. */
export function RadialGauge({
  value,
  label,
  size = 72,
  color = "#7c5cff",
  track = "rgb(25 25 52 / 0.08)",
  children,
}: {
  value: number;
  /** Résumé lu par les lecteurs d'écran ; sans libellé, la jauge est décorative. */
  label?: string;
  size?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(1, Math.max(0, value)) * circumference;
  return (
    <span {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })} className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke={track} strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      {children && <span className="relative">{children}</span>}
    </span>
  );
}

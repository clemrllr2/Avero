import type { ReactNode } from "react";

/** Cadre de téléphone (bords arrondis, îlot en haut) autour de n'importe quel contenu. */
export function PhoneMockup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19] rounded-[46px] bg-[#07081c] p-[9px] shadow-[0_50px_100px_-30px_rgba(5,6,30,0.85),inset_0_0_0_1.5px_rgba(255,255,255,0.14)] ${className}`}
    >
      <div className="relative size-full overflow-hidden rounded-[38px] bg-paper text-ink">
        <span aria-hidden className="absolute top-2.5 left-1/2 z-10 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-[#07081c]" />
        {children}
      </div>
    </div>
  );
}

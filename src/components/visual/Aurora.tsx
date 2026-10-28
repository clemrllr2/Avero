const BLOBS = {
  dark: [
    "-top-[30%] -left-[10%] w-[60%] bg-cobalt/45",
    "top-[5%] -right-[15%] w-[50%] bg-violet/45",
    "-bottom-[35%] left-[25%] w-[55%] bg-instagram/30",
    "-bottom-[20%] right-[5%] w-[35%] bg-tiktok/30",
  ],
  light: [
    "-top-[40%] -left-[10%] w-[55%] bg-cobalt/18",
    "top-[0%] -right-[15%] w-[45%] bg-violet/16",
    "-bottom-[40%] left-[30%] w-[50%] bg-instagram/12",
    "-bottom-[30%] right-[10%] w-[30%] bg-tiktok/14",
  ],
};

/**
 * Taches de lumière floues qui dérivent lentement. Décor pur.
 * Le parent doit être `relative isolate overflow-hidden` (l'aurore se place derrière son contenu).
 */
export function Aurora({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <div aria-hidden className={`aurora ${className}`}>
      {BLOBS[tone].map((blob) => (
        <span key={blob} className={`aurora-blob aspect-square ${blob}`} />
      ))}
    </div>
  );
}

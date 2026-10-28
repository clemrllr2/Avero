import Link from "next/link";

/** Logo AVERO : mot en Archivo élargi suivi d'une pastille en dégradé. */
export function Wordmark({ className = "text-xl" }: { className?: string }) {
  return (
    <Link href="/" className={`display inline-flex items-baseline gap-1 font-extrabold tracking-tight ${className}`}>
      AVERO
      <span aria-hidden className="inline-block size-[0.32em] rounded-full bg-gradient-to-br from-cobalt via-violet to-instagram" />
    </Link>
  );
}

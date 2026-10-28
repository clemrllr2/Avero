/** Bloc gris avec reflet, à la place d'un contenu en cours de chargement. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`} />;
}

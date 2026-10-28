import type { ReactNode } from "react";
import { Aurora } from "@/components/visual/Aurora";
import { PostThumb } from "@/components/visual/PostThumb";

/** Écran vide : invitation à agir, avec une illustration de vignettes à droite. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-[32px] border border-line bg-surface p-8 sm:p-10 md:grid-cols-[1.3fr_1fr]">
      <Aurora tone="light" />
      <div className="flex flex-col items-start gap-4">
        <h2 className="display text-3xl font-bold">{title}</h2>
        {children && <p className="max-w-[60ch] text-muted">{children}</p>}
        {action}
      </div>
      <div aria-hidden className="relative mx-auto hidden h-56 w-full max-w-[260px] md:block">
        <div className="float-slow absolute top-2 left-0 w-[42%] -rotate-6">
          <PostThumb seed="vide-1" platform="INSTAGRAM" />
        </div>
        <div className="float-slow absolute top-6 right-0 w-[42%] rotate-6" style={{ animationDelay: "-2.5s" }}>
          <PostThumb seed="vide-2" platform="TIKTOK" />
        </div>
      </div>
    </div>
  );
}

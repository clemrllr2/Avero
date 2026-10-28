import type { ReactNode } from "react";

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
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-8">
      <h2 className="display text-2xl font-bold">{title}</h2>
      {children && <p className="max-w-[60ch] text-muted">{children}</p>}
      {action}
    </div>
  );
}

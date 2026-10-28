import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/visual/Icon";

export function Card({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  title?: string;
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-line bg-surface p-5 shadow-[0_24px_60px_-48px_rgba(25,25,52,0.5)] sm:p-7 ${className}`}
    >
      {(title || action) && (
        <header className="mb-5 flex items-center justify-between gap-4">
          {title && (
            <h2 className="flex items-center gap-3 text-lg font-semibold">
              {icon && (
                <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-cobalt/8 text-cobalt">
                  <Icon name={icon} className="size-[18px]" />
                </span>
              )}
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

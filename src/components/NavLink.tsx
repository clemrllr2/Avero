"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border-b-2 py-1 ${active ? "border-cobalt font-semibold" : "border-transparent text-muted hover:text-ink"}`}
    >
      {children}
    </Link>
  );
}

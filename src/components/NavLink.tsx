"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_PILL } from "@/components/AppHeader";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${NAV_PILL} ${active ? "bg-paper text-ink" : "text-paper/65 hover:bg-paper/8 hover:text-paper"}`}
    >
      {children}
    </Link>
  );
}

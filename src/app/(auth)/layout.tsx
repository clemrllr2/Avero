import Link from "next/link";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <AuthShowcase />
      <main className="flex flex-col px-4 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="display text-xl font-extrabold tracking-tight lg:invisible">
            AVERO
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-ink">
            Retour à l&apos;accueil
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</div>
      </main>
    </div>
  );
}

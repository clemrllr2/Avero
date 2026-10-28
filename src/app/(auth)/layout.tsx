import Link from "next/link";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { Aurora } from "@/components/visual/Aurora";
import { Wordmark } from "@/components/visual/Wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <AuthShowcase />
      <main className="dot-grid-ink relative isolate flex flex-col overflow-hidden px-4 py-8 sm:px-10">
        <Aurora tone="light" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cobalt via-violet to-instagram lg:hidden" />
        <div className="flex items-center justify-between">
          <Wordmark className="text-xl lg:invisible" />
          <Link href="/" className="text-sm text-muted hover:text-ink">
            Retour à l&apos;accueil
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="glass-light rounded-[32px] p-6 shadow-[0_40px_80px_-40px_rgba(25,25,52,0.35)] sm:p-9">{children}</div>
        </div>
      </main>
    </div>
  );
}

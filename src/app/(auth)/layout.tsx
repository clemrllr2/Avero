import { AppHeader } from "@/components/AppHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-12 sm:py-16">{children}</main>
    </>
  );
}

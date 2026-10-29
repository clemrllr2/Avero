import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { Aurora } from "@/components/visual/Aurora";

export const metadata: Metadata = {
  title: "Contact — AVERO",
  description: "Une question sur AVERO ? Écrivez-nous.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNav anchorsBase="/" />
      <header className="section-dark grain relative isolate overflow-hidden">
        <Aurora />
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pt-36 pb-16 sm:px-8">
          <h1 className="display text-[40px] leading-tight font-extrabold sm:text-[52px]">Contact</h1>
          <p className="max-w-[52ch] text-lg text-paper/70">
            Une question sur AVERO, votre compte ou les plans ? Écrivez-nous, nous vous répondons par e-mail.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 sm:px-8">
        <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <ContactForm />
        </section>
        <p className="text-sm text-muted">
          Avant d&apos;écrire, la réponse est peut-être déjà dans les{" "}
          <Link href="/#faq" className="font-semibold text-cobalt underline-offset-4 hover:underline">
            questions fréquentes
          </Link>
          .
        </p>
      </main>

      <SiteFooter />
    </>
  );
}

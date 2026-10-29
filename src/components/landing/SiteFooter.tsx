import { cacheLife } from "next/cache";
import Link from "next/link";
import { Aurora } from "@/components/visual/Aurora";
import { Wordmark } from "@/components/visual/Wordmark";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "AVERO",
    links: [
      { href: "/#createurs", label: "Créateurs" },
      { href: "/#marques", label: "Marques" },
      { href: "/#plans", label: "Plans" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/connexion", label: "Se connecter" },
      { href: "/inscription?role=createur", label: "Créer un compte créateur" },
      { href: "/inscription?role=marque", label: "Créer un compte marque" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
];

/** Année courante, mise en cache pour que le footer reste dans la partie statique de la page. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="section-dark grain relative isolate overflow-hidden">
      <Aurora className="opacity-60" />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-20 pb-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-4">
            <Wordmark className="text-3xl" />
            <p className="max-w-[36ch] text-paper/60">
              Les statistiques des créateurs, lues directement sur Instagram et TikTok.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
                <h2 className="text-sm text-paper/50">{column.title}</h2>
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-paper/80 hover:text-paper">
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <p className="border-t border-paper/10 pt-8 text-sm text-paper/50">
          © AVERO <CurrentYear />
        </p>
      </div>
    </footer>
  );
}

import type { Platform } from "@/lib/types";

export const NAV_LINKS = [
  { href: "#createurs", label: "Créateurs" },
  { href: "#marques", label: "Marques" },
  { href: "#plans", label: "Plans" },
  { href: "#faq", label: "FAQ" },
] as const;

export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "D'où viennent les chiffres ?",
    answer:
      "Directement d'Instagram et de TikTok. Le créateur relie ses comptes et AVERO lit ses statistiques par les accès officiels des réseaux : personne ne peut les saisir ni les modifier à la main.",
  },
  {
    question: "Quels réseaux sont pris en charge ?",
    answer: "Instagram et TikTok. D'autres réseaux pourront suivre.",
  },
  {
    question: "Faut-il un compte Instagram professionnel ?",
    answer:
      "Oui. Instagram ne partage les statistiques que des comptes Créateur ou Entreprise. Le passage en compte professionnel est gratuit et prend une minute dans l'application Instagram.",
  },
  {
    question: "Combien coûte AVERO ?",
    answer:
      "Rien pour les créateurs. Pour les marques, le plan Free est gratuit ; Basic et Premium sont gratuits pendant la phase de lancement.",
  },
  {
    question: "Que voient les marques de mes données ?",
    answer:
      "Uniquement des statistiques : vues, abonnés, engagement et, en Premium, la répartition de l'audience (âge, sexe, pays). Jamais vos messages ni vos identifiants.",
  },
  {
    question: "Puis-je déconnecter un réseau ?",
    answer:
      "Oui, à tout moment depuis « Mes réseaux ». Les données de ce réseau sont alors supprimées d'AVERO.",
  },
];

/** Vignettes du hero. */
export const HERO_FRAMES: { handle: string; platform: Platform; views: number; fill: string }[] = [
  { handle: "@lea.martin", platform: "TIKTOK", views: 1_240_000, fill: "bg-tiktok" },
  { handle: "@hugo.cuisine", platform: "INSTAGRAM", views: 386_000, fill: "bg-instagram" },
  { handle: "@ines.danse", platform: "TIKTOK", views: 2_870_000, fill: "bg-cobalt" },
];

/** Aperçu du tableau de bord créateur (bloc Créateurs). */
export const CREATOR_PREVIEW_KPIS: { label: string; value: string }[] = [
  { label: "Vues sur 30 jours", value: "1,8 M" },
  { label: "Abonnés", value: "174 k" },
  { label: "Taux d'engagement", value: "6,4 %" },
  { label: "Nouveaux abonnés", value: "+12 400" },
];

/** Aperçu de la liste des créateurs (bloc Marques), dans l'ordre d'arrivée avant le tri. */
export const BRAND_PREVIEW_ROWS: { name: string; platform: Platform; views: number }[] = [
  { name: "Hugo Bernard", platform: "INSTAGRAM", views: 640_000 },
  { name: "Nathan Garcia", platform: "INSTAGRAM", views: 1_120_000 },
  { name: "Inès Robert", platform: "TIKTOK", views: 2_870_000 },
  { name: "Yanis Petit", platform: "TIKTOK", views: 210_000 },
  { name: "Léa Martin", platform: "TIKTOK", views: 1_780_000 },
];

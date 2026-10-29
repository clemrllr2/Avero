import type { IconName } from "@/components/visual/Icon";
import type { Platform } from "@/lib/types";
import { PLAN_MONTHLY_PRICE_EUR } from "@/lib/plans";

export const NAV_LINKS = [
  { href: "#createurs", label: "Créateurs" },
  { href: "#marques", label: "Marques" },
  { href: "#plans", label: "Plans" },
  { href: "#faq", label: "FAQ" },
] as const;

export const FAQ_ITEMS: { question: string; answer: string; icon: IconName }[] = [
  {
    icon: "link",
    question: "D'où viennent les chiffres ?",
    answer:
      "Directement d'Instagram et de TikTok. Le créateur relie ses comptes et AVERO lit ses statistiques par les accès officiels des réseaux : personne ne peut les saisir ni les modifier à la main.",
  },
  {
    icon: "globe",
    question: "Quels réseaux sont pris en charge ?",
    answer: "Instagram et TikTok. D'autres réseaux pourront suivre.",
  },
  {
    icon: "instagram",
    question: "Faut-il un compte Instagram professionnel ?",
    answer:
      "Oui. Instagram ne partage les statistiques que des comptes Créateur ou Entreprise. Le passage en compte professionnel est gratuit et prend une minute dans l'application Instagram.",
  },
  {
    icon: "bolt",
    question: "Combien coûte AVERO ?",
    answer:
      `Rien pour les créateurs. Pour les marques, le plan Free est gratuit ; Basic coûte ${PLAN_MONTHLY_PRICE_EUR.BASIC}\u00a0€ par mois et Premium ${PLAN_MONTHLY_PRICE_EUR.PREMIUM}\u00a0€ par mois, hors taxes.`,
  },
  {
    icon: "shield",
    question: "Que voient les marques de mes données ?",
    answer:
      "Uniquement des statistiques : vues, abonnés, engagement et, en Premium, la répartition de l'audience (âge, sexe, pays). Jamais vos messages ni vos identifiants.",
  },
  {
    icon: "unlink",
    question: "Puis-je déconnecter un réseau ?",
    answer:
      "Oui, à tout moment depuis « Mes réseaux ». Les données de ce réseau sont alors supprimées d'AVERO.",
  },
];

/** Vignettes du hero, autour du téléphone. */
/**
 * Vignettes du hero : vidéos Mixkit (licence gratuite, usage commercial, sans attribution) recadrées en 9:16,
 * 6 s, 360×640, sans son, dans public/videos/hero. Sources : cuisine = 40534, ugc = 50423, unboxing = 42122
 * (https://mixkit.co/free-stock-video/…-<id>/).
 */
export const HERO_FRAMES: { handle: string; platform: Platform; views: number; video: string }[] = [
  { handle: "@hugo.cuisine", platform: "INSTAGRAM", views: 386_000, video: "hero/cuisine" },
  { handle: "@lea.martin", platform: "TIKTOK", views: 1_240_000, video: "hero/ugc" },
  { handle: "@manon.mode", platform: "TIKTOK", views: 2_870_000, video: "hero/unboxing" },
];

/** Bandeau de chiffres sous le hero : des faits sur le produit, pas des statistiques d'utilisation. */
export const STATS_BAND: { value: number; suffix?: string; label: string }[] = [
  { value: 2, label: "réseaux réunis" },
  { value: 6, label: "indicateurs clés" },
  { value: 0, label: "capture d'écran" },
  { value: 100, suffix: "\u00a0%", label: "lu à la source" },
];

/** Aperçu du tableau de bord créateur (bloc Créateurs). */
export const CREATOR_PREVIEW_KPIS: {
  label: string;
  value: string;
  icon: IconName;
  color: string;
  spark?: number[];
  gauge?: number;
}[] = [
  { label: "Vues sur 30 jours", value: "1,8 M", icon: "eye", color: "#3b46f1", spark: [22, 30, 26, 41, 38, 52, 61, 74] },
  { label: "Abonnés", value: "174 k", icon: "users", color: "#7c5cff", spark: [40, 42, 45, 47, 52, 55, 60, 64] },
  { label: "Taux d'engagement", value: "6,4 %", icon: "heart", color: "#d6336c", gauge: 0.64 },
  { label: "Nouveaux abonnés", value: "+12 400", icon: "trend", color: "#0e9f9a", spark: [10, 14, 12, 18, 22, 21, 27, 31] },
];

/** Aperçu de la liste des créateurs (bloc Marques), dans l'ordre d'arrivée avant le tri. */
export const BRAND_PREVIEW_ROWS: { name: string; platform: Platform; views: number }[] = [
  { name: "Hugo Bernard", platform: "INSTAGRAM", views: 640_000 },
  { name: "Nathan Garcia", platform: "INSTAGRAM", views: 1_120_000 },
  { name: "Inès Robert", platform: "TIKTOK", views: 2_870_000 },
  { name: "Yanis Petit", platform: "TIKTOK", views: 210_000 },
  { name: "Léa Martin", platform: "TIKTOK", views: 1_780_000 },
];

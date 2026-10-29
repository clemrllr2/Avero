// Guides publics (/guides/[slug]) : contenu pour le référencement, écrit pour les créateurs et les marques.
// Règle : uniquement des faits vérifiables, aucun chiffre de marché inventé.

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "note"; text: string }
  | { type: "links"; items: { href: string; label: string }[] };

export interface Guide {
  slug: string;
  /** Titre de la page (onglet et Google) */
  title: string;
  description: string;
  /** Titre affiché dans la page */
  heading: string;
  intro: string;
  audience: "Créateurs" | "Marques" | "Créateurs et marques";
  readingMinutes: number;
  /** Date de mise à jour, au format AAAA-MM-JJ */
  updatedOn: string;
  sections: { heading: string; blocks: GuideBlock[] }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "taux-engagement",
    title: "Taux d'engagement Instagram et TikTok : le calcul",
    description:
      "Comment calculer le taux d'engagement sur Instagram et TikTok, par abonnés ou par vues, avec un exemple chiffré et un calculateur gratuit.",
    heading: "Taux d'engagement : définition et calcul",
    intro:
      "Le taux d'engagement mesure la part des personnes qui réagissent à une publication. C'est le chiffre que les marques regardent en premier, avant même le nombre d'abonnés.",
    audience: "Créateurs et marques",
    readingMinutes: 4,
    updatedOn: "2026-10-29",
    sections: [
      {
        heading: "Qu'est-ce que le taux d'engagement ?",
        blocks: [
          {
            type: "p",
            text: "Une publication peut être vue par beaucoup de monde sans provoquer de réaction. Le taux d'engagement compte les interactions (likes, commentaires, partages) et les rapporte à l'audience : il dit si le contenu fait réagir, pas seulement s'il est vu.",
          },
        ],
      },
      {
        heading: "Les deux façons de le calculer",
        blocks: [
          {
            type: "list",
            items: [
              "Par abonnés : (likes + commentaires + partages) ÷ nombre d'abonnés × 100. C'est la méthode historique d'Instagram.",
              "Par vues : (likes + commentaires + partages) ÷ nombre de vues × 100. Elle reflète mieux TikTok et les Reels, souvent vus par des personnes qui ne sont pas abonnées.",
            ],
          },
          {
            type: "note",
            text: "Pour comparer deux créateurs, utilisez la même méthode et la même période pour les deux : sinon les chiffres ne disent pas la même chose.",
          },
        ],
      },
      {
        heading: "Un exemple pas à pas",
        blocks: [
          {
            type: "steps",
            items: [
              "Une vidéo reçoit 500 likes, 40 commentaires et 60 partages : 600 interactions au total.",
              "Elle a été vue 8 000 fois : 600 ÷ 8 000 = 7,5 % d'engagement par vues.",
              "Le compte compte 20 000 abonnés : 600 ÷ 20 000 = 3 % d'engagement par abonnés.",
            ],
          },
          {
            type: "p",
            text: "Les deux résultats sont justes : ils répondent à deux questions différentes. Le premier dit si les personnes qui ont vu la vidéo ont réagi, le second rapporte les réactions à la taille de la communauté.",
          },
        ],
      },
      {
        heading: "Qu'est-ce qu'un bon taux d'engagement ?",
        blocks: [
          {
            type: "p",
            text: "Il n'existe pas de chiffre universel : le taux varie selon le réseau, la taille du compte et la thématique. Les petits comptes ont souvent un taux plus élevé que les très grands. Le plus utile est de comparer des comptes de taille et de sujet proches, et de suivre l'évolution d'un même compte dans le temps.",
          },
        ],
      },
      {
        heading: "Comment AVERO le calcule",
        blocks: [
          {
            type: "p",
            text: "AVERO calcule le taux par vues sur les 30 derniers jours : (likes + commentaires + partages) ÷ vues. Les chiffres sont lus directement sur Instagram et TikTok, une fois le compte relié : ils ne peuvent pas être saisis ni modifiés à la main.",
          },
          {
            type: "links",
            items: [
              { href: "/outils/calcul-taux-engagement", label: "Calculer un taux d'engagement" },
              { href: "/guides/reperer-faux-abonnes", label: "Repérer les faux abonnés" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "reperer-faux-abonnes",
    title: "Faux abonnés Instagram et TikTok : les repérer",
    description:
      "Les signaux qui trahissent des faux abonnés ou un engagement acheté sur Instagram et TikTok, et comment vérifier les chiffres d'un créateur.",
    heading: "Faux abonnés : comment les repérer",
    intro:
      "Un grand nombre d'abonnés ne garantit pas une vraie audience. Avant une collaboration, quelques vérifications simples permettent de repérer des chiffres gonflés.",
    audience: "Marques",
    readingMinutes: 5,
    updatedOn: "2026-10-29",
    sections: [
      {
        heading: "Pourquoi c'est important",
        blocks: [
          {
            type: "p",
            text: "Des abonnés achetés ne regardent pas les publications et n'achètent rien. Une marque qui choisit un créateur sur un nombre d'abonnés gonflé paie pour une audience qui n'existe pas, et le créateur honnête est pénalisé face à celui qui triche.",
          },
        ],
      },
      {
        heading: "Les signaux qui doivent alerter",
        blocks: [
          {
            type: "list",
            items: [
              "Un engagement très faible par rapport au nombre d'abonnés, sur la plupart des publications.",
              "Une hausse brutale du nombre d'abonnés, sans publication virale pour l'expliquer.",
              "Des commentaires génériques, répétitifs ou composés seulement d'emojis, souvent publiés par des comptes vides.",
              "Une audience dont les pays ne correspondent pas à la langue du contenu.",
              "Beaucoup d'abonnés sans photo de profil ni publication.",
              "Des vues très faibles par rapport au nombre d'abonnés, ou au contraire des pics isolés sans réaction.",
            ],
          },
        ],
      },
      {
        heading: "Comment vérifier",
        blocks: [
          {
            type: "steps",
            items: [
              "Calculez le taux d'engagement sur plusieurs publications récentes, pas sur une seule.",
              "Regardez l'évolution des abonnés dans le temps : une croissance régulière est bon signe, des sauts isolés méritent une explication.",
              "Lisez les commentaires : de vraies questions et de vraies conversations sont difficiles à imiter.",
              "Comparez les chiffres avec des comptes de taille et de thématique proches.",
            ],
          },
          {
            type: "note",
            text: "Une capture d'écran de statistiques se modifie facilement. Demandez plutôt des chiffres lus à la source, directement depuis Instagram ou TikTok.",
          },
        ],
      },
      {
        heading: "Avec AVERO",
        blocks: [
          {
            type: "p",
            text: "Sur AVERO, les statistiques des créateurs sont lues par les accès officiels d'Instagram et de TikTok, avec l'historique des abonnés et l'engagement des 30 derniers jours. Personne ne peut les saisir à la main : vous comparez des chiffres réels, et les signaux ci-dessus sont plus faciles à voir.",
          },
          {
            type: "links",
            items: [
              { href: "/marques", label: "AVERO pour les marques" },
              { href: "/outils/calcul-taux-engagement", label: "Calculer un taux d'engagement" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "compte-professionnel-instagram",
    title: "Compte professionnel Instagram : les étapes",
    description:
      "Comment passer un compte Instagram en compte professionnel (Créateur ou Entreprise), gratuitement, pour accéder à ses statistiques.",
    heading: "Passer en compte professionnel Instagram",
    intro:
      "Instagram ne donne accès aux statistiques détaillées qu'aux comptes professionnels. Le changement est gratuit, prend quelques minutes et se fait depuis l'application.",
    audience: "Créateurs",
    readingMinutes: 3,
    updatedOn: "2026-10-29",
    sections: [
      {
        heading: "Pourquoi passer en compte professionnel",
        blocks: [
          {
            type: "list",
            items: [
              "Voir ses statistiques : portée, vues, interactions et audience.",
              "Relier son compte à des outils comme AVERO, qui ne peuvent lire que les comptes professionnels.",
              "Afficher une catégorie et des boutons de contact sur son profil.",
            ],
          },
        ],
      },
      {
        heading: "Créateur ou Entreprise ?",
        blocks: [
          {
            type: "list",
            items: [
              "Créateur : pour les personnes qui publient du contenu et collaborent avec des marques.",
              "Entreprise : pour les commerces, marques et organisations.",
            ],
          },
          { type: "p", text: "Les deux donnent accès aux statistiques. Pour un créateur de contenu, le compte Créateur est le plus adapté." },
        ],
      },
      {
        heading: "Les étapes",
        blocks: [
          {
            type: "steps",
            items: [
              "Ouvrez Instagram et allez sur votre profil.",
              "Touchez le menu (les trois traits) en haut à droite.",
              "Ouvrez « Paramètres et activité ».",
              "Choisissez « Type de compte et outils ».",
              "Touchez « Passer à un compte professionnel ».",
              "Choisissez une catégorie, puis le type Créateur ou Entreprise, et validez.",
            ],
          },
          { type: "note", text: "Les intitulés peuvent varier légèrement selon la version de l'application." },
        ],
      },
      {
        heading: "Ce qui change ensuite",
        blocks: [
          {
            type: "p",
            text: "Un compte professionnel est forcément public. Vos statistiques s'affichent pour les publications suivantes. Vous pouvez revenir à un compte personnel à tout moment, depuis le même menu.",
          },
        ],
      },
      {
        heading: "Relier votre compte à AVERO",
        blocks: [
          {
            type: "p",
            text: "Une fois en compte professionnel, créez votre compte AVERO et reliez Instagram en un clic : vos statistiques sont lues directement et se mettent à jour toutes seules.",
          },
          {
            type: "links",
            items: [
              { href: "/createurs", label: "AVERO pour les créateurs" },
              { href: "/guides/taux-engagement", label: "Comprendre le taux d'engagement" },
            ],
          },
        ],
      },
    ],
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

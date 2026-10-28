# AVERO — Conception du MVP

Date : 2026-10-26
Statut : en attente de validation

## 1. Objectif

AVERO met en relation des **créateurs de contenu** et des **marques** autour de KPI réels issus d'Instagram et TikTok.

- Le créateur se connecte, relie ses comptes Instagram / TikTok et consulte tous ses KPI.
- La marque se connecte et consulte les KPI des créateurs, selon son plan (FREE / BASIC / PREMIUM).

Il s'agit d'un **MVP** : pas de paiement, pas de tâche planifiée.

## 2. Décisions prises

| Sujet | Décision |
|---|---|
| Stack | Next.js 16.4.3 (App Router), TypeScript, Tailwind CSS, Prisma, Supabase (PostgreSQL uniquement) |
| Connexion à AVERO | Better Auth, e-mail + mot de passe, pour créateurs et marques |
| Rôles | Choisi à l'inscription (CREATOR ou BRAND), non modifiable. Un compte = un rôle |
| Réseaux | Instagram et TikTok uniquement, reliés par OAuth2 depuis l'espace créateur (boutons « Connecter Instagram » / « Connecter TikTok ») |
| Récupération des KPI | Stockage en base. Mise à jour : à la connexion d'un réseau, au clic sur « Actualiser », et à l'ouverture du tableau de bord créateur si les données ont plus de 24 h. Aucune tâche planifiée |
| Paiement | Aucun. La marque choisit son plan en un clic sur la page « Plans ». Le code isole ce changement de plan pour brancher Stripe plus tard |
| Visibilité | Une marque voit tous les créateurs ayant au moins un réseau connecté |
| Langue | Interface en français uniquement |
| Ordre de construction | Interface d'abord (avec données fictives), puis backend |

## 3. Pages

| Rôle | Route | Contenu |
|---|---|---|
| Public | `/` | Présentation, boutons « Je suis créateur » / « Je suis une marque » |
| Public | `/inscription?role=createur\|marque` | Formulaire d'inscription (nom d'affichage ou nom d'entreprise, e-mail, mot de passe) |
| Public | `/connexion` | Formulaire de connexion |
| Créateur | `/createur` | Tableau de bord : KPI par réseau et cumulés, graphiques, publications, audience |
| Créateur | `/createur/reseaux` | Connexion / déconnexion Instagram et TikTok, état, date de dernière mise à jour, bouton « Actualiser » |
| Marque | `/marque` | Liste des créateurs, tri (et filtres en BASIC+) ; colonnes selon le plan |
| Marque | `/marque/createurs/[id]` | Fiche créateur détaillée (PREMIUM) |
| Marque | `/marque/comparer?ids=…` | Comparaison de 2 à 4 créateurs (PREMIUM) |
| Marque | `/marque/plans` | Choix FREE / BASIC / PREMIUM |

Protection : le fichier `proxy.ts` (remplaçant de `middleware.ts` dans Next.js 16) redirige les visiteurs non connectés vers `/connexion` ; chaque espace vérifie en plus le rôle côté serveur et redirige vers le bon espace. Une fonctionnalité réservée à un plan supérieur affiche un encart « Disponible en BASIC / PREMIUM » avec un lien vers `/marque/plans`.

## 4. KPI

Fenêtre de référence : **les publications publiées dans les 30 derniers jours**.

| KPI | Définition | FREE | BASIC | PREMIUM | Créateur |
|---|---|---|---|---|---|
| Vues (30 j) | Somme des vues des publications des 30 derniers jours, tous réseaux confondus | ✅ | ✅ | ✅ | ✅ |
| Abonnés | Dernière valeur connue, par réseau et total | | ✅ | ✅ | ✅ |
| Vues moyennes / publication | Vues (30 j) ÷ nombre de publications (30 j) | | ✅ | ✅ | ✅ |
| Taux d'engagement | (likes + commentaires + partages) ÷ vues, sur les publications des 30 j. Affiche « — » si vues = 0 | | ✅ | ✅ | ✅ |
| Publications (30 j) | Nombre de publications des 30 derniers jours | | ✅ | ✅ | ✅ |
| Évolution abonnés (30 j) | Abonnés actuels − abonnés du plus ancien relevé des 30 derniers jours. « Données insuffisantes » s'il n'y a qu'un seul relevé | | ✅ | ✅ | ✅ |
| Filtres (réseau, tranche d'abonnés) | | | ✅ | ✅ | |
| Détail par publication | Vues, likes, commentaires, partages (+ enregistrements et portée pour Instagram) | | | ✅ | ✅ |
| Graphiques d'évolution | Abonnés et vues dans le temps, à partir des relevés | | | ✅ | ✅ |
| Audience | Âge, sexe, pays — Instagram uniquement, compte ≥ 100 abonnés | | | ✅ | ✅ |
| Comparaison | 2 à 4 créateurs côte à côte | | | ✅ | |
| Export CSV | Liste des créateurs avec tous les KPI du plan | | | ✅ | |

Le tri (croissant/décroissant) est disponible dans tous les plans, sur toutes les colonnes visibles.

Chaque créateur affiche « Mis à jour le … » (date du dernier relevé).

## 5. Architecture

### 5.1 Principe : une couche de données échangeable

Toutes les pages lisent les données via des fonctions de `src/lib/data/` (ex. `getCreatorDashboard(userId)`, `listCreatorsForBrand(plan, tri, filtres)`). Elles renvoient des types définis dans `src/lib/types.ts`.

- **Phase interface** : ces fonctions renvoient des données fictives (`src/lib/data/mock/`).
- **Phase backend** : on remplace leur contenu par des requêtes Prisma. Les pages ne changent pas.

### 5.2 Filtrage par plan (point de sécurité central)

`src/lib/plans.ts` décrit, pour chaque plan, les KPI et fonctionnalités autorisés. La fonction `listCreatorsForBrand(plan, …)` ne sélectionne **que** les champs autorisés et renvoie un objet qui ne contient pas les autres. Une marque FREE ne reçoit donc jamais une donnée BASIC/PREMIUM, même en inspectant son navigateur. Les pages PREMIUM vérifient le plan côté serveur avant de charger quoi que ce soit.

### 5.3 Calcul des KPI

`src/lib/kpi.ts` : fonctions pures (sans base de données) qui calculent les KPI de la section 4 à partir des publications et des relevés. Utilisées par les données fictives comme par le backend, et testées unitairement.

### 5.4 Modèle de données (Prisma)

Tables gérées par Better Auth : `user`, `session`, `account`, `verification`. On ajoute à `user` un champ `role` (`CREATOR` | `BRAND`) via les `additionalFields` de Better Auth.

| Table | Champs principaux |
|---|---|
| `CreatorProfile` | `userId` (unique), `displayName` |
| `BrandProfile` | `userId` (unique), `companyName`, `plan` (`FREE` \| `BASIC` \| `PREMIUM`, défaut `FREE`) |
| `SocialConnection` | `creatorId`, `platform` (`INSTAGRAM` \| `TIKTOK`), `externalUserId`, `username`, `avatarUrl`, `accessToken` (chiffré), `refreshToken` (chiffré, optionnel), `tokenExpiresAt`, `status` (`ACTIVE` \| `EXPIRED`), `lastSyncedAt`. Unique (`creatorId`, `platform`) et unique (`platform`, `externalUserId`) : un compte Instagram/TikTok ne peut être relié qu'à un seul profil AVERO |
| `AccountSnapshot` | `connectionId`, `date` (jour), `followers`. Unique (`connectionId`, `date`) : au plus un relevé par jour, mis à jour si plusieurs actualisations le même jour |
| `Post` | `connectionId`, `externalId`, `publishedAt`, `caption`, `thumbnailUrl`, `permalink`, `views`, `likes`, `comments`, `shares`, `saves?`, `reach?`. Unique (`connectionId`, `externalId`) |
| `Audience` | `connectionId` (unique), `ages` (JSON), `genders` (JSON), `countries` (JSON), `updatedAt` — Instagram uniquement |

L'historique des vues pour les graphiques est calculé à partir des `Post` (vues par date de publication) ; l'historique des abonnés à partir des `AccountSnapshot`.

Déconnecter un réseau supprime la connexion et toutes ses données (publications, relevés, audience).

### 5.5 Connexion des réseaux (OAuth2)

Module maison, séparé de Better Auth :

- `GET /api/connect/[platform]` : génère un `state` aléatoire (stocké en cookie httpOnly), redirige vers la page d'autorisation du réseau.
- `GET /api/connect/[platform]/callback` : vérifie le `state`, échange le `code` contre les jetons, enregistre la connexion (jetons chiffrés en AES-256-GCM avec la clé `TOKEN_ENCRYPTION_KEY`), lance une première synchronisation, redirige vers `/createur/reseaux`.

**Instagram** (API Instagram avec connexion Instagram) : permissions `instagram_business_basic`, `instagram_business_manage_insights`. Le jeton court est échangé contre un jeton longue durée (60 jours), prolongé à chaque synchronisation s'il expire dans moins de 7 jours. Comptes professionnels uniquement.

**TikTok** (Login Kit v2) : permissions `user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list`. Jeton d'accès 24 h, renouvelé avec le jeton de rafraîchissement (365 jours) avant chaque synchronisation si nécessaire.

Les adresses de retour OAuth doivent être en **HTTPS** : en développement, on utilise un tunnel (ngrok) ou un déploiement Vercel de prévisualisation.

### 5.6 Synchronisation

`src/lib/sync/` : un adaptateur par réseau (`instagram.ts`, `tiktok.ts`) qui appelle l'API et convertit la réponse dans un format commun (`profil`, `publications`, `audience?`). `syncConnection(connectionId)` : renouvelle le jeton si besoin → récupère profil et publications des 30 derniers jours (et audience pour Instagram) → enregistre `Post`, `AccountSnapshot` du jour, `Audience` → met à jour `lastSyncedAt`.

Déclencheurs : callback OAuth, bouton « Actualiser » (ignoré si dernière synchro < 5 min), ouverture de `/createur` si `lastSyncedAt` > 24 h.

### 5.7 Variables d'environnement (`.env`, jamais dans le code ni dans git)

`DATABASE_URL`, `DIRECT_URL` (Supabase), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `TOKEN_ENCRYPTION_KEY`, `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `APP_URL`. Un fichier `.env.example` (sans valeurs) les liste.

## 6. Gestion des erreurs

| Situation | Comportement |
|---|---|
| Compte Instagram personnel | Message expliquant comment passer en compte professionnel, pas de connexion créée |
| Créateur refuse l'autorisation | Retour sur `/createur/reseaux` avec message « Connexion annulée » |
| `state` OAuth invalide | Connexion refusée, message d'erreur |
| Compte réseau déjà relié à un autre profil AVERO | Connexion refusée, message « Ce compte est déjà relié à un autre profil AVERO » |
| Jeton expiré ou révoqué | `status = EXPIRED`, bandeau « Reconnecte ton compte … » ; les anciennes données restent affichées |
| API indisponible pendant une synchro | Les données existantes sont conservées, message « Mise à jour impossible, réessaie plus tard » |
| Audience indisponible (< 100 abonnés) | Encart « Audience disponible à partir de 100 abonnés » |
| Marque accède à une page d'un plan supérieur | Encart d'incitation vers `/marque/plans`, aucune donnée chargée |

## 7. Tests

- **Vitest** pour la logique pure : calcul des KPI, filtrage par plan, chiffrement des jetons, conversion des réponses Instagram/TikTok (avec des réponses d'exemple enregistrées en JSON).
- Vérification manuelle des pages avec `pnpm run dev`, et `pnpm run build` avant chaque commit.

## 8. Hors périmètre du MVP

Paiement Stripe, tâche planifiée de mise à jour, autres réseaux, validation publique des apps Meta/TikTok (l'app reste en mode test avec des comptes ajoutés manuellement), messagerie marque ↔ créateur, administration.

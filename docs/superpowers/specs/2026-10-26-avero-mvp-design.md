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
| Ordre de construction | **Une application uniquement frontend d'abord** (landing, connexion, espaces créateur et marque avec données fictives), puis le backend |
| Direction artistique | Élégante, moderne, premium (section 3.2) |
| Animations | GSAP (ScrollTrigger, SplitText) + défilement fluide Lenis sur la landing ; animations sobres dans les espaces connectés |

## 3. Pages

| Rôle | Route | Contenu |
|---|---|---|
| Public | `/` | Landing (section 3.1) |
| Public | `/connexion` | Page de connexion dédiée, liée depuis le menu, le hero et le footer de la landing. Onglets « Créateur » / « Marque » qui adaptent le texte et le lien d'inscription. Panneau visuel animé à côté du formulaire |
| Public | `/inscription?role=createur\|marque` | Formulaire d'inscription (nom d'affichage ou nom d'entreprise, e-mail, mot de passe), même mise en page que `/connexion` |
| Public | `/mentions-legales` | Mentions légales : éditeur, directeur de publication, hébergement, données personnelles (RGPD), cookies, propriété intellectuelle. Les informations sur l'éditeur sont marquées « [À compléter] » jusqu'à ce que l'utilisateur les fournisse |
| Créateur | `/createur` | Tableau de bord : KPI par réseau et cumulés, graphiques, publications, audience |
| Créateur | `/createur/reseaux` | Connexion / déconnexion Instagram et TikTok, état, date de dernière mise à jour, bouton « Actualiser » |
| Marque | `/marque` | Liste des créateurs, tri (et filtres en BASIC+) ; colonnes selon le plan |
| Marque | `/marque/createurs/[id]` | Fiche créateur détaillée (PREMIUM) |
| Marque | `/marque/comparer?ids=…` | Comparaison de 2 à 4 créateurs (PREMIUM) |
| Marque | `/marque/plans` | Choix FREE / BASIC / PREMIUM |

### 3.1 Landing (`/`)

Blocs, dans l'ordre :

1. **Menu du haut** (fixe) : logo, liens d'ancre « Créateurs », « Marques », « Plans », « FAQ », bouton « Se connecter » (→ `/connexion`) et bouton « Créer un compte » (→ `/inscription?role=createur`). Il se compacte et prend un fond flouté au défilement. Sur mobile : menu plein écran animé.
2. **Hero** : titre principal, sous-titre, deux appels à l'action « Je suis créateur » / « Je suis une marque » (→ inscription), lien « Déjà inscrit ? Se connecter ». Visuel : vignettes de vidéos verticales (9:16) avec leur compteur de vues.
3. **Bloc Créateurs** : ce que le créateur obtient (statistiques Instagram + TikTok réunies, engagement, audience, gratuit), avec un aperçu de tableau de bord qui se construit au défilement. Bouton « Créer mon compte créateur ».
4. **Bloc Marques** : ce que la marque obtient (classement par vues réelles, chiffres lus à la source, comparaison), avec un aperçu de la liste de créateurs. Bouton « Créer mon compte marque ».
5. **Plans** : trois **cartes** Free / Basic / Premium. Chaque carte affiche le nom, une phrase de description, le prix (« Gratuit » pour Free ; « Gratuit pendant le lancement » pour Basic et Premium, car le paiement n'existe pas encore), la liste des fonctionnalités incluses (tirée de `PLAN_FEATURES`) et un bouton vers l'inscription marque. La carte Premium est mise en avant.
6. **FAQ** : accordéon de 6 questions (d'où viennent les chiffres, réseaux pris en charge, compte Instagram professionnel requis, prix, confidentialité des données, déconnexion d'un réseau).
7. **Footer** : logo, phrase de présentation, liens (Créateurs, Marques, Plans, FAQ, Se connecter, Créer un compte, Mentions légales), mention « © AVERO {année} ».

### 3.2 Direction artistique

Élégante, moderne, premium. Rythme de sections **sombres** (hero, bloc Marques, footer) et **claires** (bloc Créateurs, plans, FAQ).

| Jeton | Valeur | Usage |
|---|---|---|
| Nuit | `#0F1030` | Fond des sections sombres (indigo très profond, pas un noir neutre) |
| Papier | `#F5F6FA` | Fond des sections claires et des espaces connectés |
| Encre | `#191934` | Texte sur fond clair |
| Cobalt | `#3B46F1` | Actions, liens, accents |
| Signal | `#FFD84D` | Réservé au badge « chiffre vérifié » et au plan actif |
| Instagram / TikTok | `#D6336C` / `#0E9F9A` | Couleurs des réseaux dans les graphiques et badges |

Typographie : **Archivo**. Version élargie (`font-stretch: 125%`) pour les titres et les grands chiffres (chiffres à chasse fixe), largeur normale pour le texte. Grandes tailles, interlignage serré pour les titres, beaucoup d'espace. Détails : filets de 1 px à faible opacité, léger grain sur les sections sombres, halo cobalt diffus derrière le visuel du hero.

Animations (landing) :

- **Hero** : titre révélé ligne par ligne (SplitText, masques), vignettes 9:16 qui montent en cascade puis réagissent légèrement à la souris (parallaxe), compteurs de vues qui défilent.
- **Défilement fluide** (Lenis) synchronisé avec ScrollTrigger.
- **Bloc Créateurs** : section épinglée pendant le défilement ; les KPI apparaissent un à un et la courbe d'abonnés se trace.
- **Bloc Marques** : les lignes de la liste de créateurs se trient sous les yeux de l'utilisateur au défilement.
- **Cartes de plans** : apparition en cascade ; halo lumineux qui suit la souris sur la carte survolée.
- **FAQ** : ouverture/fermeture à hauteur animée.
- **Menu** : se compacte au défilement ; menu mobile en plein écran avec liens en cascade.

Règles : animer uniquement `transform` et `opacity` ; tout le contenu reste lisible sans JavaScript ; avec `prefers-reduced-motion: reduce`, aucune animation (le contenu s'affiche directement). Dans les espaces connectés : animations sobres seulement (apparition des KPI, compteurs).

### 3.3 Protection des pages

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

`DATABASE_URL`, `DIRECT_URL` (Supabase), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `OAUTH2_MODE`, `TOKEN_ENCRYPTION_KEY`, `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `APP_URL`. Un fichier `.env.example` (sans valeurs) les liste.

### 5.8 Mode OAuth2 simulé (ajouté le 2026-10-28)

Obtenir les accès développeur Meta et TikTok est long : un **mode simulé** reproduit le parcours OAuth2 sans compte développeur, pour les démonstrations et les tests.

- **`OAUTH2_MODE`** : `simulated` (valeur par défaut si la variable est absente) ou `real`. Le mode ne choisit que le connecteur utilisé pour une **nouvelle** connexion. En mode `real`, si les clés du réseau manquent, « Connecter » ramène sur « Mes réseaux » avec un message d'erreur clair.
- **Même parcours, même code** : le connecteur simulé implémente la même interface que les connecteurs Instagram et TikTok (`PlatformProvider`). Son adresse d'autorisation est une page d'AVERO, `/oauth/simulation/[platform]`. Le retour passe par la même route de callback (vérification du `state`, chiffrement des jetons, synchronisation, messages d'erreur).
- **Écran d'autorisation simulé** : la structure d'un écran OAuth (« AVERO souhaite accéder à… », la liste des autorisations du réseau, les boutons Refuser et Autoriser), aux couleurs du réseau, marqué « Simulation ». Il ne reprend **ni les logos officiels ni de champ de mot de passe** (une copie de la page de connexion Instagram ou TikTok passerait pour de l'hameçonnage). Champs :
  - **Nom d'utilisateur** (libre) : les chiffres sont générés à partir de ce nom, toujours identiques pour un même nom.
  - **Taille du compte** : petit (quelques milliers d'abonnés), moyen (quelques dizaines de milliers), gros (plusieurs centaines de milliers).
  - **Scénario de test** : « Tout fonctionne » ; « Compte personnel » (Instagram uniquement → message compte professionnel) ; « Compte déjà relié à un autre profil » ; « Accès révoqué à la prochaine actualisation » ; « Réseau indisponible à la prochaine actualisation ».
  - « Refuser » renvoie le même retour qu'un refus réel (`error=access_denied`).
- **Comptes simulés marqués** : `SocialConnection.simulated` (booléen). Une connexion simulée est toujours actualisée par le connecteur simulé, quel que soit `OAUTH2_MODE` : l'app ne contacte jamais le vrai Instagram ou TikTok avec un faux jeton. Badge « Simulé » dans « Mes réseaux ». Ces comptes apparaissent chez les marques comme les autres.
- **Historique** : le connecteur simulé fournit aussi un historique d'abonnés sur 60 jours (champ facultatif `followerHistory`), pour que les graphiques et l'évolution sur 30 jours soient remplis dès la connexion.
- **Délai entre deux actualisations manuelles** : 5 minutes en connexion réelle (quotas des API) ; 10 secondes pour une connexion simulée, pour pouvoir tester les scénarios « à la prochaine actualisation » sans attendre.

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
| Mode `real` sans clés du réseau dans `.env` | Retour sur `/createur/reseaux`, message « La connexion à ce réseau n'est pas encore configurée » |
| Marque accède à une page d'un plan supérieur | Encart d'incitation vers `/marque/plans`, aucune donnée chargée |

## 7. Tests

- **Vitest** pour la logique pure : calcul des KPI, filtrage par plan, chiffrement des jetons, conversion des réponses Instagram/TikTok (avec des réponses d'exemple enregistrées en JSON).
- Vérification manuelle des pages avec `pnpm run dev`, et `pnpm run build` avant chaque commit.

## 8. Hors périmètre du MVP

Paiement Stripe, tâche planifiée de mise à jour, autres réseaux, validation publique des apps Meta/TikTok (l'app reste en mode test avec des comptes ajoutés manuellement), messagerie marque ↔ créateur, administration.

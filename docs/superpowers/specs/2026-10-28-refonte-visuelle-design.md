# AVERO — Refonte visuelle (landing et toutes les pages)

Date : 2026-10-28. Complète la section 3.2 de `2026-10-26-avero-mvp-design.md`.

## 1. Objectif

Rendre l'accueil et chaque page **très visuels**, sans changer les fonctionnalités, les textes métier ni les règles d'accès par plan.

Demandé par l'utilisateur :

- **Données mises en scène** : graphiques colorés, jauges, cartes de chiffres avec mini-courbes, classements illustrés.
- **Images et mockups** : téléphone, vignettes de posts, avatars de créateurs — **dessinés en code** (CSS/SVG), aucun fichier image, aucun droit d'auteur.
- **Couleurs et effets** : dégradés, verre flouté, halos, animations plus présentes.
- On **garde l'identité** : nom AVERO, palette de base (Nuit, Papier, Encre, Cobalt, Signal, Instagram, TikTok), police Archivo.

Hors périmètre : nouvelles fonctionnalités, nouveaux textes produit, nouvelles dépendances, mode sombre des espaces connectés.

## 2. Jetons ajoutés à la charte

| Jeton | Valeur | Usage |
|---|---|---|
| Violet | `#7C5CFF` | Second ton des dégradés (cobalt → violet) |
| Aurore | cobalt, violet, rose Instagram, turquoise TikTok | Taches de lumière floues, en mouvement lent, sur les fonds sombres |

Classes utilitaires (`globals.css`, couche `components`) :

- `.aurora` : conteneur de taches lumineuses animées (CSS `transform` uniquement, coupé en mouvement réduit).
- `.glass` (sur fond sombre) et `.glass-light` (sur fond clair) : surface translucide floutée, filet 1 px.
- `.gradient-border` : bordure en dégradé cobalt → violet → rose (carte Premium, éléments mis en avant).
- `.text-gradient` : texte en dégradé (grands chiffres, mots-clés des titres).
- `.dot-grid` : trame de points discrète en fond.
- `.skeleton` : bloc gris avec reflet animé pour les chargements.

Signal (`#FFD84D`) reste réservé au badge « chiffre vérifié / lu sur… » et au plan actif.

## 3. Kit visuel (`src/components/visual/`)

Chaque brique a un seul rôle et ne dépend que de ses props.

| Brique | Rôle |
|---|---|
| `Aurora` | Décor : 3–4 taches de couleur floues qui dérivent lentement. `aria-hidden`. |
| `Avatar` | Cercle en dégradé unique par créateur (calculé depuis son nom), initiales au centre. Tailles `sm` / `md` / `lg` / `xl`. |
| `PostThumb` | Vignette 9:16 imitant une vidéo : dégradé + formes SVG choisies selon une graine, icône lecture, compteur de vues, pseudo. |
| `PhoneMockup` | Cadre de téléphone (bords arrondis, encoche) qui contient n'importe quel contenu. |
| `Sparkline` | Mini-courbe SVG (trait + aire en dégradé) à partir d'une liste de nombres. Rendu serveur possible. |
| `RadialGauge` | Anneau de progression SVG (ex. taux d'engagement), valeur au centre. |
| `Icon` | Jeu d'icônes SVG en ligne (vues, abonnés, cœur, publications, tendance, calendrier, cadenas, coche, éclair, flèche, Instagram, TikTok…). |
| `PageHero` | Bannière sombre en haut des pages connectées : aurore, titre, sous-titre, zone libre à droite. |
| `Skeleton` | Blocs de chargement. |

Fonctions pures associées (`src/lib/visual.ts`, testées) :

- `avatarColors(seed)` → deux couleurs de dégradé, toujours les mêmes pour un même nom.
- `initials(name)` → « Léa Martin » → « LM ».
- `sparklinePath(values, width, height)` → chemins SVG du trait et de l'aire ; liste vide ou constante gérée.
- `countryFlag(code)` → drapeau emoji depuis un code pays ISO (« FR » → 🇫🇷), chaîne vide si code invalide.
- `normalizeForRadar(creators)` (dans `src/lib/compare.ts`) → chaque KPI ramené entre 0 et 100 par rapport au meilleur créateur.

## 4. Pages

### 4.1 Landing (`/`)

- **Menu** : inchangé dans son comportement ; logo avec pastille en dégradé, bouton principal avec halo.
- **Hero** : fond aurore + trame de points. À droite, un `PhoneMockup` qui affiche un mini tableau de bord (avatar, total de vues, sparkline, deux pastilles réseau). Autour, trois `PostThumb` et deux bulles de chiffres en verre (« +12 400 abonnés », « 6,4 % d'engagement ») qui flottent et suivent la souris (parallaxe existante). Un mot du titre en `.text-gradient`.
- **Bandeau de chiffres** (nouveau, entre hero et Créateurs) : quatre faits produit vrais, en très grand avec compteurs : « 2 réseaux réunis », « 6 indicateurs clés », « 0 capture d'écran », « 100 % lu à la source ».
- **Bloc Créateurs** : l'aperçu devient un vrai mini tableau de bord coloré : 4 tuiles KPI avec icône et sparkline, courbe d'abonnés en dégradé, petite jauge d'engagement. Animation épinglée conservée.
- **Bloc Marques** : la liste triée au défilement garde son animation ; chaque ligne reçoit un `Avatar` et une barre de vues proportionnelle en dégradé. Podium visuel (médailles 1-2-3).
- **Plans** : cartes en verre clair ; Premium sur fond sombre avec `.gradient-border` et halo. Icônes coche.
- **FAQ** : chaque question a une icône dans une pastille colorée ; cartes arrondies.
- **Footer** : grand mot « AVERO » en dégradé contour en bas, aurore discrète.

### 4.2 Connexion / inscription

Panneau gauche (ordinateur) : aurore, `PhoneMockup` avec mini tableau de bord, vignettes et bulles de chiffres flottantes (les trois compteurs existants deviennent des bulles en verre). Côté formulaire : champs plus généreux, onglets de rôle en pilule avec icône, fond clair avec trame de points discrète. Sur mobile : bandeau dégradé en haut.

### 4.3 Espaces connectés (cadre commun)

- **En-tête** : barre sombre (Nuit) avec logo, onglets en pilules (actif = pilule claire), avatar de l'utilisateur dans le menu, badge de plan Signal.
- **`PageHero`** en haut de chaque page, puis contenu sur fond Papier.
- **Chargement** : `Skeleton` à la place de « Chargement… ».

### 4.4 Espace créateur

- **Tableau de bord** : `PageHero` avec `Avatar` xl, « Bonjour {prénom} », total de vues 30 j en très grand (`CountUp`, `.text-gradient`), pastilles réseaux, date de mise à jour, bouton « Gérer mes réseaux ».
- **KPI** : 6 tuiles colorées (une teinte par KPI) avec icône ; sparkline sur les vues (8 semaines) et les abonnés ; `RadialGauge` pour l'engagement ; flèche verte/rouge pour l'évolution. Onglets réseau conservés.
- **Graphiques** : barres de vues en dégradé cobalt → violet ; abonnés en aires dégradées par réseau (pointillés TikTok conservés).
- **Publications** : grille de cartes (`PostThumb` + vues, likes, commentaires, partages, date ; enregistrements et portée si Instagram). 12 au maximum, comme avant.
- **Audience** : genre en anneau (donut), âge en barres dégradées, pays avec drapeau et barres.
- **Mes réseaux** : grandes cartes avec bandeau aux couleurs du réseau (Instagram : dégradé orange → rose → violet ; TikTok : nuit avec reflets turquoise et rose), icône du réseau, nombre d'abonnés en grand, statut en pastille. Messages de retour (succès / erreur) en bannières avec icône.
- **État vide** : illustration (téléphone + vignettes) au lieu d'un simple encadré.

### 4.5 Espace marque

- **Créateurs** : `PageHero` avec le nombre de créateurs. **Podium** des 3 premiers de la liste triée (avatar, médaille, chiffre de la colonne de tri). Barre de filtres en verre clair. Tableau : `Avatar` devant le nom, barre proportionnelle sous la valeur de la colonne triée, colonnes verrouillées avec cadenas (inchangé). Barre de comparaison sombre avec avatars des créateurs sélectionnés.
- **Fiche créateur** : bannière de profil (couverture en dégradé tiré de l'avatar, avatar xl qui déborde, pseudos par réseau), puis les mêmes statistiques que l'espace créateur.
- **Comparer** : une carte par créateur (avatar, nom, réseaux), graphique en toile d'araignée (Recharts `RadarChart`, une couleur par créateur, valeurs normalisées), puis le tableau existant avec barres proportionnelles et badge « Meilleur ».
- **Plans** : mêmes cartes que la landing ; plan actuel avec badge Signal et anneau.
- **Encart « Disponible en … »** : carte avec cadenas, dégradé discret, aperçu flouté de ce qui est verrouillé.

### 4.6 Autres pages

- **Mentions légales** : en-tête aurore, sections en cartes claires avec icône.
- **404** : aurore, « 404 » géant en dégradé, vignettes flottantes.
- **Écran d'autorisation simulé** : bandeau aux couleurs du réseau, fond aurore clair, logos AVERO ↔ réseau reliés.

## 5. Règles

- Animer uniquement `transform` et `opacity`. Tout reste lisible sans JavaScript. En `prefers-reduced-motion: reduce` : aucune animation (aurore figée, compteurs à leur valeur).
- Contrastes AA pour le texte ; les éléments décoratifs ont `aria-hidden`. Les graphiques gardent un `aria-label` qui résume les données.
- Les couleurs des séries suivent la skill dataviz (Instagram / TikTok, pointillés TikTok comme second repère).
- Les composants serveur restent serveur ; seuls les éléments animés ou interactifs sont `"use client"`.
- Aucune nouvelle dépendance (GSAP, Lenis, Recharts déjà présents).

## 6. Tests et vérification

- Tests unitaires Vitest pour `src/lib/visual.ts` et `normalizeForRadar`.
- `pnpm test`, `pnpm run lint` et `pnpm run build` verts avant chaque commit.
- Captures Chrome des pages publiques (ordinateur et mobile). Les pages connectées sont vérifiées par une page d'aperçu temporaire (non commitée) qui affiche les composants avec les données de démonstration, puis par l'utilisateur connecté.

# Refonte visuelle — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** rendre la landing et toutes les pages très visuelles (données mises en scène, mockups dessinés en code, couleurs et effets) sans changer les fonctionnalités.

**Architecture:** un kit visuel commun (`src/components/visual/` + fonctions pures `src/lib/visual.ts`) et des jetons CSS dans `globals.css`, puis chaque page est rhabillée avec ces briques. Les composants serveur restent serveur ; seuls les éléments animés sont client.

**Tech Stack:** Next.js 16.4.3, React 19, Tailwind 4, GSAP, Recharts, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-28-refonte-visuelle-design.md`

## Global Constraints

- Aucune nouvelle dépendance ; aucun fichier image (tout en CSS/SVG).
- Palette conservée ; ajout de Violet `#7C5CFF`. Signal `#FFD84D` réservé au badge « lu sur… / chiffre vérifié » et au plan actif.
- Animer uniquement `transform` et `opacity` ; en `prefers-reduced-motion: reduce`, aucune animation ; contenu lisible sans JavaScript.
- Décor en `aria-hidden` ; graphiques avec `aria-label` résumant les données ; contrastes AA.
- Textes produit inchangés (sauf bandeau de chiffres de la landing, copie fixée par la spec 4.1).
- Avant chaque commit : `pnpm test`, `pnpm run lint`, `pnpm run build` verts. Messages de commit en français.

## Review Focus

- Nom vide ou d'un seul mot (`""`, `"Nike"`) → `initials` renvoie `"?"` / `"N"`, `Avatar` ne plante pas.
- Série de sparkline vide, d'un seul point ou constante → chemin valide (ligne plate), pas de `NaN`.
- Code pays inconnu (`"ZZ"`, `"fr"`, `"FRA"`) → `countryFlag` renvoie `""` sauf code à 2 lettres A–Z (minuscules acceptées).
- Radar avec KPI `null` ou tous à 0 → valeur 0, pas de division par zéro.
- Liste marque de 1 ou 2 créateurs → le podium n'affiche que les places existantes.

---

### Task 1: Jetons CSS et fonctions visuelles pures

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/visual.ts`, `src/lib/visual.test.ts`
- Modify: `src/lib/compare.ts`, `src/lib/compare.test.ts`

**Interfaces — Produces:**
- `avatarColors(seed: string): [string, string]` — deux couleurs hex déterministes tirées d'une liste de paires harmonisées avec la charte.
- `initials(name: string): string` — 1 à 2 lettres majuscules, `"?"` si vide.
- `sparklinePath(values: number[], width: number, height: number): { line: string; area: string }`.
- `countryFlag(code: string): string`.
- `normalizeForRadar(kpis: (number | null)[][]): number[][]` — entrée `[créateur][kpi]`, sortie 0–100 par KPI relatif au max (null/max≤0 → 0). Dans `compare.ts`.
- Classes CSS : `.aurora` (+ `.aurora-blob`), `.glass`, `.glass-light`, `.gradient-border`, `.text-gradient`, `.dot-grid`, `.skeleton`; jeton `--color-violet`.

- [ ] Tests (`visual.test.ts`) : `avatarColors("Léa Martin")` stable entre deux appels et différent de `avatarColors("Hugo Bernard")` ; `initials("Léa Martin") === "LM"`, `initials("nike") === "N"`, `initials("  ") === "?"`, `initials("Jean Pierre Dupont") === "JD"` ; `sparklinePath([], 100, 20).line` ne contient pas `NaN` ; `sparklinePath([5,5,5],100,20)` ligne horizontale à mi-hauteur ; `sparklinePath([0,10],100,20).line === "M0 20 L100 0"` (avec marge verticale nulle) ; `countryFlag("FR") === "🇫🇷"`, `countryFlag("fr") === "🇫🇷"`, `countryFlag("FRA") === ""`, `countryFlag("") === ""`.
- [ ] Tests (`compare.test.ts`) : `normalizeForRadar([[10, null],[20, 0]])` → `[[50, 0],[100, 0]]`.
- [ ] `pnpm test` → échec, puis implémentation, puis `pnpm test` → vert.
- [ ] Ajouter jetons/classes dans `globals.css` (keyframes `aurora-drift`, `shimmer` ; désactivées par la règle reduced-motion existante).
- [ ] Commit `feat: jetons visuels et fonctions d'avatar, sparkline, drapeaux et radar`.

### Task 2: Kit visuel (composants)

**Files:** Create `src/components/visual/{Aurora,Avatar,PostThumb,PhoneMockup,Sparkline,RadialGauge,Icon,PageHero,Skeleton}.tsx`.

**Interfaces — Produces:**
- `<Aurora className? tone?: "dark" | "light" />`
- `<Avatar name: string size?: "sm"|"md"|"lg"|"xl" ring?: boolean />`
- `<PostThumb seed: string views: number handle?: string platform?: Platform className? />` — formes SVG choisies selon `seed`.
- `<PhoneMockup className? children />`
- `<Sparkline values: number[] color?: string className? />` (viewBox fixe, `preserveAspectRatio="none"`, aire dégradée).
- `<RadialGauge value: number /* 0..1 */ label: string size?: number color? />`
- `<Icon name: IconName className? />` avec `IconName = "eye"|"users"|"heart"|"grid"|"trend"|"calendar"|"lock"|"check"|"bolt"|"arrow-right"|"arrow-up"|"arrow-down"|"instagram"|"tiktok"|"chat"|"share"|"bookmark"|"globe"|"shield"|"sparkle"|"refresh"|"link"|"question"|"medal"|"user"`.
- `<PageHero title: ReactNode subtitle?: ReactNode aside?: ReactNode leading?: ReactNode children? />` (serveur).
- `<Skeleton className? />` et `SpaceLoading` réécrit avec skeletons.

- [ ] Implémenter ; tous serveur sauf aucun (pas d'état) — l'animation de l'aurore est en CSS.
- [ ] `pnpm run lint && pnpm run build` → vert. Commit `feat: kit visuel (aurore, avatars, vignettes, téléphone, sparklines, jauges, icônes)`.

### Task 3: Landing

**Files:** Modify `src/components/landing/{SiteNav,Hero,CreatorsSection,BrandsSection,PlanCards,Faq,SiteFooter}.tsx`, `src/lib/landing-content.ts`, `src/app/page.tsx`. Create `src/components/landing/StatsBand.tsx`.

- [ ] `landing-content.ts` : ajouter `STATS_BAND` (4 entrées `{ value: number; suffix?: string; label: string }` : 2 « réseaux réunis », 6 « indicateurs clés », 0 « capture d'écran », 100 + « % » « lu à la source »), `FAQ_ICONS` (une `IconName` par question), séries de démo `CREATOR_PREVIEW_SPARKS`.
- [ ] Hero : aurore + dot-grid, mot « directement » en `.text-gradient`, `PhoneMockup` central (mini dashboard), 3 `PostThumb` + 2 bulles `.glass` en parallaxe (animation existante conservée sur `[data-frame]`).
- [ ] StatsBand avec `CountUp`, inséré dans `page.tsx` entre Hero et CreatorsSection.
- [ ] CreatorsSection : tuiles KPI colorées + icône + `Sparkline`, courbe dégradée, `RadialGauge`. Animation épinglée conservée (`data-kpi`, `data-curve`).
- [ ] BrandsSection : `Avatar` + barre de vues proportionnelle par ligne, médailles 1-2-3 ; animation de tri conservée.
- [ ] PlanCards : `.glass-light` ; Premium sombre + `.gradient-border` + halo ; icônes `check`.
- [ ] Faq : pastille icône par question. Footer : aurore + mot « AVERO » géant en dégradé.
- [ ] Vérifier dans Chrome (1440 et 390 px), lint, build. Commit `feat: landing très visuelle (téléphone, vignettes, bandeau de chiffres, aurore)`.

### Task 4: Connexion, inscription, autorisation simulée, 404, mentions légales

**Files:** Modify `src/components/auth/{AuthShowcase,AuthField,RoleTabs}.tsx`, `src/app/(auth)/layout.tsx`, `src/components/oauth/SimulatedConsent.tsx`, `src/app/oauth/simulation/[platform]/page.tsx`, `src/app/not-found.tsx`, `src/app/mentions-legales/page.tsx`.

- [ ] AuthShowcase : aurore, `PhoneMockup` + vignettes, trois compteurs existants en bulles `.glass`. Bandeau dégradé mobile dans le layout.
- [ ] RoleTabs : icônes `user` / `sparkle`… ; AuthField : champs plus hauts, focus avec anneau cobalt.
- [ ] SimulatedConsent : bandeau aux couleurs du réseau (dégradé Instagram / nuit TikTok), logos AVERO ↔ réseau reliés ; page sur fond aurore clair.
- [ ] 404 : aurore, « 404 » `.text-gradient`, vignettes. Mentions légales : en-tête aurore, sections en cartes avec icône.
- [ ] Chrome + lint + build. Commit `feat: pages de connexion, 404, mentions légales et autorisation simulée rhabillées`.

### Task 5: Cadre des espaces connectés + espace créateur

**Files:** Modify `src/components/{AppHeader,NavLink,UserMenu,SpaceLayout}.tsx`, `src/components/ui/{Card,KpiCard,EmptyState,UpgradeNotice,PlatformBadge}.tsx`, `src/components/creator/{CreatorStats,KpiGrid,KpiTabs,PostsTable,AudiencePanel,NetworkCard}.tsx`, `src/components/charts/{ViewsChart,FollowersChart}.tsx`, `src/app/createur/page.tsx`, `src/app/createur/reseaux/page.tsx`. Create `src/components/charts/GenderDonut.tsx`.

**Interfaces:**
- `KpiCard` gagne `icon?: IconName`, `accent?: "cobalt"|"violet"|"instagram"|"tiktok"|"signal"|"ink"`, `spark?: number[]`, `trend?: "up"|"down"|null`, `gauge?: number` (0..1).
- `KpiGrid({ kpis, sparks? }: { kpis: CreatorKpis; sparks?: { views?: number[]; followers?: number[] } })`; `KpiTabs` reçoit `sparks?: Partial<Record<"ALL" | Platform, { views?: number[]; followers?: number[] }>>` calculé dans `CreatorStats` (vues : `viewsByWeek(...).map(w => w.views)` ; abonnés : somme des réseaux par point de `followersSeries`).
- `PostsTable` garde son nom et ses props mais rend une grille de cartes.

- [ ] En-tête sombre avec pilules, avatar dans `UserMenu` ; `PageHero` sur tableau de bord (avatar xl, total vues `CountUp` + `.text-gradient`) et sur « Mes réseaux ».
- [ ] KPI tuiles, graphiques dégradés, grille de publications, audience (donut genre, barres âge, drapeaux pays), cartes réseaux colorées, bannières de message avec icône, état vide illustré.
- [ ] Charger la skill `dataviz` avant d'écrire les graphiques.
- [ ] Vérifier via page d'aperçu temporaire non commitée (`src/app/apercu/page.tsx` avec données de `src/lib/data/mock`), lint, build. Commit `feat: espace créateur très visuel (bannière, tuiles KPI, graphiques, publications en vignettes)`.

### Task 6: Espace marque

**Files:** Modify `src/components/brand/{CreatorsTable,FiltersBar,CompareTable}.tsx`, `src/app/marque/{page,plans/page,comparer/page,createurs/[id]/page}.tsx`. Create `src/components/brand/{Podium,CompareRadar}.tsx`, `src/components/ui/PlanCard.tsx` (présentation partagée avec la landing).

**Interfaces:**
- `<Podium rows: CreatorRow[] sortKey: SortKey render: (r) => string />` — 0 à 3 places selon `rows.length` ; rendu côté serveur, le rendu de valeur est passé par `CreatorsTable` (client) → Podium vit dans `CreatorsTable` pour réutiliser `COLUMNS`.
- `<CompareRadar creators: CreatorDashboard[] />` (client, Recharts `RadarChart`, données via `normalizeForRadar`).
- `<PlanCardView plan featured current action: ReactNode glow?: boolean />`.

- [ ] Liste : `PageHero` (nombre de créateurs), podium, filtres `.glass-light`, avatars et barres dans le tableau, barre de comparaison avec avatars sélectionnés.
- [ ] Fiche : bannière de couverture dégradée (couleurs `avatarColors`), avatar xl en débord.
- [ ] Comparer : cartes créateur, radar, tableau avec barres proportionnelles.
- [ ] Plans : `PlanCardView` ici et dans `PlanCards` de la landing. `UpgradeNotice` : carte cadenas avec aperçu flouté.
- [ ] Aperçu temporaire, lint, build. Commit `feat: espace marque très visuel (podium, avatars, radar de comparaison)`.

### Task 7: Vérification finale

- [ ] `pnpm test && pnpm run lint && pnpm run build` → vert.
- [ ] Captures Chrome de toutes les pages publiques en 1440 et 390 px ; supprimer la page d'aperçu.
- [ ] Revue de toute la branche par un relecteur neuf (superpowers:requesting-code-review), corrections, commit `fix: …` si besoin.

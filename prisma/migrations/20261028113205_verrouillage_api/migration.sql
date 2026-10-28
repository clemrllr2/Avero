-- Supabase publie automatiquement les tables du schéma « public » via son API de données.
-- AVERO n'utilise pas cette API (tout passe par Prisma, propriétaire des tables, qui n'est pas concerné) :
-- on active la sécurité par ligne (RLS) sans aucune règle, ce qui bloque tout accès par cette API.
ALTER TABLE "CreatorProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BrandProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AccountSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Audience" ENABLE ROW LEVEL SECURITY;
-- Table de suivi de Prisma : absente de la base de test temporaire de Prisma, d'où la condition.
DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

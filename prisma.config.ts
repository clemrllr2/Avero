import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuration des commandes Prisma (migrations).
// Elles passent par la connexion directe à Supabase (DIRECT_URL), pas par le pooler utilisé par l'application.
// La génération du client n'a pas besoin de la base : DIRECT_URL peut manquer pendant le build.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});

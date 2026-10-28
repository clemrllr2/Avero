import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Un seul client Prisma pour toute l'application. En développement, le rechargement à chaud
// réexécute ce fichier : on garde le client dans globalThis pour ne pas ouvrir une connexion à chaque fois.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // DATABASE_URL = pooler « Transaction » de Supabase (port 6543), lu dans .env.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db";
import { parseRole } from "@/lib/roles";
import { MIN_PASSWORD_LENGTH } from "@/lib/validation";

// Authentification par e-mail et mot de passe. La clé secrète (BETTER_AUTH_SECRET) et l'adresse
// de l'application (BETTER_AUTH_URL) sont lues dans .env par Better Auth.
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: MIN_PASSWORD_LENGTH },
  user: {
    additionalFields: {
      // Choisi à l'inscription (créateur ou marque), puis jamais modifiable.
      role: { type: "string", input: true, required: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Un rôle trafiqué (« ADMIN », absent…) bloque l'inscription.
        before: async (user) => {
          if (!parseRole(user.role)) throw new APIError("BAD_REQUEST", { message: "Type de compte invalide." });
        },
        // Chaque compte reçoit son profil : créateur, ou marque au plan FREE.
        after: async (user) => {
          const role = parseRole(user.role);
          if (role === "CREATOR") {
            await prisma.creatorProfile.upsert({
              where: { userId: user.id },
              create: { userId: user.id, displayName: user.name },
              update: {},
            });
          } else if (role === "BRAND") {
            await prisma.brandProfile.upsert({
              where: { userId: user.id },
              create: { userId: user.id, companyName: user.name },
              update: {},
            });
          }
        },
      },
      update: {
        // Empêche un créateur de se déclarer marque (ou l'inverse) via la route de modification du compte.
        before: async (data) => {
          if ("role" in data) throw new APIError("BAD_REQUEST", { message: "Le type de compte ne peut pas être modifié." });
        },
      },
    },
  },
  plugins: [nextCookies()], // doit rester le dernier : pose le cookie de session depuis les actions serveur
});

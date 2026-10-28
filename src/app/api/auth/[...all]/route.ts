import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Routes internes de Better Auth (/api/auth/...).
export const { GET, POST } = toNextJsHandler(auth);

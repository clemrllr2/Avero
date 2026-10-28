import type { Role } from "@/lib/types";

export function homePathFor(role: Role): "/createur" | "/marque" {
  return role === "CREATOR" ? "/createur" : "/marque";
}

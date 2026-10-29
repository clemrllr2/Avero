import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Pages publiques à proposer à Google (la connexion et les espaces connectés n'y figurent pas). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/inscription`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
  ];
}

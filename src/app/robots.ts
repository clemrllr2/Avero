import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Pages publiques indexables ; espaces connectés, routes techniques et écran simulé exclus. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/createur", "/marque", "/api/", "/oauth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

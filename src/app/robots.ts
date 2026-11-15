import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/olimp/", "/api/", "/payment-status", "/warsztaty-status", "/warsztaty/anuluj/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

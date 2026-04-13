import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/api/", "/logo"] },
    sitemap: "https://liuais.se/sitemap.xml",
  };
}

import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";
import { allEventSlugsQuery } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: { slug: string }[] = await client
    .fetch(allEventSlugsQuery)
    .catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: "https://liuais.se",         lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: "https://liuais.se/events",   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: "https://liuais.se/projects", lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: "https://liuais.se/about",    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://liuais.se/career",  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: "https://liuais.se/courses", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://liuais.se/privacy", lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `https://liuais.se/events/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes];
}

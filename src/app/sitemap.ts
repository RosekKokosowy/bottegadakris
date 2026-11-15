import { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPublishedPosts } from "@/lib/blog.inc";
import { SITE_URL } from "@/lib/seo/config";
import { log } from "@/lib/trace.inc";
import { workshopPages } from "@/modules/Workshop/workshops.data";

/** Same pages as the old static sitemap.xml, plus every published blog post. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/o-mnie`, changeFrequency: "weekly", priority: 0.9 },
    ...Object.keys(workshopPages).map((slug) => ({ url: `${SITE_URL}/warsztaty/${slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/pracownia`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/vouchery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/galeria`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const posts = await getPublishedPosts();
    pages.push(...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.data_utworzenia), changeFrequency: "monthly" as const, priority: 0.6 })));
  } catch (error) {
    log("sitemap", error, "Blog posts are missing from the sitemap.");
  }

  return pages;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPost } from "@/lib/blog.inc";
import BlogBySlug from "@/modules/BlogBySlug/BlogBySlug";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Blog o ceramice | Bottega da Kris" };
  return {
    title: `${post.tytul} | Bottega da Kris`,
    description: post.tytul,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.tytul, type: "article", url: `/blog/${post.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return <BlogBySlug post={post} />;
}

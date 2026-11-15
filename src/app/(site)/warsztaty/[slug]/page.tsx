import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Workshop from "@/modules/Workshop/Workshop";
import { workshopPages } from "@/modules/Workshop/workshops.data";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(workshopPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = workshopPages[slug];
  return page ? { ...page.seo, alternates: { canonical: `/warsztaty/${slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = workshopPages[slug];
  if (!page) notFound();

  // Render per request so the price comes from the (cached) database, never from build time.
  await connection();
  return <Workshop data={page} />;
}

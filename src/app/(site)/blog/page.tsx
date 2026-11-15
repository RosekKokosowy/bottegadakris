import { Metadata } from "next";
import { connection } from "next/server";
import { getPublishedPosts } from "@/lib/blog.inc";
import Blog from "@/modules/Blog/Blog";

export const metadata: Metadata = {
  title: "Blog o ceramice | Bottega da Kris",
  description: "Porady, inspiracje i historie ze świata ceramiki. Zanurz się w lekturze i poznaj nasze artystyczne spojrzenie.",
  alternates: { canonical: "/blog" },
};

export default async function Page() {
  await connection();
  return <Blog posts={await getPublishedPosts()} />;
}

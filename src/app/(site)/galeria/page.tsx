import { Metadata } from "next";
import { connection } from "next/server";
import { Animation } from "@/components/Animation/Animation";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { getGalleryItems } from "@/lib/gallery.inc";
import { MasonryGallery } from "@/modules/Gallery/MasonryGallery";

export const metadata: Metadata = {
  title: "Galeria | Bottega da Kris",
  description: "Odkryj świat ręcznie tworzonej ceramiki w naszej galerii. Zainspiruj się unikalnymi formami, kolorami i fakturami – każda praca to opowieść o pasji, tradycji i nowoczesnym rzemiośle.",
  alternates: { canonical: "/galeria" },
};

export default async function Page() {
  await connection();
  const items = await getGalleryItems();

  return (
    <>
      <PageHeader title="GALERIA" />
      <div className="py-12 px-6 md:px-12">
        <Animation>
          <MasonryGallery items={items} />
        </Animation>
      </div>
    </>
  );
}

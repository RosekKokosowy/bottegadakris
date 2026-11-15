import { notFound } from "next/navigation";
import GalleryForm from "@/modules/Management/Gallery/GalleryForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!id) notFound();
  return <GalleryForm id={id} />;
}

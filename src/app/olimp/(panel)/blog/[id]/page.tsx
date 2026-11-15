import { notFound } from "next/navigation";
import BlogForm from "@/modules/Management/Blog/BlogForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!id) notFound();
  return <BlogForm id={id} />;
}

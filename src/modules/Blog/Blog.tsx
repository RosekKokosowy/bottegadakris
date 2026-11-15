import { Card } from "antd";
import Link from "next/link";
import { Animation } from "@/components/Animation/Animation";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { UploadedImage } from "@/components/UploadedImage/UploadedImage";
import { IBlogPost } from "@/types/IBlogPost";

function BlogListItem({ post }: { post: IBlogPost }) {
  return (
    <Animation className="w-full">
      <div className="w-full h-full flex">
        <Card
          className="bg-bottega-beige border-bottega-brown border rounded-lg shadow-xs flex flex-col h-full w-full"
          cover={
            post.attachments[0] ? (
              <div className="relative h-[200px]">
                <UploadedImage link={post.attachments[0]} alt={post.tytul} className="object-cover rounded-t-lg" sizes="(min-width: 1152px) 380px, 100vw" />
              </div>
            ) : null
          }
          styles={{ body: { display: "flex", flexDirection: "column", flex: 1, height: "100%" } }}
        >
          <div className="flex flex-col flex-1 justify-between h-full">
            <div>
              <div className="text-xs text-bottega-dark-brown mb-2">{new Date(post.data_utworzenia).toLocaleDateString("pl-PL")}</div>
              <h2 className="font-playfair text-bottega-dark-brown text-lg font-semibold leading-snug break-words whitespace-normal line-clamp-3 mb-0">{post.tytul}</h2>
            </div>
            <div className="mt-6">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown px-4 py-2 border border-bottega-dark-brown"
              >
                Zobacz więcej
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </Animation>
  );
}

export default function Blog({ posts }: { posts: IBlogPost[] }) {
  return (
    <>
      <PageHeader title="BLOG" />
      <div className="max-w-6xl mx-auto p-4 pt-12">
        <div className="grid gap-4 justify-items-center [grid-template-columns:repeat(auto-fit,minmax(350px,1fr))]">
          {posts.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}

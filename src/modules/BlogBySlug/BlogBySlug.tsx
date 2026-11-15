import { Animation } from "@/components/Animation/Animation";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { IBlogPost } from "@/types/IBlogPost";
import { getAbsoluteUrl } from "@/utils/files";

export default function BlogBySlug({ post }: { post: IBlogPost }) {
  return (
    <>
      <PageHeader title="BLOG" as="p" />
      <div className="max-w-6xl mx-auto p-4 min-h-[300px] pt-12">
        <Animation>
          <article>
            <h1 className="font-playfair text-xl md:text-3xl font-bold mb-2 text-bottega-dark-brown">{post.tytul}</h1>
            <div className="text-xs text-bottega-brown mb-6">{new Date(post.data_utworzenia).toLocaleDateString("pl-PL")}</div>
            {post.attachments[0] && (
              // Intrinsic size of an upload is unknown here, and it is capped by max-h anyway.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getAbsoluteUrl(post.attachments[0])} alt={post.tytul} className="mb-6 max-h-[300px] object-contain rounded-sm" />
            )}
            {/* Post body is HTML written by the site owner in the admin panel. */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.tresc }} />
          </article>
        </Animation>
      </div>
    </>
  );
}

import { SiteChrome } from "@/components/SiteChrome/SiteChrome";
import NotFound from "./(site)/not-found";

/** Unknown URLs get the same 404 page as missing blog posts, inside the site frame. */
export default function RootNotFound() {
  return (
    <SiteChrome>
      <NotFound />
    </SiteChrome>
  );
}

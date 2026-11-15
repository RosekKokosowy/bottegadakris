import Image from "next/image";
import { getAbsoluteUrl } from "@/utils/files";

interface Props {
  link: string;
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * Image uploaded through the admin panel (or pasted as an external URL), filling its positioned parent.
 * Uploads are optimized by next/image; external hosts are shown as-is since they are not whitelisted.
 */
export function UploadedImage({ link, alt, className, sizes = "100vw" }: Props) {
  const src = getAbsoluteUrl(link);
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} unoptimized={src.startsWith("http")} />;
}

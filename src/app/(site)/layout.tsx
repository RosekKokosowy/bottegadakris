import { ReactNode } from "react";
import { SiteChrome } from "@/components/SiteChrome/SiteChrome";

export default function Layout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}

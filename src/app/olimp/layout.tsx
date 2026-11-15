import { Metadata } from "next";
import { ReactNode } from "react";
import { NextSessionProvider } from "@/providers/NextSessionProvider";

export const metadata: Metadata = { title: "Panel | Bottega da Kris", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return <NextSessionProvider>{children}</NextSessionProvider>;
}

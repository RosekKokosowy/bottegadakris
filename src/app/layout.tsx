import "./globals.css";
import { Lato, Playfair_Display, Poppins } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Metadata } from "next";
import { ReactNode } from "react";
import { AntdProvider } from "@/providers/AntdProvider";
import { SITE_URL } from "@/lib/seo/config";

const playfair = Playfair_Display({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-playfair-display", display: "swap" });
const poppins = Poppins({ subsets: ["latin", "latin-ext"], weight: ["100", "200", "300", "400", "500", "600", "700"], variable: "--font-poppins-sans", display: "swap" });
const lato = Lato({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--font-lato-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Bottega da Kris | Ceramika z pasją",
  description: "Warsztaty i autorska ceramika tworzona z pasją w Łodzi. Poznaj Bottegę da Kris i rozpocznij swoją przygodę z gliną!",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${playfair.variable} ${poppins.variable} ${lato.variable}`}>
      <body>
        <AntdRegistry layer>
          <AntdProvider>{children}</AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

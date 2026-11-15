import { ReactNode } from "react";
import { AosInit } from "@/components/Animation/AosInit";
import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar";
import { ModalProvider } from "@/providers/ModalProvider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <AosInit />
      <div className="relative">
        <Navbar />
        <main className="min-h-[calc(100vh-255px)]">{children}</main>
        <Footer />
      </div>
    </ModalProvider>
  );
}

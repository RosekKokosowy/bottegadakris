import { Metadata } from "next";
import Studio from "@/modules/Studio/Studio";

export const metadata: Metadata = {
  title: "Nasze Studio | Bottega da Kris",
  description: "Zajrzyj do naszej pracowni – przestrzeni pełnej pasji, spokoju i kreatywności. Studio ceramiki w sercu Łodzi.",
  alternates: { canonical: "/pracownia" },
};

export default function Page() {
  return <Studio />;
}

import { Metadata } from "next";
import AboutMe from "@/modules/AboutMe/AboutMe";

export const metadata: Metadata = {
  title: "O mnie | Bottega da Kris",
  description: "Poznaj historię Bottegi da Kris. Dowiedz się, kim jestem, skąd pasja do ceramiki i co chcę Ci przekazać.",
  alternates: { canonical: "/o-mnie" },
};

export default function Page() {
  return <AboutMe />;
}

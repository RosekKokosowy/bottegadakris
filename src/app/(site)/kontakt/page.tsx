import { Metadata } from "next";
import Contact from "@/modules/Contact/Contact";

export const metadata: Metadata = {
  title: "Kontakt | Bottega da Kris",
  description: "Skontaktuj się z nami – napisz, zadzwoń lub odwiedź pracownię w Łodzi. Z chęcią odpowiemy na Twoje pytania.",
  alternates: { canonical: "/kontakt" },
};

export default function Page() {
  return <Contact />;
}

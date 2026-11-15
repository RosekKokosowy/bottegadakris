import { Metadata } from "next";
import Vouchers from "@/modules/Vouchers/Vouchers";

export const metadata: Metadata = {
  title: "Vouchery na warsztaty | Bottega da Kris",
  description: "Podaruj komuś kreatywność! Vouchery na warsztaty ceramiki to prezent pełen emocji i twórczej zabawy.",
  alternates: { canonical: "/vouchery" },
};

export default function Page() {
  return <Vouchers />;
}

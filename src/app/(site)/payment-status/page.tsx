import { Metadata } from "next";
import PaymentStatus from "@/modules/PaymentStatus/PaymentStatus";

export const metadata: Metadata = { title: "Status płatności | Bottega da Kris", robots: { index: false } };

type SearchParams = Promise<{ uid?: string; r?: string; _x?: string }>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { uid = "", r = "", _x = "" } = await searchParams;
  return <PaymentStatus uid={uid} rodzaj={r} id={_x} />;
}

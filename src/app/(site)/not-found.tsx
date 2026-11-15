import Link from "next/link";
import { PageHeader } from "@/components/PageHeader/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader title="NIE ZNALEZIONO" />
      <div className="flex flex-col items-center py-24 font-poppins text-bottega-dark-brown text-center px-6">
        <p className="text-xl">Ta strona nie istnieje lub została przeniesiona.</p>
        <Link
          href="/"
          className="inline-block border-bottega-dark-brown hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out"
        >
          Strona główna
        </Link>
      </div>
    </>
  );
}

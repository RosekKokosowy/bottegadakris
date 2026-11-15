'use client';

import { useEffect } from "react";
import { useTrace } from "@/hooks/useTrace";
import { CONTACT } from "@/utils/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { log } = useTrace();

  useEffect(() => {
    log("[ErrorProvider]", error, "Something gone wrong in the (site) segment.");
  }, [error, log]);

  return (
    <div className="flex flex-col items-center pt-48 pb-24 font-poppins text-bottega-dark-brown text-center px-6">
      <p className="text-2xl">Coś poszło nie tak…</p>
      <p className="text-lg pt-4">
        Spróbuj ponownie za chwilę lub zadzwoń: {CONTACT.phone}
      </p>
      <button
        type="button"
        onClick={reset}
        className="border-bottega-dark-brown hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}

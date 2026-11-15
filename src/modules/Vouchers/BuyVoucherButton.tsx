'use client';

import { Button } from "@/components/Button/Button";
import { useModalContext } from "@/hooks/useModalContext";

export function BuyVoucherButton() {
  const { setIsVoucherOpen } = useModalContext();

  return (
    <Button
      type="button"
      className="border-bottega-dark-brown hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown"
      onClick={() => setIsVoucherOpen(true)}
    >
      KUP VOUCHER
    </Button>
  );
}

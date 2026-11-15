import { ReactNode } from "react";
import { AosInit } from "@/components/Animation/AosInit";
import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar";
import { BookingModal } from "@/modules/Booking/BookingModal";
import { VoucherModal } from "@/modules/Voucher/VoucherModal";
import { ModalProvider } from "@/providers/ModalProvider";

/** Public site frame: navbar, footer and the booking/voucher dialogs. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <AosInit />
      <div className="relative">
        <Navbar />
        <main className="min-h-[calc(100vh-255px)]">{children}</main>
        <Footer />
      </div>
      <BookingModal />
      <VoucherModal />
    </ModalProvider>
  );
}

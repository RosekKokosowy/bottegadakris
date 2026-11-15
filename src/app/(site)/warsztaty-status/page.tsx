import { Metadata } from "next";
import { getBookingByUuid } from "@/lib/schedule.inc";
import { log } from "@/lib/trace.inc";
import WorkshopStatus, { NotFoundCard } from "@/modules/WorkshopStatus/WorkshopStatus";

export const metadata: Metadata = { title: "Rezerwacja warsztatów | Bottega da Kris", robots: { index: false } };

const TITLE = "REZERWACJA WARSZTATÓW";

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) return <NotFoundCard title={TITLE} error="Brak ID zapisu" />;

  let booking;
  try {
    booking = await getBookingByUuid(id);
  } catch (error) {
    log("/warsztaty-status", error, `Failed to load booking ${id}.`);
    return <NotFoundCard title={TITLE} error="Nie udało się pobrać danych zapisu" />;
  }

  return booking ? <WorkshopStatus booking={booking} /> : <NotFoundCard title={TITLE} error="Nie znaleziono zapisu" />;
}

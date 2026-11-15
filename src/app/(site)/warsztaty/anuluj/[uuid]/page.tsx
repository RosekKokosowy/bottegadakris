import { Metadata } from "next";
import { getBookingByUuid } from "@/lib/schedule.inc";
import { log } from "@/lib/trace.inc";
import WorkshopCancel from "@/modules/WorkshopStatus/WorkshopCancel";
import { NotFoundCard } from "@/modules/WorkshopStatus/WorkshopStatus";

export const metadata: Metadata = { title: "Rezygnacja z warsztatów | Bottega da Kris", robots: { index: false } };

const TITLE = "REZYGNACJA Z WARSZTATÓW";

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;

  let booking;
  try {
    booking = await getBookingByUuid(uuid);
  } catch (error) {
    log("/warsztaty/anuluj/[uuid]", error, `Failed to load booking ${uuid}.`);
    return <NotFoundCard title={TITLE} error="Nie udało się pobrać danych zapisu" />;
  }

  return booking ? <WorkshopCancel booking={booking} /> : <NotFoundCard title={TITLE} error="Nie znaleziono zapisu" />;
}

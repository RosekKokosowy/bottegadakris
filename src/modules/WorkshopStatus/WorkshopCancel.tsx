import { Card } from "antd";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { IBookingStatus } from "@/types/ISchedule";
import { formatDatePL } from "@/utils/date";
import { CONTACT } from "@/utils/navigation";

/** Result of the cancel link from the booking e-mail (/warsztaty/anuluj/<uuid>). */
export default function WorkshopCancel({ booking }: { booking: IBookingStatus }) {
  const when = (
    <>
      <b className="text-bottega-brown">{booking.warsztat.nazwa}</b> w dniu <b>{formatDatePL(booking.data)}</b> o godzinie <b>{booking.godzina.split(":").slice(0, 2).join(":")}</b>
    </>
  );

  return (
    <>
      <PageHeader title="REZYGNACJA Z WARSZTATÓW" />
      <div className="text-bottega-dark-brown flex py-12 md:py-6 w-full items-center justify-center text-center">
        <Card className="flex w-1/2 text-bottega-dark-brown font-poppins text-base p-6">
          {booking.status === "NIEAKTYWNY" ? (
            <p className="text-base text-center">
              Rezerwacja warsztatu {when} została <span className="text-bottega-brown font-bold">pomyślnie anulowana</span>.
            </p>
          ) : (
            <>
              <p className="text-base text-center block">
                Wystąpił problem z anulowaniem rezerwacji warsztatu {when}.<br />
              </p>
              <small className="mt-4">
                Skontaktuj się z nami: <b>biuro@bottegadakris.pl</b> lub <b>{CONTACT.phone}</b>
              </small>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

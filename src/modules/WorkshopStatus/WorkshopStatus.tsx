import { Card } from "antd";
import { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { IBookingStatus } from "@/types/ISchedule";
import { formatDatePL } from "@/utils/date";

const label = "flex flex-col text-bottega-dark-brown text-lg items-start justify-start text-left font-poppins w-44";

function Row({ title, children, strong }: { title: string; children: ReactNode; strong?: boolean }) {
  return (
    <div className="flex flex-row w-full">
      <div className={label}>{title}</div>
      <div className={`flex flex-col text-bottega-dark-brown text-lg items-start justify-start text-left font-poppins${strong ? " font-medium" : ""}`}>{children}</div>
    </div>
  );
}

export function NotFoundCard({ title, error }: { title: string; error: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="text-bottega-dark-brown flex py-12 md:py-6 w-full items-center justify-center text-center">
        <Card className="flex w-1/2 text-bottega-dark-brown font-poppins text-lg p-4">
          <div className="text-red-600 text-center">{error}</div>
        </Card>
      </div>
    </>
  );
}

/** Booking summary shown after a successful booking (/warsztaty-status?id=<uuid>). */
export default function WorkshopStatus({ booking }: { booking: IBookingStatus }) {
  return (
    <>
      <PageHeader title="REZERWACJA WARSZTATÓW" />
      <div className="text-bottega-dark-brown flex py-12 md:py-6 w-full items-center justify-center text-center">
        <Card className="flex w-1/2 text-bottega-dark-brown font-poppins text-lg p-0">
          <Row title="Warsztat:" strong>{booking.warsztat.nazwa}</Row>
          <Row title="Data:">{formatDatePL(booking.data)}</Row>
          <Row title="Godzina:">{booking.godzina.slice(0, 5)}</Row>
          <Row title="Czas trwania:">{Number(booking.warsztat.czas) / 60} h</Row>
          <Row title="Liczba osób:">{booking.ileOsob}</Row>
          {booking.voucherKod && <Row title="Kod vouchera:">{booking.voucherKod}</Row>}
          <Row title="Do zapłaty:" strong>{booking.doplata > 0 ? `${booking.doplata.toFixed(2)} PLN` : "W pełni opłacone"}</Row>
        </Card>
      </div>
    </>
  );
}

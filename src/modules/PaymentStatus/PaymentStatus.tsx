'use client';

import { Card } from "antd";
import { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

const label = "flex flex-col text-bottega-dark-brown text-lg items-start justify-start text-left font-poppins w-44";
const value = "flex flex-col text-bottega-dark-brown text-lg items-start justify-start text-left font-poppins";

function Row({ title, children, className = value }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-row w-full">
      <div className={label}>{title}</div>
      <div className={className}>{children}</div>
    </div>
  );
}

export default function PaymentStatus({ uid, rodzaj, id }: { uid: string; rodzaj: string; id: string }) {
  const { details, error } = usePaymentStatus({ uid, rodzaj, id });
  const isVoucher = rodzaj === "V";

  return (
    <>
      <PageHeader title="STATUS PŁATNOŚCI" />
      <div className="text-bottega-dark-brown flex py-12 md:py-6 w-full items-center justify-center text-center">
        {!details ? (
          <div className="font-poppins">{error ? "Nie znaleziono płatności." : "Ładowanie..."}</div>
        ) : (
          <PaymentCard details={details} uid={uid} isVoucher={isVoucher} />
        )}
      </div>
    </>
  );
}

function PaymentCard({ details, uid, isVoucher }: { details: NonNullable<ReturnType<typeof usePaymentStatus>["details"]>; uid: string; isVoucher: boolean }) {
  const isPaid = isVoucher ? Number(details.platnosc) === 1 : Number(details.platnosc) > 0;

  return (
    <Card className="flex w-1/2 text-bottega-dark-brown font-poppins text-lg p-0">
      <Row title="Zakup:">{isVoucher ? `Voucher od ${details.od} dla ${details.dla} - ${details.nazwa}` : `Zaliczka - ${details.nazwa}`}</Row>
      {isVoucher && (
        <Row title="Kod vouchera:" className="flex flex-col text-bottega-dark-brown text-xl tracking-widest items-start justify-start text-left font-poppins font-medium">
          {details.kod}
        </Row>
      )}
      <Row title="Kwota:">{isVoucher ? details.cena : "50.00"} PLN</Row>
      <Row title="Status płatności:" className={`flex flex-col font-medium ${isPaid ? "text-green-600" : "text-red-600"} text-lg items-start justify-start text-left font-poppins`}>
        {isPaid ? "Potwierdzona" : "Niepotwierdzona"}
      </Row>
      <Row title="Numer płatności:">{uid}</Row>

      <div className="flex w-full text-xl text-center items-center justify-center align-middle m-0 p-0 mt-4">
        <p className="flex flex-row w-full text-xl text-center items-center justify-center align-middle m-0 p-0 mt-4">
          {isPaid ? "Możesz już zamknąć kartę" : "Jeśli płatność się powiodła, nie zamykaj karty, poczekaj na potwierdzenie."}
        </p>
      </div>
    </Card>
  );
}

import "server-only";

import { render } from "@react-email/render";
import VoucherEmail from "@/emails/voucher-email";
import WorkshopCancelEmail from "@/emails/workshop-cancel";
import WorkshopEmail from "@/emails/workshop-email";
import WorkshopRescheduleEmail from "@/emails/workshop-reschedule";
import { log } from "./trace.inc";
import { MAIL_OFFICE, sendMail } from "./mail.inc";
import { renderVoucherPdf } from "./voucher-pdf.inc";

/** Customer + office copy, as the old backend sent them. */
const recipients = (email: string) => [email, MAIL_OFFICE];

interface IWorkshopMail {
  imieNazwisko: string;
  warsztatNazwa: string;
  data: string;
  godzina: string;
  email: string;
}

export async function sendWorkshopMail({ kwotaPozostala, uuid, ...booking }: IWorkshopMail & { kwotaPozostala: number; uuid: string }) {
  await sendMail({
    to: recipients(booking.email),
    subject: "Warsztat - Potwierdzenie rezerwacji",
    html: await render(WorkshopEmail({ ...booking, kwotaPozostała: kwotaPozostala, uuid })),
  });
}

export async function sendRescheduleMail({ kwotaPozostala, ...booking }: IWorkshopMail & { kwotaPozostala: number }) {
  await sendMail({
    to: recipients(booking.email),
    subject: "Warsztat - Zmiana terminu rezerwacji",
    html: await render(WorkshopRescheduleEmail({ ...booking, kwotaPozostała: kwotaPozostala })),
  });
}

export async function sendCancellationMail(booking: IWorkshopMail) {
  await sendMail({
    to: recipients(booking.email),
    subject: "Warsztat - Anulowanie rezerwacji",
    html: await render(WorkshopCancelEmail(booking)),
  });
}

export async function sendVoucherMail({ email, warsztatNazwa, od, dla, kod }: { email: string; warsztatNazwa: string; od: string; dla: string; kod: string }) {
  let attachments;
  try {
    attachments = [{ filename: "voucher.pdf", content: await renderVoucherPdf({ warsztatNazwa, od, dla, kod }) }];
  } catch (error) {
    // The code is in the mail body too, so a PDF failure must not stop the mail.
    log("[Mail]", error, `Voucher PDF for code ${kod} could not be rendered; sending mail without it.`);
  }

  await sendMail({
    to: recipients(email),
    subject: "Zakup Vouchera",
    html: await render(VoucherEmail({ voucherCode: kod, workshopName: warsztatNazwa, fromName: od, forName: dla })),
    attachments,
  });
}

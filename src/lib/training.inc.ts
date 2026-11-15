import "server-only";

import { randomUUID } from "crypto";
import { IBookingRequest } from "@/types/IBooking";
import { computeAmountToPay } from "@/utils/payment";
import { execute, num, select } from "./db.inc";
import { sendCancellationMail, sendRescheduleMail, sendWorkshopMail } from "./emails.inc";
import { log } from "./trace.inc";

/** Business-rule violation shown to the customer/admin (HTTP 400). */
export class BookingError extends Error {}

const GROUP_WORKSHOP = "GRUPY ZORGANIZOWANE";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}(:\d{2})?$/;

const toMin = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

/**
 * The studio holds one workshop type at a time; the same type may share hours up to its capacity.
 * Checks the whole duration of the new booking (the old API only checked its first hour).
 */
async function assertSlotFree({ data, godzina, warsztatId, liczbaOsob, sloty, maxOsob, excludeId }: {
  data: string; godzina: string; warsztatId: number; liczbaOsob: number; sloty: number; maxOsob: number; excludeId?: number;
}) {
  const start = toMin(godzina);
  const end = start + sloty * 60;

  const sameDay = await select<{ godzina: string; ile_osob: number; warsztat_id: number; sloty: number }>(
    `SELECT z.godzina, z.ile_osob, w.id as warsztat_id, w.sloty
     FROM zapisy z
     LEFT JOIN warsztaty w ON z.warsztat=w.id
     WHERE z.data=? AND z.status='AKTYWNY' ${excludeId ? "AND z.id != ?" : ""}`,
    excludeId ? [data, excludeId] : [data],
  );
  const overlapping = sameDay.filter((b) => start < toMin(b.godzina) + num(b.sloty) * 60 && end > toMin(b.godzina));

  if (overlapping.some((b) => b.warsztat_id !== warsztatId)) {
    throw new BookingError("Termin już został zajęty przez inny warsztat.");
  }
  const currentTotalPersons = overlapping.reduce((sum, b) => sum + num(b.ile_osob), 0);
  if (currentTotalPersons + liczbaOsob > maxOsob) {
    throw new BookingError(`Przekroczono maksymalną liczbę osób (${maxOsob}). Obecnie zapisanych: ${currentTotalPersons}, próba dodania: ${liczbaOsob}`);
  }

  const breaks = await select<{ godzina_od: string; godzina_do: string }>(`SELECT godzina_od, godzina_do FROM przerwy WHERE dzien = WEEKDAY(?)`, [data]);
  if (breaks.some((b) => start < toMin(b.godzina_do) && end > toMin(b.godzina_od))) {
    throw new BookingError("Wybrany termin koliduje z przerwą w pracy.");
  }
}

export async function sendWorkshopConfirmationEmail(id: number) {
  const [zapis] = await select<{ uuid: string; status: number; cenaWarsztatu: number; zaliczka: number; kwota_vouchera: number; email: string; imie_nazwisko: string; warsztatNazwa: string; data: string; godzina: string }>(
    `SELECT z.uuid as uuid, z.oplacony as status, z.cena as cenaWarsztatu, z.zaliczka as zaliczka, z.kwota_vouchera as kwota_vouchera,
            k.email, k.imie_nazwisko, w.nazwa as warsztatNazwa, z.data as data, z.godzina as godzina
     FROM zapisy z LEFT JOIN klienci k ON z.klient=k.id LEFT JOIN warsztaty w ON z.warsztat=w.id
     WHERE z.id=? LIMIT 1`,
    [id],
  );
  if (!zapis) return;

  await sendWorkshopMail({
    imieNazwisko: zapis.imie_nazwisko,
    warsztatNazwa: zapis.warsztatNazwa,
    data: zapis.data,
    godzina: zapis.godzina,
    email: zapis.email,
    uuid: zapis.uuid,
    kwotaPozostala: computeAmountToPay({ status: num(zapis.status), workshopPrice: num(zapis.cenaWarsztatu), prepaidAmount: num(zapis.zaliczka), voucherAmount: num(zapis.kwota_vouchera) }) ?? 0,
  });
}

/** Finds a client by e-mail or creates one; returns its id. */
export async function upsertClient({ imieNazwisko, telefon, email }: { imieNazwisko: string; telefon: string; email: string }): Promise<number> {
  const [existing] = await select<{ id: number }>(`SELECT id FROM klienci WHERE email = ?`, [email]);
  if (existing) return existing.id;

  const { insertId } = await execute(`INSERT INTO klienci (imie_nazwisko, telefon, email, status) VALUES (?, ?, ?, 'AKTYWNY')`, [imieNazwisko, telefon, email]);
  return insertId;
}

/** Creates a booking (public dialog and admin panel), applying a gift voucher if given. Returns the booking uuid. */
export async function createBooking(body: IBookingRequest): Promise<string> {
  const { imieNazwisko, telefon, email, komentarz, voucher, voucherKod, data, godzina, zrodloZapisu } = body;
  const warsztatTyp = Number(body.warsztatTyp);
  const liczbaOsob = Number(body.liczbaOsob);

  if (!imieNazwisko || !telefon || !email) throw new BookingError("Uzupełnij dane kontaktowe.");
  if (!DATE.test(data ?? "") || !TIME.test(godzina ?? "")) throw new BookingError("Wybierz datę i godzinę!");
  if (!Number.isInteger(liczbaOsob) || liczbaOsob < 1) throw new BookingError("Wybierz liczbę osób.");

  const [workshop] = await select<{ id: number; nazwa: string; cena: number; sloty: number; max_osob: number }>(
    `SELECT id, nazwa, cena, sloty, max_osob FROM warsztaty WHERE id=? AND status='AKTYWNY' LIMIT 1`,
    [warsztatTyp],
  );
  if (!workshop) throw new BookingError("Nieprawidłowy warsztat.");

  await assertSlotFree({ data, godzina, warsztatId: workshop.id, liczbaOsob, sloty: num(workshop.sloty), maxOsob: num(workshop.max_osob) });

  let voucherData: { id: number; warsztat: number | null; status: string; rodzaj: string; kwota: number; kwota_wykorzystana: number } | undefined;
  if (voucher) {
    if (voucherKod?.length !== 8) throw new BookingError("Niepoprawny kod vouchera");
    [voucherData] = await select(`SELECT id, warsztat, status, rodzaj, kwota, kwota_wykorzystana FROM voucher WHERE kod=?`, [voucherKod]);
    if (!voucherData) throw new BookingError("Niepoprawny kod vouchera");
    if (voucherData.warsztat && voucherData.warsztat !== workshop.id) throw new BookingError("Kod vouchera nie pasuje do wybranego warsztatu");
    if (voucherData.status === "NIEAKTYWNY") throw new BookingError("Voucher nieaktywny");
    if (voucherData.status === "WYKORZYSTANY") throw new BookingError("Voucher wykorzystany");
  }

  const klient = await upsertClient({ imieNazwisko, telefon, email });
  const cena = num(workshop.cena);
  const remaining = voucherData ? num(voucherData.kwota) - num(voucherData.kwota_wykorzystana) : 0;
  const oplacony = voucherData ? (voucherData.rodzaj === "KWOTA" && remaining < cena ? 4 : 2) : 0;
  const uid = randomUUID();

  const { insertId } = await execute(
    `INSERT INTO zapisy
       (klient, ile_osob, warsztat, mam_voucher, status, uwagi, data, godzina, uuid, zrodlo_zapisu, voucher_id, oplacony, kwota_vouchera, cena)
     VALUES (?, ?, ?, ?, 'AKTYWNY', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [klient, liczbaOsob, workshop.id, Boolean(voucher), komentarz ?? "", data, godzina, uid, zrodloZapisu ?? "ONLINE", voucherData?.id ?? 0, oplacony, remaining, workshop.nazwa === GROUP_WORKSHOP ? cena : cena * liczbaOsob],
  );

  if (voucherData) {
    const status = voucherData.rodzaj === "KWOTA" && remaining > cena ? "CZĘŚCIOWO_WYKORZYSTANY" : "WYKORZYSTANY";
    const kwotaWykorzystana = num(voucherData.kwota_wykorzystana) + Math.min(remaining, cena);
    await execute(`UPDATE voucher SET status=?, kwota_wykorzystana=? WHERE id=? LIMIT 1`, [status, kwotaWykorzystana, voucherData.id]);
  }

  await sendWorkshopConfirmationEmail(insertId);
  return uid;
}

export async function rescheduleBooking({ id, data, godzina }: { id: number; data: string; godzina: string }) {
  if (!DATE.test(data ?? "") || !TIME.test(godzina ?? "")) throw new BookingError("Wybierz datę i godzinę!");

  const [current] = await select<{ status: number; warsztat: number; ile_osob: number; sloty: number; max_osob: number; imieNazwisko: string; email: string; warsztatNazwa: string; zaliczka: number; cenaWarsztatu: number; kwota_vouchera: number }>(
    `SELECT z.oplacony as status, z.warsztat, z.ile_osob, w.sloty, w.max_osob, k.imie_nazwisko as imieNazwisko, k.email,
            w.nazwa as warsztatNazwa, z.zaliczka as zaliczka, z.cena as cenaWarsztatu, z.kwota_vouchera as kwota_vouchera
     FROM zapisy z
     LEFT JOIN warsztaty w ON z.warsztat = w.id
     LEFT JOIN klienci k ON z.klient = k.id
     WHERE z.id = ? AND z.status = 'AKTYWNY'
     LIMIT 1`,
    [id],
  );
  if (!current) throw new BookingError("Zapis nie został znaleziony.");

  await assertSlotFree({ data, godzina, warsztatId: current.warsztat, liczbaOsob: num(current.ile_osob), sloty: num(current.sloty), maxOsob: num(current.max_osob), excludeId: id });
  await execute(`UPDATE zapisy SET data = ?, godzina = ? WHERE id = ? LIMIT 1`, [data, godzina, id]);

  await sendRescheduleMail({
    imieNazwisko: current.imieNazwisko,
    warsztatNazwa: current.warsztatNazwa,
    data,
    godzina,
    email: current.email,
    kwotaPozostala: computeAmountToPay({ status: num(current.status), workshopPrice: num(current.cenaWarsztatu), prepaidAmount: num(current.zaliczka), voucherAmount: num(current.kwota_vouchera) }) ?? 0,
  });
}

/** Marks the rest of a booking as paid on site and records the payment. */
export async function setBookingPaid({ id, doplata }: { id: number; doplata: number }) {
  await execute(`INSERT INTO doplaty (id_w_tabeli, kwota) VALUES (?, ?)`, [id, doplata]);
  await execute(`UPDATE zapisy SET oplacony=3 WHERE id = ? LIMIT 1`, [id]);
}

/**
 * Cancels an active booking, gives back the voucher value it used and mails the customer.
 * Returns false when there was no active booking (already cancelled), so repeating it changes nothing.
 */
async function cancelBooking(where: "id" | "uuid", value: number | string): Promise<boolean> {
  const { affectedRows } = await execute(`UPDATE zapisy SET status='NIEAKTYWNY' WHERE ${where} = ? AND status='AKTYWNY' LIMIT 1`, [value]);
  if (affectedRows === 0) return false;

  const [zapis] = await select<{ voucher_id: number; kwota_vouchera: number; cena: number; ile_osob: number; imieNazwisko: string; email: string; warsztatNazwa: string; data: string; godzina: string }>(
    `SELECT z.voucher_id, z.kwota_vouchera, z.cena, z.ile_osob, k.imie_nazwisko as imieNazwisko, k.email, w.nazwa as warsztatNazwa, z.data as data, z.godzina as godzina
     FROM zapisy z
     LEFT JOIN warsztaty w ON z.warsztat = w.id
     LEFT JOIN klienci k ON z.klient = k.id
     WHERE z.${where} = ? LIMIT 1`,
    [value],
  );

  if (zapis?.voucher_id) {
    const [voucher] = await select<{ rodzaj: string; kwota_wykorzystana: number }>(`SELECT rodzaj, kwota, kwota_wykorzystana FROM voucher WHERE id = ? LIMIT 1`, [zapis.voucher_id]);
    if (voucher?.rodzaj === "KWOTA") {
      // Give back what this booking took: min(voucher balance at booking, unit price) — `kwota_vouchera` alone is the balance, not the amount used.
      const unitPrice = zapis.warsztatNazwa === GROUP_WORKSHOP ? num(zapis.cena) : num(zapis.cena) / Math.max(num(zapis.ile_osob), 1);
      const newUsed = Math.max(num(voucher.kwota_wykorzystana) - Math.min(num(zapis.kwota_vouchera), unitPrice), 0);
      await execute(`UPDATE voucher SET kwota_wykorzystana=?, status=? WHERE id=? LIMIT 1`, [newUsed, newUsed === 0 ? "AKTYWNY" : "CZĘŚCIOWO_WYKORZYSTANY", zapis.voucher_id]);
    } else if (voucher) {
      await execute(`UPDATE voucher SET status='AKTYWNY' WHERE id=? LIMIT 1`, [zapis.voucher_id]);
    }
  }

  if (zapis) await sendCancellationMail({ imieNazwisko: zapis.imieNazwisko, warsztatNazwa: zapis.warsztatNazwa, data: zapis.data, godzina: zapis.godzina, email: zapis.email });
  return true;
}

export const cancelBookingByUuid = (uuid: string) => cancelBooking("uuid", uuid);

export async function cancelBookings(ids: number[]) {
  const processedIds: number[] = [];
  const errors: { id: number; error: string }[] = [];

  for (const id of ids) {
    try {
      await cancelBooking("id", id);
      processedIds.push(id);
    } catch (error) {
      log("cancelBookings", error, `Failed to cancel booking ${id}.`);
      errors.push({ id, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return { processedIds, errors };
}

export async function getClientBookings(clientId: number) {
  const rows = await select<{
    id: number; data: string; godzina: string; zrodloZapisu: string; ileOsob: number; oplacony: number; zaliczka: number; uwagi: string;
    imieNazwisko: string; email: string; telefon: string; kodPocztowy: string; ulica: string; miasto: string; numerDomu: string; numerMieszkania: string;
    warsztatNazwa: string; warsztatId: number; klientId: number;
  }>(
    `SELECT
        z.id, z.data, z.godzina, z.zrodlo_zapisu as zrodloZapisu, z.ile_osob as ileOsob, z.oplacony, z.zaliczka, z.uwagi,
        k.imie_nazwisko as imieNazwisko, k.email, k.telefon,
        k.kod_pocztowy as kodPocztowy, k.ulica, k.miasto, k.numer_domu as numerDomu, k.numer_mieszkania as numerMieszkania,
        w.nazwa as warsztatNazwa, w.id as warsztatId,
        k.id as klientId
      FROM zapisy z
      LEFT JOIN klienci k ON z.klient=k.id
      LEFT JOIN warsztaty w ON z.warsztat=w.id
      WHERE z.status='AKTYWNY' AND z.klient=?`,
    [clientId],
  );

  return rows.map((val) => ({
    id: val.id,
    data: val.data,
    godzina: val.godzina,
    zrodloZapisu: val.zrodloZapisu,
    ileOsob: val.ileOsob,
    oplacony: val.oplacony,
    zaliczka: val.zaliczka,
    uwagi: val.uwagi,
    warsztatNazwa: val.warsztatNazwa,
    warsztatId: val.warsztatId,
    klient: {
      id: val.klientId,
      imieNazwisko: val.imieNazwisko,
      email: val.email,
      kodPocztowy: val.kodPocztowy,
      ulica: val.ulica,
      miasto: val.miasto,
      numerDomu: val.numerDomu,
      numerMieszkania: val.numerMieszkania,
      telefon: val.telefon,
    },
  }));
}

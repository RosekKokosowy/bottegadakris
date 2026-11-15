import "server-only";

import { randomInt, randomUUID } from "crypto";
import { IVoucher, IVoucherCodeInfo, IVoucherRequest } from "@/types/IVoucher";
import { execute, num, select } from "./db.inc";
import { createPayment } from "./payment.inc";

export class VoucherError extends Error {}

const MIN_AMOUNT = 50;
const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateCode = () => Array.from({ length: 8 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");

async function uniqueCode(): Promise<string> {
  for (;;) {
    const kod = generateCode();
    const [taken] = await select(`SELECT id FROM voucher WHERE kod=?`, [kod]);
    if (!taken) return kod;
  }
}

/** Buyer as a client: created with address, or their address updated (empty fields keep the stored value). */
async function upsertBuyer(v: IVoucherRequest): Promise<number> {
  const [existing] = await select<{ id: number }>(`SELECT id FROM klienci WHERE email = ?`, [v.email]);
  const address = [v.ulica || null, v.numerDomu || null, v.numerMieszkania || null, v.kodPocztowy || null, v.miasto || null];

  if (!existing) {
    const { insertId } = await execute(
      `INSERT INTO klienci (imie_nazwisko, telefon, email, ulica, numer_domu, numer_mieszkania, kod_pocztowy, miasto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AKTYWNY')`,
      [v.imieNazwisko, v.telefon, v.email, ...address],
    );
    return insertId;
  }

  await execute(
    `UPDATE klienci SET ulica=COALESCE(?, ulica), numer_domu=COALESCE(?, numer_domu), numer_mieszkania=COALESCE(?, numer_mieszkania), kod_pocztowy=COALESCE(?, kod_pocztowy), miasto=COALESCE(?, miasto) WHERE id=? LIMIT 1`,
    [...address, existing.id],
  );
  return existing.id;
}

/** Creates an unpaid voucher and returns the Przelewy24 payment link; the voucher activates when P24 confirms. */
export async function createVoucher(v: IVoucherRequest): Promise<{ id: number; link: string }> {
  if (!v.imieNazwisko || !v.telefon || !v.email || !v.od || !v.dla) throw new VoucherError("Uzupełnij wymagane pola.");

  let rodzaj: "WARSZTAT" | "KWOTA";
  let warsztatId: number | null = null;
  let kwota: number;

  if (v.warsztatTyp) {
    const [workshop] = await select<{ id: number; cena: number }>(`SELECT id, cena FROM warsztaty WHERE id=? AND status='AKTYWNY'`, [v.warsztatTyp]);
    if (!workshop) throw new VoucherError("Nieprawidłowy warsztat.");
    rodzaj = "WARSZTAT";
    warsztatId = workshop.id;
    kwota = num(workshop.cena);
  } else if (v.kwota) {
    rodzaj = "KWOTA";
    kwota = Math.round(Number(v.kwota) * 100) / 100;
    if (!(kwota >= MIN_AMOUNT)) throw new VoucherError(`Kwota musi być większa lub równa ${MIN_AMOUNT} zł`);
  } else {
    throw new VoucherError("Brak warsztatTyp lub kwota");
  }

  const klient = await upsertBuyer(v);
  const kod = await uniqueCode();
  const uid = randomUUID();

  const { insertId } = await execute(
    `INSERT INTO voucher (klient, od, dla, rodzaj, warsztat, kwota, status, uwagi, kod, uuid) VALUES (?, ?, ?, ?, ?, ?, 'NIEAKTYWNY', ?, ?, ?)`,
    [klient, v.od, v.dla, rodzaj, warsztatId, kwota, v.komentarz ?? "", kod, uid],
  );

  const link = await createPayment({
    email: v.email,
    uid,
    id: insertId,
    rodzaj: "V",
    amount: Math.round(kwota * 100),
    description: rodzaj === "WARSZTAT" ? "Płatność za Voucher na warsztat w Bottega da Kris" : "Płatność za Voucher kwotowy w Bottega da Kris",
  });

  return { id: insertId, link };
}

/** What an active voucher code covers (booking dialog); undefined for unknown or used-up codes. */
export async function findVoucherByCode(code: string): Promise<IVoucherCodeInfo | undefined> {
  const rows = await select<{ warsztatTyp: number | null; rodzaj: IVoucherCodeInfo["rodzaj"]; kwota: number; kwota_wykorzystana: number }>(
    `SELECT warsztat as warsztatTyp, rodzaj as rodzaj, kwota as kwota, kwota_wykorzystana FROM voucher WHERE kod=? AND (status='AKTYWNY' OR status='CZĘŚCIOWO_WYKORZYSTANY')`,
    [code],
  );
  if (rows.length !== 1) return undefined;
  const [voucher] = rows;
  return { warsztatTyp: voucher.warsztatTyp, rodzaj: voucher.rodzaj, kwota: num(voucher.kwota) - num(voucher.kwota_wykorzystana) };
}

export async function getVouchers({ dataOd, dataDo, client }: { dataOd: string; dataDo: string; client?: string }): Promise<IVoucher[]> {
  const params: unknown[] = [`${dataOd} 00:00:00`, `${dataDo} 23:59:59`];
  let sql = `
    SELECT
      v.*,
      k.imie_nazwisko as imieNazwisko, k.email, k.telefon,
      k.kod_pocztowy as kodPocztowy, k.ulica, k.miasto, k.numer_domu as numerDomu, k.numer_mieszkania as numerMieszkania, k.id as klientId,
      w.nazwa as warsztatNazwa, w.id as warsztatId
    FROM voucher v
    LEFT JOIN klienci k ON v.klient=k.id
    LEFT JOIN warsztaty w ON v.warsztat=w.id
    WHERE v.status IN ('AKTYWNY', 'CZĘŚCIOWO_WYKORZYSTANY', 'WYKORZYSTANY') AND v.data_zakupu BETWEEN ? AND ?`;

  if (client) {
    sql += ` AND (k.imie_nazwisko LIKE ? OR k.telefon LIKE ? OR k.email LIKE ?)`;
    params.push(`%${client}%`, `%${client}%`, `%${client}%`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await select<any>(sql, params);
  return rows.map((val) => ({
    id: val.id,
    od: val.od,
    dla: val.dla,
    czyPlatnosc: val.czy_platnosc,
    identyfikatorPlatnosci: val.identyfikator_platnosci,
    status: val.status,
    rodzaj: val.rodzaj,
    dataZakupu: val.data_zakupu,
    uwagi: val.uwagi,
    kod: val.kod,
    warsztatNazwa: val.warsztatNazwa,
    warsztatId: val.warsztatId,
    kwota: num(val.kwota),
    kwotaWykorzystana: num(val.kwota_wykorzystana),
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

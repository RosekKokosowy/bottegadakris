import "server-only";

import axios from "axios";
import { createHash } from "crypto";
import { SITE_URL } from "./seo/config";
import { execute, num, select } from "./db.inc";
import { sendVoucherMail } from "./emails.inc";
import { log } from "./trace.inc";
import { sendWorkshopConfirmationEmail } from "./training.inc";

/** T = booking deposit (zapisy), V = gift voucher (voucher). */
export type IPaymentKind = "T" | "V";

const p24 = {
  url: process.env.P24_API_URL ?? "https://secure.przelewy24.pl",
  merchantId: Number(process.env.P24_MERCHANT_ID),
  posId: Number(process.env.P24_POS_ID),
  crc: process.env.P24_CRC ?? "",
  auth: { username: process.env.P24_POS_ID ?? "", password: process.env.P24_API_KEY ?? "" },
};
const mock = process.env.MOCK_PAYMENT === "true";

const sign = (fields: Record<string, unknown>) => createHash("sha384").update(JSON.stringify({ ...fields, crc: p24.crc }), "utf8").digest("hex");

/** Registers a Przelewy24 transaction and returns the payment page URL. `amount` is in grosze. */
export async function createPayment({ email, uid, id, rodzaj, amount, description }: { email: string; uid: string; id: number; rodzaj: IPaymentKind; amount: number; description: string }): Promise<string> {
  const returnUrl = `${SITE_URL}/payment-status?uid=${uid}&r=${rodzaj}&_x=${id}`;

  if (mock) {
    await recordPayment(rodzaj, id, uid, { sessionId: uid, orderId: Math.floor(Math.random() * 1000000), amount, currency: "PLN" });
    await markPaid(rodzaj, id, uid);
    return returnUrl;
  }

  const { data } = await axios.post(
    `${p24.url}/api/v1/transaction/register`,
    {
      merchantId: p24.merchantId,
      posId: p24.posId,
      sessionId: uid,
      amount,
      currency: "PLN",
      description,
      email,
      country: "PL",
      language: "pl",
      urlReturn: returnUrl,
      urlStatus: `${SITE_URL}/api/payment/status?id=${id}&r=${rodzaj}&uid=${uid}`,
      channel: 8199,
      transferLabel: `${rodzaj}:${id}`,
      encoding: "UTF-8",
      sign: sign({ sessionId: uid, merchantId: p24.merchantId, amount, currency: "PLN" }),
    },
    { auth: p24.auth },
  );
  return `${p24.url}/trnRequest/${data.data.token}`;
}

async function recordPayment(rodzaj: IPaymentKind, id: number, uid: string, body: unknown) {
  await execute(`INSERT INTO platnosci (json_platnosc, rodzaj, id_w_tabeli, uuid) VALUES (?, ?, ?, ?)`, [JSON.stringify(body), rodzaj, id, uid]);
}

async function markPaid(rodzaj: IPaymentKind, id: number, sessionId: string) {
  if (rodzaj === "T") {
    await execute(`UPDATE zapisy SET zaliczka='50.00', oplacony=1 WHERE id=? LIMIT 1`, [id]);
    await sendWorkshopConfirmationEmail(id);
    return;
  }

  await execute(`UPDATE voucher SET czy_platnosc=1, identyfikator_platnosci=?, status='AKTYWNY' WHERE id=? LIMIT 1`, [sessionId, id]);
  const [voucher] = await select<{ email: string; kod: string; nazwa: string | null; od: string; dla: string; rodzaj: string; kwota: number }>(
    `SELECT k.email, v.kod, w.nazwa, v.od, v.dla, v.rodzaj, v.kwota FROM voucher v LEFT JOIN klienci k ON v.klient=k.id LEFT JOIN warsztaty w ON v.warsztat=w.id WHERE v.id=? LIMIT 1`,
    [id],
  );
  if (voucher) {
    await sendVoucherMail({ email: voucher.email, kod: voucher.kod, od: voucher.od, dla: voucher.dla, warsztatNazwa: voucher.rodzaj === "KWOTA" ? `${num(voucher.kwota)} PLN` : voucher.nazwa ?? "" });
  }
}

/** What the purchase was for and whether it is paid; the purchase must match both id and its secret session uid. */
async function findPurchase(rodzaj: IPaymentKind, id: number, uid: string) {
  if (rodzaj === "T") {
    const [row] = await select<{ data: string; godzina: string; platnosc: number; nazwa: string; cena: number; paid: number }>(
      `SELECT z.data, z.godzina, z.zaliczka as platnosc, w.nazwa, w.cena, z.oplacony as paid FROM zapisy z LEFT JOIN warsztaty w ON z.warsztat=w.id WHERE z.id=? AND z.uuid=? LIMIT 1`,
      [id, uid],
    );
    return row && { ...row, isPaid: num(row.paid) > 0, expectedAmount: 5000 };
  }

  const [row] = await select<{ od: string; dla: string; kod: string; platnosc: number; nazwa: string | null; cena: number }>(
    `SELECT v.od, v.dla, v.kod, v.czy_platnosc as platnosc, w.nazwa, v.kwota as cena FROM voucher v LEFT JOIN warsztaty w ON v.warsztat=w.id WHERE v.id=? AND v.uuid=? LIMIT 1`,
    [id, uid],
  );
  return row && { ...row, isPaid: num(row.platnosc) === 1, expectedAmount: Math.round(num(row.cena) * 100) };
}

/** Data for the /payment-status page. The voucher code is only revealed once the payment is confirmed. */
export async function getPaymentDetails({ uid, id, rodzaj }: { uid: string; id: number; rodzaj: IPaymentKind }) {
  const purchase = await findPurchase(rodzaj, id, uid);
  if (!purchase) return undefined;

  if ("kod" in purchase) {
    const { od, dla, kod, platnosc, nazwa, cena, isPaid } = purchase;
    return { od, dla, kod: isPaid ? kod : "", platnosc, nazwa: nazwa || "VOUCHER KWOTOWY", cena };
  }
  const { data, godzina, platnosc, nazwa, cena } = purchase;
  return { data, godzina, platnosc, nazwa, cena };
}

/** Handles a Przelewy24 status notification: verifies the transaction with P24, then marks the purchase paid. */
export async function handlePaymentNotification({ uid, id, rodzaj }: { uid: string; id: number; rodzaj: IPaymentKind }, body: { sessionId?: string; orderId?: string | number; amount?: string | number }) {
  const purchase = await findPurchase(rodzaj, id, uid);
  const amount = Number(body.amount);
  const orderId = Number(body.orderId);

  if (!purchase || body.sessionId !== uid) throw new Error(`Notification does not match any purchase (${rodzaj}:${id}).`);
  if (amount !== purchase.expectedAmount) throw new Error(`Notification amount ${amount} differs from expected ${purchase.expectedAmount} (${rodzaj}:${id}).`);
  if (purchase.isPaid) return; // P24 can repeat notifications; the purchase is already settled.

  await axios.put(
    `${p24.url}/api/v1/transaction/verify`,
    { merchantId: p24.merchantId, posId: p24.posId, sessionId: uid, amount, currency: "PLN", orderId, sign: sign({ sessionId: uid, orderId, amount, currency: "PLN" }) },
    { auth: p24.auth },
  );

  await recordPayment(rodzaj, id, uid, body);
  await markPaid(rodzaj, id, uid);
}

/** Admin report: P24 payments and on-site settlements in a date range, oldest first. */
export async function getPaymentReport({ dataOd, dataDo, client }: { dataOd: string; dataDo: string; client?: string }) {
  const clientFilter = client ? ` AND (k.imie_nazwisko LIKE ? OR k.telefon LIKE ? OR k.email LIKE ?)` : "";
  const clientParams = client ? [`%${client}%`, `%${client}%`, `%${client}%`] : [];
  const clientColumns = `k.imie_nazwisko as imieNazwisko, k.email, k.telefon,
    k.kod_pocztowy as kodPocztowy, k.ulica, k.miasto, k.numer_domu as numerDomu, k.numer_mieszkania as numerMieszkania, k.id as klientId,
    w.nazwa as warsztatNazwa`;
  type ClientRow = { imieNazwisko: string; email: string; telefon: string; kodPocztowy: string; ulica: string; miasto: string; numerDomu: string; numerMieszkania: string; klientId: number; warsztatNazwa: string };
  const klientDane = (k: ClientRow) => ({ id: k.klientId, imieNazwisko: k.imieNazwisko, email: k.email, kodPocztowy: k.kodPocztowy, ulica: k.ulica, miasto: k.miasto, numerDomu: k.numerDomu, numerMieszkania: k.numerMieszkania, telefon: k.telefon });

  const raport: { klientDane: ReturnType<typeof klientDane>; warsztatNazwa: string; kwota: string; data: string; godzina: string; typPlatnosci: string }[] = [];

  const payments = await select<{ uuid: string; data: string; godzina: string; rodzaj: string; id_w_tabeli: number; json_platnosc: string }>(
    `SELECT DISTINCT(uuid) AS uuid, data2 as data, godzina, rodzaj, id_w_tabeli, json_platnosc FROM platnosci WHERE data2 BETWEEN ? AND ?`,
    [dataOd, dataDo],
  );
  for (const p of payments) {
    const table = p.rodzaj === "V" ? "voucher" : "zapisy";
    let details: { amount?: number; currency?: string } = {};
    try {
      details = JSON.parse(p.json_platnosc);
    } catch (error) {
      log("getPaymentReport", error, `Unreadable payment JSON for ${p.uuid}.`);
    }
    const [k] = await select<ClientRow>(
      `SELECT ${clientColumns} FROM ${table} t LEFT JOIN klienci k ON t.klient=k.id LEFT JOIN warsztaty w ON t.warsztat=w.id WHERE t.id=?${clientFilter}`,
      [p.id_w_tabeli, ...clientParams],
    );
    if (k) raport.push({ klientDane: klientDane(k), warsztatNazwa: k.warsztatNazwa, kwota: `${num(details.amount) / 100} ${details.currency ?? "PLN"}`, data: p.data, godzina: p.godzina, typPlatnosci: "P24" });
  }

  const settlements = await select<{ data: string; godzina: string; id_w_tabeli: number; kwota: number }>(`SELECT data, godzina, id_w_tabeli, kwota FROM doplaty WHERE data BETWEEN ? AND ?`, [dataOd, dataDo]);
  for (const d of settlements) {
    const [k] = await select<ClientRow>(
      `SELECT ${clientColumns} FROM doplaty t LEFT JOIN zapisy z ON t.id_w_tabeli=z.id LEFT JOIN klienci k ON z.klient=k.id LEFT JOIN warsztaty w ON z.warsztat=w.id WHERE t.id_w_tabeli=?${clientFilter}`,
      [d.id_w_tabeli, ...clientParams],
    );
    if (k) raport.push({ klientDane: klientDane(k), warsztatNazwa: k.warsztatNazwa, kwota: `${d.kwota} PLN`, data: d.data, godzina: d.godzina, typPlatnosci: "dopłata" });
  }

  return raport.sort((a, b) => new Date(`${a.data}T${a.godzina}`).getTime() - new Date(`${b.data}T${b.godzina}`).getTime());
}

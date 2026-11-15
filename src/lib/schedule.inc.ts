import "server-only";

import dayjs from "dayjs";
import "dayjs/locale/pl";
import { IBreak, IDaySchedule, IGrafikDay, IGrafikSlot, ISlotBooking, IWorkingHours, WEEKDAYS } from "@/types/ISchedule";
import { computeAmountToPay } from "@/utils/payment";
import { execute, num, select } from "./db.inc";

const shortDayPL = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

/* ───────────── time helpers (minutes since midnight) ───────────── */
const toMin = (time: string | null | undefined): number => {
  if (!time) return NaN;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};
const fmt = (min: number): string => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}:00`;

/** Monday = 0 … Sunday = 6, like MySQL WEEKDAY(). */
export const weekday = (date: string): number => (dayjs(date).day() + 6) % 7;

const dayLabel = (date: dayjs.Dayjs) => ({ skrocony: shortDayPL[(date.day() + 6) % 7], data: date.locale("pl").format("DD MMM") });

/** Hourly start times between opening and closing; a break skips to its end (marked "-" when insertDash). */
function generateAvailableSlots(workStart: string | null, workEnd: string | null, breaks: IBreak[], insertDash = true): string[] {
  const slots: string[] = [];
  let current = toMin(workStart);
  const end = toMin(workEnd);
  const sortedBreaks = [...breaks].sort((a, b) => toMin(a.start) - toMin(b.start));

  while (current + 60 <= end) {
    let blocked = false;
    const next = current + 60;

    for (const item of sortedBreaks) {
      const breakStart = toMin(item.start);
      const breakEnd = toMin(item.end);
      if (breakStart < next && breakEnd > current) {
        blocked = true;
        if (insertDash) slots.push("-");
        current = breakEnd;
        break;
      }
    }

    if (!blocked) {
      if (current + 60 <= end) slots.push(fmt(current));
      current += 60;
    }
  }

  return slots;
}

async function loadWorkingHours() {
  const rows = await select<{ dzien: number; godzina_od: string | null; godzina_do: string | null }>(`SELECT * FROM godziny_pracy WHERE 1`);
  const breaks = await select<{ dzien: number; godzina_od: string; godzina_do: string }>(`SELECT * FROM przerwy ORDER BY dzien, godzina_od`);

  const hours: Record<number, { godzina_od: string | null; godzina_do: string | null }> = {};
  rows.forEach((row) => (hours[row.dzien] = { godzina_od: row.godzina_od, godzina_do: row.godzina_do }));

  const breaksByDay: Record<number, IBreak[]> = {};
  breaks.forEach((item) => (breaksByDay[item.dzien] ??= []).push({ start: item.godzina_od, end: item.godzina_do }));

  return { rows, hours, breaksByDay };
}

/** Breaks that no existing booking overlaps; a booking made before a break was added keeps its hours. */
const breaksFreeOf = (breaks: IBreak[], occupied: Set<string>) =>
  breaks.filter((item) => ![...occupied].some((slot) => toMin(slot) >= toMin(item.start) && toMin(slot) < toMin(item.end)));

function occupiedSlots(bookings: { godzina: string; sloty: number }[]) {
  const occupied = new Set<string>();
  bookings.forEach((booking) => {
    for (let j = 0; j < num(booking.sloty); j++) occupied.add(fmt(toMin(booking.godzina) + j * 60));
  });
  return occupied;
}

/* ───────────── public calendar (booking dialog) ───────────── */
export class WorkshopNotFoundError extends Error {}

export async function getGrafik({ dataOd, ileDni, zapisId, warsztatTyp }: { dataOd: string; ileDni: number; zapisId?: number; warsztatTyp?: number }): Promise<IGrafikDay[]> {
  const { hours, breaksByDay } = await loadWorkingHours();
  const today = dayjs().startOf("day");

  let warsztat: { id: number; max_osob: number } | undefined;
  if (warsztatTyp) {
    [warsztat] = await select<{ id: number; max_osob: number }>(`SELECT w.* FROM warsztaty w WHERE id=?`, [warsztatTyp]);
    if (!warsztat) throw new WorkshopNotFoundError("Warsztat nie znaleziony");
  }

  const result: IGrafikDay[] = [];
  const uniqueWorkshops: Record<string, boolean> = {};

  for (let i = 0; i < ileDni; i++) {
    const date = dayjs(dataOd).add(i, "day");
    const dateYMD = date.format("YYYY-MM-DD");
    const day = (date.day() + 6) % 7;
    const workingHours = hours[day];
    let sloty: IGrafikSlot[] = [];

    if (!date.isBefore(today) && workingHours) {
      const dayBookings = await select<{ id: number; godzina: string; sloty: number; warsztat: number; ile_osob: number }>(
        `SELECT z.id, z.godzina, w.sloty, z.warsztat, z.ile_osob
         FROM zapisy z
         LEFT JOIN warsztaty w ON z.warsztat = w.id
         WHERE z.status = 'AKTYWNY' AND z.data = ? ${zapisId ? "AND z.id != ?" : ""}
         ORDER BY z.id`,
        zapisId ? [dateYMD, zapisId] : [dateYMD],
      );

      const filteredBreaks = breaksFreeOf(breaksByDay[day] ?? [], occupiedSlots(dayBookings));
      sloty = generateAvailableSlots(workingHours.godzina_od, workingHours.godzina_do, filteredBreaks).map((symbol) => ({ symbol }));

      for (let s = 0; s < sloty.length; s++) {
        const godz = sloty[s].symbol;
        if (godz === "-") continue;

        // Bookings running during this hour (same rule as the old per-slot SQL check).
        const taken = dayBookings.filter((b) => toMin(godz) >= toMin(b.godzina) && toMin(godz) < toMin(b.godzina) + num(b.sloty) * 60);

        if (warsztat) {
          if (taken.length > 0) {
            if (warsztat.id === taken[0].warsztat) {
              const liczba_zapisanych = taken.reduce((acc, curr) => acc + num(curr.ile_osob), 0);
              const id = taken.map((z) => z.id).join("");
              sloty[s] = liczba_zapisanych < warsztat.max_osob ? { symbol: godz, liczba_zapisanych, max_osob: warsztat.max_osob, readonly: id in uniqueWorkshops } : { symbol: "-" };
              uniqueWorkshops[id] = true;
            } else {
              sloty[s] = { symbol: "-" };
            }
          } else {
            sloty[s] = { symbol: godz, liczba_zapisanych: 0, max_osob: warsztat.max_osob };
          }
        } else {
          sloty[s] = taken.length > 0 ? { symbol: "-" } : { symbol: godz };
        }
      }
    }

    result.push({ data: dateYMD, godziny: sloty, dzien: dayLabel(date) });
  }

  return result;
}

/* ───────────── admin: one day with its bookings ───────────── */
export async function getDaySchedule(data: string): Promise<IDaySchedule[]> {
  const { hours, breaksByDay } = await loadWorkingHours();
  const date = dayjs(data);
  const dateYMD = date.format("YYYY-MM-DD");
  const day = (date.day() + 6) % 7;
  const workingHours = hours[day] ?? { godzina_od: null, godzina_do: null };
  const dayBreaks = breaksByDay[day] ?? [];

  const allWorkshops = await select<{
    id: number; data: string; godzina: string; zrodlo_zapisu: string; ile_osob: number; oplacony: number; zaliczka: number; uwagi: string;
    imieNazwisko: string; email: string; telefon: string; kod_pocztowy: string; ulica: string; miasto: string; numer_domu: string; numer_mieszkania: string;
    warsztatNazwa: string; warsztatId: number; sloty: number; max_osob: number; klientId: number; doplata: number;
  }>(
    `SELECT
        z.id, z.data, z.godzina, z.zrodlo_zapisu, z.ile_osob, z.oplacony, z.zaliczka, z.uwagi,
        k.imie_nazwisko as imieNazwisko, k.email, k.telefon,
        k.kod_pocztowy, k.ulica, k.miasto, k.numer_domu, k.numer_mieszkania,
        w.nazwa as warsztatNazwa, w.id as warsztatId, w.sloty as sloty, w.max_osob,
        k.id as klientId,
        (w.cena-z.zaliczka-z.kwota_vouchera) as doplata
      FROM zapisy z
      LEFT JOIN klienci k ON z.klient=k.id
      LEFT JOIN warsztaty w ON z.warsztat=w.id
      WHERE z.status='AKTYWNY' AND z.data=?`,
    [dateYMD],
  );

  const filteredBreaks = breaksFreeOf(dayBreaks, occupiedSlots(allWorkshops));

  const sloty: Record<string, string | { zajete: ISlotBooking[] }> = {};
  generateAvailableSlots(workingHours.godzina_od, workingHours.godzina_do, filteredBreaks, false).forEach((slot) => (sloty[slot] = "wolne"));
  filteredBreaks.forEach((item) => (sloty[fmt(toMin(item.start))] = "przerwa"));

  // Group bookings by hour and workshop type.
  const groups: Record<string, { slotTime: string; maxOsob: number; workshops: typeof allWorkshops; totalPersons: number }> = {};
  allWorkshops.forEach((workshop) => {
    for (let i = 0; i < num(workshop.sloty); i++) {
      const slotTime = fmt(toMin(workshop.godzina) + i * 60);
      const key = `${slotTime}_${workshop.warsztatId}`;
      groups[key] ??= { slotTime, maxOsob: workshop.max_osob, workshops: [], totalPersons: 0 };
      groups[key].workshops.push(workshop);
      groups[key].totalPersons += num(workshop.ile_osob);
    }
  });

  Object.values(groups).forEach(({ slotTime, workshops, totalPersons, maxOsob }) => {
    const isInBreak = dayBreaks.some((item) => toMin(slotTime) >= toMin(item.start) && toMin(slotTime) < toMin(item.end));
    sloty[slotTime] = {
      zajete: workshops.map((workshop) => ({
        id: workshop.id,
        zrodloZapisu: workshop.zrodlo_zapisu,
        ileOsob: workshop.ile_osob,
        data: workshop.data,
        godzina: workshop.godzina,
        oplacony: workshop.oplacony,
        zaliczka: workshop.zaliczka,
        doplata: workshop.doplata,
        uwagi: workshop.uwagi,
        maxOsob: workshop.max_osob,
        availableSpots: maxOsob - totalPersons,
        warsztat: { id: workshop.warsztatId, nazwa: workshop.warsztatNazwa, sloty: workshop.sloty },
        klient: {
          id: workshop.klientId,
          imieNazwisko: workshop.imieNazwisko,
          email: workshop.email,
          kodPocztowy: workshop.kod_pocztowy,
          ulica: workshop.ulica,
          miasto: workshop.miasto,
          numerDomu: workshop.numer_domu,
          numerMieszkania: workshop.numer_mieszkania,
          telefon: workshop.telefon,
        },
        conflictWithBreak: isInBreak,
      })),
    };
  });

  // Inside a booking only its own consecutive hours stay; free/break slots that overlap it are dropped.
  const ranges = allWorkshops.map((w) => ({ start: toMin(w.godzina), end: toMin(w.godzina) + num(w.sloty) * 60 }));
  const sorted: Record<string, string | { zajete: ISlotBooking[] }> = {};
  Object.keys(sloty)
    .sort((a, b) => toMin(a) - toMin(b))
    .forEach((key) => {
      const current = toMin(key);
      const range = ranges.find((r) => current >= r.start && current < r.end);
      if (range && (typeof sloty[key] === "string" || (current - range.start) % 60 !== 0)) return;
      sorted[key] = sloty[key];
    });

  return [{ data: dateYMD, godziny: sorted, dzien: dayLabel(date) }];
}

/* ───────────── admin: working hours ───────────── */
export async function getWorkingHours(): Promise<IWorkingHours[]> {
  const { rows, breaksByDay } = await loadWorkingHours();
  return rows.map((day) => ({ ...day, breaks: breaksByDay[day.dzien] ?? [] }));
}

/** Validates and saves one weekday's hours; returns an error message for the admin, or undefined on success. */
export async function saveWorkingHours({ day, start, end, breaks = [] }: { day: string; start: string; end: string; breaks?: IBreak[] }): Promise<string | undefined> {
  const intDay = WEEKDAYS.indexOf(day as (typeof WEEKDAYS)[number]);
  if (intDay < 0) return "Nieprawidłowy dzień tygodnia.";

  if (breaks.length > 0) {
    const sorted = [...breaks].sort((a, b) => toMin(a.start) - toMin(b.start));

    for (const item of sorted) {
      if (!item.start || !item.end) return "Wszystkie przerwy muszą mieć ustawione godziny rozpoczęcia i zakończenia.";
      if (toMin(item.end) <= toMin(item.start)) return "Godzina zakończenia przerwy musi być późniejsza niż godzina rozpoczęcia.";
    }

    const workStart = toMin(start);
    const workEnd = toMin(end);
    if (toMin(sorted[0].start) - workStart < 60) return "Pierwsza przerwa musi być co najmniej godzinę po rozpoczęciu pracy.";
    if (workEnd - toMin(sorted[sorted.length - 1].end) < 60) return "Ostatnia przerwa musi zakończyć się co najmniej godzinę przed końcem pracy.";

    for (let i = 0; i < sorted.length; i++) {
      const currentStart = toMin(sorted[i].start);
      const currentEnd = toMin(sorted[i].end);
      if (currentStart < workStart || currentEnd > workEnd) return "Wszystkie przerwy muszą być w godzinach pracy.";

      if (i < sorted.length - 1) {
        const nextStart = toMin(sorted[i + 1].start);
        if (currentEnd > nextStart) return "Przerwy nie mogą się nakładać.";
        if (nextStart - currentEnd < 60) return "Między przerwami musi być co najmniej godzina różnicy.";
      }
    }
  }

  await execute(`UPDATE godziny_pracy SET godzina_od=?, godzina_do=? WHERE dzien=?`, [start, end, intDay]);
  await execute(`DELETE FROM przerwy WHERE dzien=?`, [intDay]);
  for (const item of breaks) {
    await execute(`INSERT INTO przerwy (dzien, godzina_od, godzina_do) VALUES (?, ?, ?)`, [intDay, item.start, item.end]);
  }
  return undefined;
}

/* ───────────── public: booking status by uuid ───────────── */
export async function getBookingByUuid(uuid: string) {
  const [zapis] = await select<{
    ile_osob: number; data: string; godzina: string; uuid: string; zrodlo_zapisu: string; voucher_id: number; warsztatNazwa: string; czas: number;
    voucher_kod: string; cena: number; zaliczka: number; kwota_vouchera: number; status_platnosci: number; status: string;
  }>(
    `SELECT
        z.ile_osob, z.data, z.godzina, z.uuid, z.zrodlo_zapisu, z.voucher_id,
        w.nazwa as warsztatNazwa, w.czas, v.kod as voucher_kod,
        z.cena, z.zaliczka, z.kwota_vouchera, z.oplacony as status_platnosci, z.status as status
      FROM zapisy z
      LEFT JOIN warsztaty w ON z.warsztat = w.id
      LEFT JOIN voucher v ON z.voucher_id = v.id
      WHERE z.uuid = ?`,
    [uuid],
  );
  if (!zapis) return undefined;

  return {
    data: zapis.data,
    godzina: zapis.godzina,
    ileOsob: zapis.ile_osob,
    uuid: zapis.uuid,
    zrodloZapisu: zapis.zrodlo_zapisu,
    voucherId: zapis.voucher_id,
    voucherKod: zapis.voucher_kod,
    status: zapis.status,
    doplata:
      computeAmountToPay({
        workshopPrice: num(zapis.cena),
        prepaidAmount: num(zapis.zaliczka),
        voucherAmount: num(zapis.kwota_vouchera),
        status: num(zapis.status_platnosci),
      }) ?? 0,
    warsztat: { nazwa: zapis.warsztatNazwa, czas: zapis.czas },
  };
}

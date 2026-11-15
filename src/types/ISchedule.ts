export const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export interface IBreak {
  start: string;
  end: string;
}

export interface IDayLabel {
  skrocony: string;
  data: string;
}

/** One hour in the public booking calendar; symbol "-" means not bookable. */
export interface IGrafikSlot {
  symbol: string;
  liczba_zapisanych?: number;
  max_osob?: number;
  readonly?: boolean;
}

export interface IGrafikDay {
  data: string;
  godziny: IGrafikSlot[];
  dzien: IDayLabel;
}

export interface IClient {
  id: number;
  imieNazwisko: string;
  email: string;
  kodPocztowy?: string;
  ulica?: string;
  miasto?: string;
  numerDomu?: string;
  numerMieszkania?: string;
  telefon: string;
}

/** A booking shown in the admin day schedule. */
export interface ISlotBooking {
  id: number;
  zrodloZapisu: string;
  ileOsob: number;
  data: string;
  godzina: string;
  oplacony: number;
  zaliczka: number;
  doplata: number;
  uwagi: string;
  maxOsob: number;
  availableSpots: number;
  warsztat: { id: number; nazwa: string; sloty: number };
  klient: IClient;
  conflictWithBreak: boolean;
}

export interface IDaySchedule {
  data: string;
  /** Hour → "wolne" (free), "przerwa" (break) or the bookings in that hour. */
  godziny: Record<string, string | { zajete: ISlotBooking[] }>;
  dzien: IDayLabel;
}

export interface IWorkingHours {
  dzien: number;
  godzina_od: string | null;
  godzina_do: string | null;
  breaks: IBreak[];
}

export interface IBookingStatus {
  data: string;
  godzina: string;
  ileOsob: number;
  uuid: string;
  zrodloZapisu: string;
  voucherId: number;
  voucherKod: string;
  status: string;
  doplata: number;
  warsztat: { nazwa: string; czas: number };
}

import { IClient } from "./ISchedule";

export type IVoucherKind = "WARSZTAT" | "KWOTA";

export interface IVoucherRequest {
  imieNazwisko: string;
  warsztatTyp?: number;
  kwota?: number;
  od: string;
  dla: string;
  telefon: string;
  email: string;
  ulica?: string;
  numerDomu?: string;
  numerMieszkania?: string;
  kodPocztowy?: string;
  miasto?: string;
  komentarz?: string;
}

/** Voucher as listed in the admin panel. */
export interface IVoucher {
  id: number;
  od: string;
  dla: string;
  czyPlatnosc: number;
  identyfikatorPlatnosci: string | null;
  status: string;
  rodzaj: IVoucherKind;
  dataZakupu: string;
  uwagi: string;
  kod: string;
  warsztatNazwa: string | null;
  warsztatId: number | null;
  kwota: number;
  kwotaWykorzystana: number;
  klient: IClient;
}

export interface IVoucherCodeInfo {
  warsztatTyp: number | null;
  rodzaj: IVoucherKind;
  kwota: number;
}

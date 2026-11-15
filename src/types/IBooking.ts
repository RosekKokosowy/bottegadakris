export interface IBookingRequest {
  imieNazwisko: string;
  warsztatTyp: number;
  liczbaOsob: number;
  telefon: string;
  email: string;
  komentarz?: string;
  voucher?: boolean;
  voucherKod?: string;
  data: string;
  godzina: string;
  zrodloZapisu?: string;
}

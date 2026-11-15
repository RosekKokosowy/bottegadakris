/** /api/payment/details — a voucher purchase (od/dla/kod) or a booking deposit (data/godzina). */
export interface IPaymentDetails {
  platnosc: number;
  nazwa: string;
  cena: number;
  od?: string;
  dla?: string;
  kod?: string;
  data?: string;
  godzina?: string;
}

/**
 * Booking payment status (`zapisy.oplacony`):
 * 0 unpaid, 1 deposit paid, 2 paid with a workshop voucher, 3 settled on site, 4 partly paid with an amount voucher.
 */
export const computeAmountToPay = ({
  status,
  workshopPrice,
  prepaidAmount,
  voucherAmount,
}: {
  status: number;
  workshopPrice: number;
  prepaidAmount?: number;
  voucherAmount?: number;
}): number | undefined => {
  if (status === 0) return workshopPrice;
  if (status === 1) return workshopPrice - (prepaidAmount ?? 0);
  if (status === 2 || status === 3) return 0;
  if (status === 4) return workshopPrice - (voucherAmount ?? 0);
  return undefined;
};

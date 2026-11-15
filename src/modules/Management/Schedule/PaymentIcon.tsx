'use client';

import { DollarOutlined } from "@ant-design/icons";

const labels: Record<number, string> = {
  1: "Wpłacona zaliczka",
  2: "Opłacono voucherem",
  3: "Przyjęto dopłatę",
  4: "Częściowo opłacono voucherem kwotowym",
};

const color = (oplacony: number) => (oplacony === 1 || oplacony === 4 ? "orange" : oplacony === 2 ? "blue" : oplacony === 3 ? "green" : "red");

/** Payment status of a booking (`zapisy.oplacony`); clickable while something is still to be paid. */
export function PaymentIcon({ oplacony, prefix, size = 20, onClick }: { oplacony: number; prefix?: string; size?: number; onClick?: () => void }) {
  const label = labels[oplacony] ?? "Brak płatności";
  return (
    <DollarOutlined
      onClick={onClick}
      style={{ color: color(oplacony), cursor: onClick ? "pointer" : "default", fontSize: `${size}px` }}
      title={prefix ? `${prefix}: ${label}` : label}
    />
  );
}

/** Still unpaid, deposit paid, or partly paid with a voucher — the rest can be taken on site. */
export const canTakePayment = (oplacony: number) => oplacony === 0 || oplacony === 1 || oplacony === 4;

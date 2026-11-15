import "server-only";

import { ICustomer } from "@/types/ICustomer";
import { select } from "./db.inc";

export async function getCustomers(search?: string): Promise<ICustomer[]> {
  const params: unknown[] = [];
  let sql = `
    SELECT
      id, imie_nazwisko as imieNazwisko, imie, nazwisko, telefon, email, status,
      kod_pocztowy as kodPocztowy, ulica, miasto, numer_domu as numerDomu, numer_mieszkania as numerMieszkania
    FROM klienci
    WHERE status = 'AKTYWNY'`;

  if (search) {
    sql += ` AND (imie_nazwisko LIKE ? OR telefon LIKE ? OR email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  return select<ICustomer>(`${sql} ORDER BY imie_nazwisko ASC`, params);
}

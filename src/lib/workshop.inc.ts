import "server-only";

import { unstable_cache } from "next/cache";
import { IWorkshop } from "@/types/IWorkshop";
import { num, select } from "./db.inc";

export const WORKSHOPS_TAG = "workshops";

/** Active workshops with prices. Cached; admin price changes revalidate WORKSHOPS_TAG. */
export const getWorkshops = unstable_cache(
  async (): Promise<IWorkshop[]> => {
    const rows = await select<IWorkshop>(`SELECT * FROM warsztaty WHERE status='AKTYWNY'`);
    return rows.map((row) => ({ ...row, cena: num(row.cena) }));
  },
  [WORKSHOPS_TAG],
  { tags: [WORKSHOPS_TAG], revalidate: 3600 },
);

export async function getWorkshopById(id: number): Promise<IWorkshop | undefined> {
  return (await getWorkshops()).find((workshop) => workshop.id === id);
}

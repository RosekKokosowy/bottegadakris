import { IClient } from "./ISchedule";

export interface ICustomer extends IClient {
  imie: string | null;
  nazwisko: string | null;
  status: "AKTYWNY" | "NIEAKTYWNY";
}

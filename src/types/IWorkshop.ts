/** Row of `warsztaty`. */
export interface IWorkshop {
  id: number;
  nazwa: string;
  max_osob: number;
  sloty: number;
  cena: number;
  czas: number;
  status?: string;
}

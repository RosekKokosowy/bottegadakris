import { Statut1 } from "./Statut1";
import { Statut2 } from "./Statut2";
import { Statut3 } from "./Statut3";

export function Statutes() {
  return (
    <div className="px-2 md:px-36 md:mx-36">
      <p className="text-3xl">Regulaminy - Bottega da Kris</p>

      <Statut1 />
      <Statut2 />
      <Statut3 />
    </div>
  );
}

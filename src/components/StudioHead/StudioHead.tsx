import Image from "next/image";
import Link from "next/link";
import studio1 from "@/assets/studio1.png";
import studio2 from "@/assets/studio2.png";
import { Address } from "@/components/Graphics/Address";
import { CONTACT } from "@/utils/navigation";

export function StudioHead() {
  return (
    <div className="pb-12 md:pb-6">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col md:flex-row w-full md:w-3/4 max-h-auto">
          <div className="w-full md:w-1/3">
            <Image src={studio1} alt="Pracownia Bottega da Kris" sizes="(min-width: 768px) 25vw, 100vw" />
          </div>

          <div className="flex flex-col w-full md:w-2/3 pt-6 px-6 md:px-24 text-xl">
            <h2 className="font-poppins text-xl md:text-3xl text-bottega-dark-brown ">MIEJSCE GDZIE DZIEJE SIĘ MAGIA</h2>
            <p className="font-poppins pt-6 text-base md:text-xl text-bottega-dark-brown ">
              Pracownia ceramiczna Bottega da Kris mieści się w centrum Łodzi. Jest to miejsce stworzone z myślą o osobach, które tak jak ja, pragną rozwijać swoje umiejętności artystyczne w spokojnej i twórczej atmosferze. Jeżeli chciałbyś rozpocząć swoją przygodę z ceramiką zachęcam do wspólnych warsztatów. Jeśli nie jest to twoja pierwsza styczność z pracami ceramicznymi i szukasz miejsca, w którym będziesz mógł/a szlifować swoje umiejętności samodzielnie, pracownia zapewni wszystkie podstawowe narzędzia (glina, koło, szkliwa), niezbędne do dalszego rozwoju. W pracowni istnieje także możliwość wypalania własnych wyrobów lub wynajęcia całego pieca.
            </p>

            <div className="flex flex-col md:flex-row justify-between items-center w-full pt-6">
              <Link
                href="/kontakt"
                className="border-bottega-dark-brown hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out"
              >
                Kontakt
              </Link>

              <div className="flex items-center font-poppins text-bottega-dark-brown">
                <div className="flex">
                  <Address color="#AC8976" />
                  <p className="ml-2 text-base md:text-xl text-right">{CONTACT.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/4 mt-20">
          <Image src={studio2} alt="Pracownia Bottega da Kris" sizes="(min-width: 768px) 25vw, 100vw" />
        </div>
      </div>
    </div>
  );
}

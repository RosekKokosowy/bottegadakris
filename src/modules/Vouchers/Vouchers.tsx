import Image from "next/image";
import voucher from "@/assets/voucher/voucher.png";
import { Animation } from "@/components/Animation/Animation";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { BuyVoucherButton } from "./BuyVoucherButton";

export default function Vouchers() {
  return (
    <>
      <PageHeader title="VOUCHERY" />
      <div className="py-12 md:py-24 px-6 md:px-24">
        <Animation>
          <div className="flex flex-col md:flex-row w-full">
            <div className="w-full md:w-3/5 md:px-6">
              <Image src={voucher} alt="Voucher na warsztaty ceramiczne" sizes="(min-width: 768px) 60vw, 100vw" />
            </div>
            <div className="flex flex-col w-full md:w-2/5 px-3">
              <div className="flex flex-col w-full pt-12 md:pt-0 md:px-6 text-center md:text-left">
                <h2 className="font-poppins text-bottega-dark-brown text-2xl md:text-2xl font-medium md:text-left mb-[1em]">PODARUJ WYJĄTKOWY PREZENT</h2>
                <p className="font-poppins font-normal text-bottega-dark-brown text-sm md:text-lg font-light mt-5 md:text-left">
                  Oferujemy vouchery na wyjątkowe warsztaty ceramiczne w Bottega da Kris. Jest to doskonały prezent dla każdego, kto jest pasjonatem sztuki lub chciałby odkryć świat ceramiki. Vouchery obejmują zajęcia, podczas których uczestnicy poznają techniki tworzenia unikalnych wyrobów. To idealna okazja, aby obdarować bliską osobę kreatywnym doświadczeniem i inspiracją, niezależnie od poziomu zaawansowania. Vouchery są ważne przez rok, co pozwala na pełną elastyczność w wyborze dogodnego terminu na warsztaty.
                </p>
                <div className="pt-5 md:text-left">
                  <BuyVoucherButton />
                </div>
              </div>
            </div>
          </div>
        </Animation>
      </div>
    </>
  );
}

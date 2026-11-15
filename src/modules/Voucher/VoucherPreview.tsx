import Image from "next/image";
import voucherBackground from "@/assets/voucher/voucher_background.png";
import { Logo } from "@/components/Graphics/Logo";

/** Live preview of the gift voucher while the buyer fills the form. */
export function VoucherPreview({ od, dla, warsztatNazwa }: { od: string; dla: string; warsztatNazwa: string }) {
  return (
    <div className="relative w-full">
      <Image src={voucherBackground} alt="" className="w-full" sizes="50vw" />
      <div className="flex flex-col w-full h-full absolute p-7 top-0 items-center justify-center align-middle text-white">
        <div className="w-full h-full bg-black/25 p-12">
          <div className="w-full h-full absolute top-2 left-10">
            <Logo color="#ffffff" size="70" />
          </div>
          <div className="w-full items-center  justify-center text-center -mt-5 text-xl font-poppins">VOUCHER</div>
          <div className="w-full items-center  justify-center text-center font-thin mt-2 font-poppins italic">Na warsztaty ceramiczne w Bottega da Kris</div>

          <div className="w-full items-center  justify-center text-center text-lg font-thin mt-4 font-poppins">
            {warsztatNazwa}
            <hr className="w-6/12 ml-[25%]" />
          </div>

          <div className="w-full items-center  justify-center text-left text-lg font-thin mt-4 font-poppins">
            od:
            <span className="ml-[4.5rem]">{od}</span>
            <hr className="w-8/12 ml-24" />
          </div>
          <div className="w-full items-center  justify-center text-left text-lg font-thin mt-4 font-poppins">
            dla: <span className="ml-16">{dla}</span>
            <hr className="w-8/12 ml-24" />
          </div>

          <div className="w-full items-center  justify-center text-left text-xs font-thin mt-8 font-poppins italic">Umów termin na stronie bottegadakris.pl</div>
        </div>
      </div>
    </div>
  );
}

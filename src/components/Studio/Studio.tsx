import { StaticImageData } from "next/image";
import Link from "next/link";
import { CONTACT } from "@/utils/navigation";

const button = "border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out";

export function Studio({ img, title, content }: { img: StaticImageData; title: string; content: string }) {
  return (
    <div className="flex flex-row md:flex-col transform">
      <div className="relative w-full h-[850px]">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img.src})` }} />

        <div className="absolute top-0 left-0  h-full flex flex-col bg-bottega-dark-brown/45 px-6 md:px-36 py-6 md:py-24">
          <div className="w-full md:w-1/2">
            <p className="font-poppins text-white text-3xl mb-12">{title}</p>
            <p className="font-poppins text-white text-lg md:text-xl">{content}</p>
          </div>

          <div className="flex flex-row">
            <Link href="/pracownia" className={`bg-bottega-brown md:bg-transparent hover:bg-bottega-brown text-white hover:border-bottega-brown ${button}`}>
              Dowiedz się więcej
            </Link>
            <Link href="/kontakt" className={`border-0 bg-bottega-dark-brown hover:bg-bottega-brown text-white ml-5 ${button}`}>
              Kontakt
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full opacity-90">
          <p className="font-poppins text-right text-white text-base pr-8">{CONTACT.address}</p>
        </div>
      </div>
    </div>
  );
}

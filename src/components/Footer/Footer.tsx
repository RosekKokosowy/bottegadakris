import { Address } from "@/components/Graphics/Address";
import { Facebook } from "@/components/Graphics/Facebook";
import { Instagram } from "@/components/Graphics/Instagram";
import { Logo } from "@/components/Graphics/Logo";
import { Mail } from "@/components/Graphics/Mail";
import { Phone } from "@/components/Graphics/Phone";
import { CONTACT } from "@/utils/navigation";

export function Footer() {
  return (
    <footer>
      <div className="flex flex-col md:flex-row w-full bg-bottega-beige p-12">
        <div className="flex flex-col w-full md:w-1/2 items-start justify-start pb-6">
          <div>
            <Logo color="#000000" />
          </div>

          <div className="flex flex-row items-center mt-12">
            <a href={CONTACT.facebook} aria-label="Facebook" className="pr-3 cursor-pointer transform transition-transform ease-in-out hover:translate-y-0.5">
              <Facebook color="#AC8976" size="26" />
            </a>
            <a href={CONTACT.instagram} aria-label="Instagram" className="cursor-pointer transform transition-transform ease-in-out hover:translate-y-0.5">
              <Instagram color="#AC8976" size="26" />
            </a>
          </div>
        </div>

        <div className="flex w-full md:w-1/4 flex-col gap-4 items-start justify-start "></div>
        <div className="flex w-full md:w-1/4 flex-col gap-4 items-start justify-start">
          <div className="flex flex-row items-center font-poppins text-xs md:text-sm text-center gap-2">
            <Phone color="#AC8976" />
            {CONTACT.phone}
          </div>
          <div className="flex flex-row items-center font-poppins text-xs md:text-sm text-center gap-2">
            <Mail color="#AC8976" />
            {CONTACT.email}
          </div>
          <div className="flex flex-row items-center font-poppins text-xs md:text-sm text-center gap-2 pl-1">
            <Address color="#AC8976" />
            {CONTACT.address}
          </div>
        </div>
      </div>
    </footer>
  );
}

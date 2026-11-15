import { Animation } from "@/components/Animation/Animation";
import { Address } from "@/components/Graphics/Address";
import { Facebook } from "@/components/Graphics/Facebook";
import { Instagram } from "@/components/Graphics/Instagram";
import { Mail } from "@/components/Graphics/Mail";
import { Phone } from "@/components/Graphics/Phone";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { CONTACT } from "@/utils/navigation";
import { ContactForm } from "./ContactForm";
import { Statutes } from "./Statutes/Statutes";

export default function Contact() {
  return (
    <>
      <PageHeader title="KONTAKT" />
      <Animation>
        <div className="flex flex-col md:flex-row justify-center pt-12 md:pt-32 text-bottega-dark-brown">
          <div className="flex w-full md:w-1/3 p-6">
            <div className="flex flex-col text-left gap-6">
              <div className="flex flex-row font-poppins font-semibold text-left">
                ODEZWIJ SIĘ DO MNIE, JEŚLI JESTEŚ
                <br />
                ZAINTERESOWANY OFERTĄ
                <br />
              </div>
              <div className="flex flex-row font-poppins font-normal text-left">Bottega da Kris</div>
              <div className="flex flex-row font-poppins font-light text-left">
                <div className="pr-4">
                  <Phone color="#AC8976" size="24" />
                </div>
                {CONTACT.phone}
              </div>
              <div className="flex flex-row font-poppins font-light text-left">
                <div className="pr-4">
                  <Mail color="#AC8976" />
                </div>
                {CONTACT.email}
              </div>
              <div className="flex flex-row font-poppins font-light text-left">
                <div className="pr-4">
                  <Address color="#AC8976" />
                </div>
                {CONTACT.address}
              </div>
              <div className="flex flex-row font-poppins border-t-bottega-brown border-t-[1px]">
                <div className="mt-6 flex flex-row">
                  <a href={CONTACT.facebook} aria-label="Facebook" className="pr-3 cursor-pointer transform transition-transform ease-in-out hover:translate-y-0.5">
                    <Facebook color="#AC8976" size="26" />
                  </a>
                  <a href={CONTACT.instagram} aria-label="Instagram" className="cursor-pointer transform transition-transform ease-in-out hover:translate-y-0.5">
                    <Instagram color="#AC8976" size="26" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex font-poppins w-full md:w-1/3 p-6 pt-12 md:pt-0">
            <div className="font-poppins w-full  bg-bottega-beige">
              <ContactForm />
            </div>
          </div>
        </div>
      </Animation>

      <Statutes />
    </>
  );
}

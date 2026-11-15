import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Animation } from "@/components/Animation/Animation";
import { ScheduleButton } from "@/components/ScheduleButton/ScheduleButton";

export interface ITrainingMain {
  title: string;
  subtitle: string;
  content: ReactNode;
  img: StaticImageData;
  details: { cena: ReactNode; czas: string; iloscOsob: string };
  additionalInfo: string;
}

export function TrainingMain({ title, subtitle, content, img, details, additionalInfo }: ITrainingMain) {
  return (
    <Animation>
      <div className="flex flex-col md:flex-row w-full mt-12 md:mt-36 mb-10 px-6 md:px-16">
        <div className="flex flex-wrap w-full md:w-1/2 md:pr-20 pb-6">
          <div className="flex flex-col justify-center w-full pb-5">
            <h2 className="font-poppins font-medium text-xl md:text-3xl text-bottega-dark-brown mb-0">{title}</h2>
            <p className="font-poppins text-bottega-dark-brown italic text-xl">{subtitle}</p>
          </div>
          <div className="flex flex-col justify-start w-full pb-5">
            <div className="font-poppins text-bottega-dark-brown font-normal text-sm md:text-lg w-full mb-[1em]">{content}</div>
          </div>
          <div className="flex flex-col justify-start w-full">
            <div className="font-poppins font-medium text-sm md:text-lg mb-[1em]">
              <div className="flex flex-col lg:flex-row w-full gap-y-4 gap-x-4">
                <div className="w-full lg:w-1/3">Liczba osób: {details.iloscOsob}</div>
                <div className="w-full lg:w-1/3">Czas trwania: {details.czas}</div>
                <div className="w-full lg:w-1/3">Cena: {details.cena}</div>
              </div>
            </div>
          </div>

          <div className="my-6">
            <ScheduleButton className="font-poppins border-bottega-dark-brown hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown" />
          </div>

          <div className="flex flex-col justify-start w-full text-base font-poppins">{additionalInfo}</div>
        </div>
        <div className="flex w-full md:w-1/2">
          <Image src={img} alt={title} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </div>
    </Animation>
  );
}

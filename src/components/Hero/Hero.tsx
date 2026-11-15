import Image from "next/image";
import home from "@/assets/home.png";
import homeMobile from "@/assets/homeMobile.png";
import { ScheduleButton } from "@/components/ScheduleButton/ScheduleButton";

export function Hero() {
  return (
    <div className="relative">
      <div className="hidden md:block">
        <Image src={home} alt="Pracownia ceramiczna Bottega da Kris" className="relative object-cover pt-0 w-full" sizes="100vw" priority />
      </div>

      <div className="block md:hidden">
        <Image src={homeMobile} alt="Pracownia ceramiczna Bottega da Kris" className="relative object-cover pt-0 w-full" sizes="100vw" priority />
      </div>

      <div className="absolute inset-0 w-full h-full flex justify-center md:items-center">
        <div className="md:w-full items-center justify-center text-center p-2 pt-36 md:pt-0">
          <h2 className="font-poppins text-white text-2xl md:text-5xl pt-16 md:pt-0">CERAMIKA ARTYSTYCZNA</h2>
          <p className="text-white font-poppins text-lg md:text-2xl px-[10%] md:px-[20%] py-4">
            Odkryj piękno ręcznie tworzonej ceramiki, zanurz się w świecie warsztatów garncarskich i poznaj wyjątkowe dzieła sztuki.
          </p>
          <ScheduleButton className="border-white text-xl text-white hover:bg-bottega-brown hover:border-bottega-brown transition-all duration-500 ease-in-out" />
        </div>
      </div>
    </div>
  );
}

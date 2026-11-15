import Image from "next/image";
import header from "@/assets/header.png";

export function PageHeader({ title }: { title: string }) {
  return (
    <div className="relative w-full">
      <Image src={header} alt="" className="w-full" sizes="100vw" priority />
      <div className="absolute bottom-0 w-full">
        <div className="flex justify-center ">
          <div className="flex bg-white w-max px-6 md:px-16">
            <h1 className="font-poppins font-medium text-bottega-dark-brown text-xl md:text-2xl md:text-3xl p-0 m-0 py-3">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

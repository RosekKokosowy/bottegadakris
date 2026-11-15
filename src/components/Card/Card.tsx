import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface Props {
  img: StaticImageData;
  title: string;
  content: string;
  href: string;
}

export function Card({ img, title, content, href }: Props) {
  return (
    <Link href={href}>
      <div className="relative shadow-md shadow-gray-500/50 border hover:shadow-lg">
        <Image src={img} alt={title} className="w-full" sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" />
        <div className="flex flex-col w-full h-full absolute p-7 top-0 items-center justify-center align-middle text-white">
          <div className="w-full h-full bg-bottega-dark-brown/40 p-4 md:p-6">
            <h2 className="font-poppins md:text-xl text-xl text-center pt-2 pb-4 text-white">{title}</h2>
            <p className="font-poppins text-base 2xl:text-xl">{content}</p>
            <div className="flex flex-col w-full align-bottom items-center">
              <span className="font-poppins text-sm md:text-lg absolute bottom-10 hover:bg-bottega-brown hover:text-white hover:border-bottega-brown border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out">
                Dowiedz się więcej
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

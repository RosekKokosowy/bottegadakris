import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  content: string;
  image: StaticImageData;
  textButton: string;
  href: string;
}

export function AboutHome({ title, content, image, textButton, href }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-end pt-12 md:pt-36">
      <div className="w-1/12"></div>
      <div className="w-full md:w-5/12">
        <div className="flex flex-col items-stretch  w-full md:pl-24 text-center md:border-l-bottega-brown md:border-l-[1px] h-full">
          <p className="font-poppins text-bottega-dark-brown font-medium text-xl md:text-2xl md:text-left">{title}</p>
          <p className="font-poppins text-bottega-dark-brown font-normal text-sm md:text-xl md:text-left mt-5 px-5 md:px-0">{content}</p>

          <div className="pt-5 md:text-left">
            <Link
              href={href}
              className="inline-block border-bottega-dark-brown hover:bg-bottega-brown hover:text-white hover:border-bottega-brown text-bottega-dark-brown border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out"
            >
              {textButton}
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/12"></div>
      <div className="w-full md:w-5/12">
        <div className="w-full">
          <div className="flex flex-col items-stretch justify-center w-full">
            <Image src={image} alt={title} className="w-full" sizes="(min-width: 768px) 42vw, 100vw" />
          </div>
        </div>
      </div>
    </div>
  );
}

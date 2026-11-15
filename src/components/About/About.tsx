import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  content: ReactNode;
  image: StaticImageData;
  imgPosition?: "left" | "right";
}

function ImageBlock({ image, alt }: { image: StaticImageData; alt: string }) {
  return (
    <div className="w-full">
      <div className="flex flex-col items-stretch justify-center w-full">
        <Image src={image} alt={alt} className="w-full p-12" sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
    </div>
  );
}

export function About({ title, subtitle, content, image, imgPosition = "left" }: Props) {
  const isImageLeft = imgPosition === "left";

  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <div className="block md:hidden w-full md:w-1/2">
        <ImageBlock image={image} alt={title} />
      </div>
      {isImageLeft && (
        <div className="hidden md:block w-full md:w-1/2 px-6">
          <ImageBlock image={image} alt={title} />
        </div>
      )}

      <div className={`w-full md:w-1/2 ${isImageLeft ? "md:pr-16" : "md:pl-16"}`}>
        <div className={`flex flex-col items-stretch justify-center w-full md:px-8 md:py-12 text-center py-5   ${isImageLeft ? "md:text-left" : "md:text-right"}`}>
          <h2 className="font-poppins text-bottega-dark-brown text-2xl md:text-2xl font-medium md:text-left px-5 mb-[1em]">{title}</h2>
          {subtitle ? <p className="font-poppins text-bottega-dark-brown text-2xl md:text-lg font-light md:text-left px-5">{subtitle}</p> : ""}
          <p className="font-poppins text-bottega-dark-brown text-sm md:text-lg font-light mt-5 md:text-left px-5">{content}</p>
        </div>
      </div>

      {!isImageLeft && (
        <div className="hidden md:block w-full md:w-1/2 px-6">
          <ImageBlock image={image} alt={title} />
        </div>
      )}
    </div>
  );
}

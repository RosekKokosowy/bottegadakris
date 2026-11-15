import { ReactNode } from "react";

export function Headline({ title, content }: { title: string; content: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-poppins text-bottega-dark-brown font-medium uppercase text-center md:text-4xl text-2xl">{title}</p>
      <p className="font-poppins text-bottega-dark-brown text-sm text-center md:text-xl pt-2 md:pt-8">{content}</p>
    </div>
  );
}

import Image from "next/image";
import uslugi from "@/assets/home/uslugi.png";

const services = [
  { title: "Warsztaty", content: "Poznaj, ucz się, pokochaj ceramikę." },
  { title: "Wynajem pracowni", content: " Wynajem miejsca w pracowni w celu indywidualnego tworzenia." },
  { title: "Wypalanie w piecu", content: "Przynieś do nas swoją pracę, a my ją wypalimy." },
  { title: "Wynajem całego pieca", content: "Piec Rohe TE 200S, sterownik ST 411, 200 litrów." },
];

export function Services() {
  return (
    <div className="flex flex-col md:flex-row w-full mt-40 px-8">
      <div className="flex flex-wrap w-full md:w-5/12 pb-2 md:pl-24 md:pr-12 gap-6">
        <div className="w-full">
          <p className="font-poppins font-medium text-bottega-dark-brown text-2xl">USŁUGI</p>
        </div>

        {services.map((el) => (
          <div className="w-full" key={el.title}>
            <p className="font-poppins text-xl font-medium text-bottega-dark-brown pb-0">{el.title}</p>
            <p className="font-poppins text-xl text-bottega-dark-brown border-t-bottega-brown border-t-[1px] w-full pt-2">{el.content}</p>
          </div>
        ))}
      </div>
      <div className="flex md:w-7/12 pt-8 md:pt-0">
        <Image src={uslugi} alt="Usługi pracowni" className="w-full" sizes="(min-width: 768px) 58vw, 100vw" />
      </div>
    </div>
  );
}

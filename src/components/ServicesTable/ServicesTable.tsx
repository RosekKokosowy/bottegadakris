import Image from "next/image";
import servicesTable1 from "@/assets/servicesTable/servicesTable1.png";
import servicesTable2 from "@/assets/servicesTable/servicesTable2.png";
import servicesTable3 from "@/assets/servicesTable/servicesTable3.png";

const services = [
  {
    title: "Wynajem pracowni",
    src: servicesTable1,
    content: "Wynajem miejsca w pracowni w celu indywidualnego tworzenia.Pracownia zapewnia: glinę, koło, narzędzia, szkliwa.",
    additionalInfo: (
      <>
        <p><span className="font-medium">Pierwsza godzina:</span> 60zł,</p>
        <p><span className="font-medium">Każda kolejna:</span> 40zł*</p>
        <p>*Wypalanie dodatkowo płatne zgodnie z cennikiem</p>
      </>
    ),
  },
  {
    title: "Wypalanie w piecu",
    src: servicesTable2,
    content: "Przynieś do nas swoją pracę, a my ją wypalimy.",
    additionalInfo: (
      <>
        <p><span className="font-medium">Biskwit:</span> 31zł/kg</p>
        <p><span className="font-medium">Szkliwo:</span></p>
        <div className="mb-[1em]">
          <ul className="list-disc pl-6">
            <li>Niska temperatura: 40zł/kg</li>
            <li>1150°C: 45zł/kg</li>
            <li>1250°C: 70zł/kg</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    title: "Wynajem całego pieca",
    src: servicesTable3,
    content: " Piec Rohe TE 200S, sterownik ST 411, 200 litrów.",
    additionalInfo: (
      <>
        <p><span className="font-medium">Biskwit do 1000°C:</span> 350zł</p>
        <p><span className="font-medium">Szkliwo do 1150°C:</span> 445zł</p>
        <p><span className="font-medium">Wypał do 1250°C:</span> 650zł</p>
      </>
    ),
  },
];

export function ServicesTable() {
  return (
    <div className="p-8 md:p-32">
      <div className="text-center font-medium text-3xl mb-6 font-poppins text-bottega-dark-brown">USŁUGI</div>
      <div className="flex flex-wrap w-full gap-10 md:gap-0 font-poppins text-bottega-dark-brown">
        {services.map((el) => (
          <div key={el.title} className="flex flex-col w-full md:w-1/3 border-bottega-brown border-[1px]">
            <div className="border-b border-bottega-brown ">
              <p className="text-xl text-left font-semibold pl-5 py-5">{el.title}</p>
            </div>

            <div className="border-b border-bottega-brown p-5 h-[400px]">
              <Image src={el.src} alt={el.title} sizes="(min-width: 768px) 33vw, 100vw" />
              <p className="pt-5 ">{el.content}</p>
            </div>

            <div className="border-b border-bottega-brown p-5 h-[200px]">{el.additionalInfo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

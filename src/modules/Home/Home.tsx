import about from "@/assets/about.png";
import grupy from "@/assets/home/grupy.png";
import lekcja_lepienia from "@/assets/home/lekcja_lepienia.png";
import lekcja_szkliwienia from "@/assets/home/lekcja_szkliwienia.png";
import lekcja_toczenia from "@/assets/home/lekcja_toczenia.png";
import od_zera from "@/assets/home/od_zera.png";
import studio from "@/assets/home/pracownia.png";
import szlif from "@/assets/home/szlif.png";
import { AboutHome } from "@/components/AboutHome/AboutHome";
import { Animation } from "@/components/Animation/Animation";
import { Card } from "@/components/Card/Card";
import { Headline } from "@/components/Headline/Headline";
import { Hero } from "@/components/Hero/Hero";
import { Services } from "@/components/Services/Services";
import { Studio } from "@/components/Studio/Studio";

const workshops = [
  { title: "KURS OD ZERA", content: "Zapraszam do mojej pracowni na 3 dni. Przez 3 godziny dziennie będziemy się uczyć podstaw toczenia na kole. To 9 godzin zegarowych, które spędzisz ze mną przy kole garncarskim.", img: od_zera, href: "/warsztaty/od-zera" },
  { title: "LEKCJA TOCZENIA", content: "Pojedyncza lekcja toczenia – przyjdź i zobacz czy koło to Twoja bajka.", img: lekcja_toczenia, href: "/warsztaty/toczenie" },
  { title: "LEKCJA LEPIENIA", content: "Nauczysz się tworzyć unikalne naczynia i ozdoby.", img: lekcja_lepienia, href: "/warsztaty/lepienie" },
  { title: "LEKCJA SZKLIWIENIA", content: "Odkryj, jak nadać swoim wyrobom niepowtarzalny charakter, tworząc wyjątkowe prezenty i dekoracje.", img: lekcja_szkliwienia, href: "/warsztaty/szkliwienie" },
  { title: "SZLIF CERAMICZNY", content: "To przede wszystkim spotkania ze mną, które pozwolą Ci udoskonalić Twoje umiejętności.", img: szlif, href: "/warsztaty/szlif-ceramiczny" },
  { title: "GRUPY ZORGANIZOWANE", content: "Doskonały pomysł na spotkania integracyjne, świętowanie urodzin, wieczór panieński oraz każdą inną okazję, którą chcecie celebrować w kreatywny sposób.", img: grupy, href: "/warsztaty/grupy-zorganizowane" },
];

const aboutContent = "Mam na imię Krzysztof. Od ponad 20 lat mieszkam w Łodzi i wspieram społeczność LGBTQ+ oraz jestem dumnym opiekunem dwóch wspaniałych kotów – Kazimierza i Lenny’ego. Z zamiłowania jestem pasjonatem sztuki. Ceramika stała się dla mnie pewnego rodzaju lekarstwem, które pojawiło się chwilę po tym, jak doświadczyłem wypalenia zawodowego. Można powiedzieć, że mnie to uratowało, dając nowe życie mojej artystycznej duszy. Od tego czasu rozwijam swoją pasję, szkoląc się pod okiem polskich i włoskich ceramików. Wciąż doskonalę swoje umiejętności, by spełnić marzenie o przekazywaniu wiedzy, jaką sam otrzymałem. Tworzę, szkliwię, edukuję – to właśnie sprawia mi największą radość.";

const studioContent = "Pracownia ceramiczna Bottega da Kris mieści się w centrum Łodzi. Jest to miejsce stworzone z myślą o osobach, które tak jak ja, pragną rozwijać swoje umiejętności artystyczne w spokojnej i twórczej atmosferze. Jeżeli chciałbyś rozpocząć swoją przygodę z ceramiką zachęcam do wspólnych warsztatów. Jeśli nie jest to twoja pierwsza styczność z pracami ceramicznymi i szukasz miejsca, w którym będziesz mógł/a szlifować swoje umiejętności samodzielnie, pracownia zapewni wszystkie podstawowe narzędzia, niezbędne do dalszego rozwoju. W pracowni istnieje także możliwość wypalania własnych wyrobów lub wynajęcia całego pieca.";

export default function Home() {
  return (
    <>
      <div className="w-full">
        <Hero />
      </div>

      <Animation>
        <AboutHome title="O MNIE" content={aboutContent} image={about} textButton="Dowiedz się więcej" href="/o-mnie" />
      </Animation>

      <Animation>
        <div className="w-full px-12 md:px-24 pt-12 md:pt-36 pb-4 md:pb-6">
          <Headline
            title="WARSZTATY"
            content={
              <>
                Zapraszam do mojej pracowni w Łodzi – miejsca, gdzie glina ożywa w Twoich rękach, a toczenie na kole staje się prawdziwą przygodą.{" "}
                <br />
                Przekonaj się, jak wiele radości może przynieść ceramika!
              </>
            }
          />
        </div>

        <div className="flex flex-wrap md:px-12 2xl:px-32 2xl:mx-12">
          {workshops.map((el) => (
            <div className="w-full sm:w-1/2 md:w-1/3 p-4" key={el.href}>
              <Card title={el.title} content={el.content} img={el.img} href={el.href} />
            </div>
          ))}
        </div>
      </Animation>

      <Animation>
        <Services />
      </Animation>

      <Animation>
        <div className="p-2 pt-24 md:p-36">
          <Studio img={studio} title="PRACOWNIA" content={studioContent} />
        </div>
      </Animation>
    </>
  );
}

import grupy_zorganizowane from "@/assets/grupy_zorganizowane.png";
import kurs_od_zera from "@/assets/kurs_od_zera.png";
import lekcja_lepienia from "@/assets/lekcja_lepienia.png";
import lekcja_szkliwienia from "@/assets/lekcja_szkliwienia.png";
import lekcja_toczenia from "@/assets/lekcja_toczenia.png";
import szlif_ceramiczny from "@/assets/szlif_ceramiczny.png";
import { ITrainingMain } from "@/components/TrainingMain/TrainingMain";

export interface IWorkshopPage {
  /** `warsztaty.id` whose price overrides the static one, if any. */
  workshopId?: number;
  title: string;
  seo: { title: string; description: string };
  trainingMain: ITrainingMain;
}

// A <ul> may not live inside <p>; these divs carry the paragraph margin instead.
const listWrapper = "pb-2 mb-[1em]";

export const workshopPages: Record<string, IWorkshopPage> = {
  "od-zera": {
    workshopId: 1,
    title: "KURS OD ZERA",
    seo: { title: "Warsztaty ceramiki od podstaw | Bottega da Kris", description: "Zacznij swoją przygodę z ceramiką od zera. Tworzymy w przyjaznej atmosferze – każdy może lepić!" },
    trainingMain: {
      title: "KURS OD ZERA DLA KAŻDEGO",
      subtitle: "Zacznij swoją przygodę z ceramiką",
      content: (
        <>
          <p>
            Zapraszam na 3 dni do mojej pracowni, gdzie rozpoczniesz swoją przygodę z ceramiką od podstaw. Przez 3 godziny dziennie będziemy uczyć się toczenia na kole garncarskim. To 9 godzin zegarowych, które spędzisz ze mną przy kole, poznając techniki szkliwienia oraz tworzenia unikalnych wyrobów ceramicznych.
          </p>
          <p className="py-4">
            Podczas intensywnego kursu od zera, nauczysz się wszystkich niezbędnych umiejętności, aby samodzielnie tworzyć ceramikę. Moja pracownia ceramiczna w Łodzi to idealne miejsce, aby zgłębić tajniki garncarstwa i rozwijać swoją pasję do ceramiki.
          </p>
          <p className="font-medium ">Podczas kursu nauczysz się o:</p>
          <div className="pb-2 pl-8 mb-[1em]">
            <ul style={{ listStyle: "disc", textIndent: 12 }}>
              <li>Rodzajach gliny do pracy na kole ceramicznym</li>
              <ul>
                <li>— Technice przygotowania gliny do toczenia oraz jej odzyskiwania</li>
              </ul>
              <li>
                Praktycznych informacjach o kole garncarskim i podstawowych narzędziach ceramicznych
                <ul>
                  <li>— Nauce centrowania</li>
                  <li>— Nauce toczenia podstawowych form </li>
                </ul>
              </li>
              <li>Technikach obróbki gliny, formowania stopki, żłobienia</li>
            </ul>
          </div>
          <p>
            Moje warsztaty w Łodzi są doskonałą okazją, aby nauczyć się czegoś nowego w przyjaznej i inspirującej atmosferze. Zapraszam wszystkich zainteresowanych ceramiką – zarówno początkujących, jak i tych, którzy chcą doskonalić swoje umiejętności.
          </p>
          <p>
            Dołącz do mnie w Bottega da Kris i odkryj, jak fascynujący może być świat ceramiki. Zarezerwuj swoje miejsce już dziś i rozpocznij swoją przygodę z ceramiką w Łodzi!
          </p>
        </>
      ),
      img: kurs_od_zera,
      details: { czas: "3 dni po 3h", cena: "850zł", iloscOsob: "max 2" },
      additionalInfo: "*Materiały oraz wypał na biskwit są wliczone w cenę.",
    },
  },
  toczenie: {
    workshopId: 2,
    title: "LEKCJA TOCZENIA",
    seo: { title: "Warsztaty toczenia | Bottega da Kris", description: "Naucz się tworzyć ceramikę na kole garncarskim. Praktyczne warsztaty toczenia gliny w klimatycznym studio." },
    trainingMain: {
      title: "POJEDYNCZA LEKCJA TOCZENIA",
      subtitle: "Odkryj pasję do ceramiki w Bottega da Kris",
      content: (
        <>
          <p>Chciałbym się z Tobą podzielić moją pasją do ceramiki. Proponuje zajęcia indywidualne lub lekcje dla dwóch osób.</p>
          <p className="py-4">
            Przyjdź i zobacz, czy koło garncarskie to Twoja bajka! Moje warsztaty to doskonała okazja, aby poznać podstawy toczenia na kole. W przyjaznej atmosferze pracowni ceramicznej w Łodzi nauczysz się technik garncarstwa oraz szkliwienia.{" "}
          </p>
          <p>
            Podczas zajęć skoncentruję się na Twoich potrzebach i pomogę Ci odkryć, czy ceramika jest Twoją nową pasją. To idealna okazja, aby spróbować swoich sił w tworzeniu wyjątkowych wyrobów ceramicznych. Kursy ceramiczne w Bottega da Kris to nie tylko nauka, ale również inspirujące doświadczenie. Zapraszam wszystkich zainteresowanych ceramiką – zarówno początkujących, jak i tych, którzy chcą doskonalić swoje umiejętności.
          </p>
          <p>
            Zapraszam do mojej pracowni w Łodzi – miejsca, gdzie glina ożywa w Twoich rękach, a toczenie na kole staje się prawdziwą przygodą. Przekonaj się, jak wiele radości może przynieść ceramika!{" "}
          </p>
        </>
      ),
      img: lekcja_toczenia,
      details: { czas: "2h", cena: "250 zł", iloscOsob: "2" },
      additionalInfo: "*Wypał na biskwit jest wliczony w cenę.",
    },
  },
  lepienie: {
    workshopId: 3,
    title: "LEKCJA LEPIENIA",
    seo: { title: "Formowanie ceramiki | Bottega da Kris", description: "Poznaj różne techniki lepienia i formowania gliny. Zajęcia pełne eksperymentowania z kształtem i strukturą." },
    trainingMain: {
      title: "POJEDYNCZA LEKCJA LEPIENIA",
      subtitle: "Odkryj pasję do ceramiki w Bottega da Kris",
      content: (
        <>
          <p>Chciałbym zaprosić Cię do odkrywania świata ceramiki poprzez sztukę lepienia z gliny.</p>
          <p className="py-4">
            Na warsztatach poznasz techniki modelowania, dzięki którym stworzysz unikalne ceramiczne dzieła, które idealnie nadają się na prezent dla bliskiej osoby. W kameralnej atmosferze pracowni Bottega da Kris nauczysz się, jak przygotować glinę, formować naczynia i ozdoby, a także jak wykończyć swoje prace, nadając im niepowtarzalny charakter.
          </p>
          <p>
            Podczas zajęć pomogę Ci w opanowaniu różnych technik lepienia oraz w odkrywaniu własnego stylu. To doskonała okazja, aby zrelaksować się i oddać się pasji tworzenia, bez pośpiechu i presji.
          </p>
          <p>
            Serdecznie zapraszam do mojej pracowni w Łodzi – miejsca, gdzie każda bryła gliny może stać się wyjątkowym dziełem sztuki, a lepienie z gliny to proces pełen satysfakcji i odkrywania nowych możliwości.
          </p>
        </>
      ),
      img: lekcja_lepienia,
      details: {
        czas: "2h",
        cena: (
          <>
            180zł
            <br />
            Pakiet lepienie + szkliwienie: 320zł (4h)
          </>
        ),
        iloscOsob: "5",
      },
      additionalInfo: "*Wypał na biskwit jest wliczony w cenę.",
    },
  },
  szkliwienie: {
    workshopId: 4,
    title: "LEKCJA SZKLIWIENIA",
    seo: { title: "Szkliwienie ceramiki | Bottega da Kris", description: "Dowiedz się, jak szkliwić swoje prace. Warsztaty szkliwienia pozwolą nadać ceramice unikatowy charakter i kolor." },
    trainingMain: {
      title: "POJEDYNCZA LEKCJA SZKLIWIENIA",
      subtitle: "Odkryj pasję do ceramiki w Bottega da Kris",
      content: (
        <>
          <p>Szkliwienie to sztuka, która pozwala na wykończenie prac w niezwykły sposób. To właśnie dzięki tej technice Twoje wyroby zyskują wyjątkowy wygląd, a także trwałość.</p>
          <p className="py-4">
            Podczas lekcji szkliwienia, odkryjesz, jak nadać swoim ceramicznym dziełom niepowtarzalny blask i charakter. Na warsztatach nauczysz się, jak dobierać odpowiednie szkliwa, jak je nakładać i jakie efekty można uzyskać, stosując różne techniki. Wiedza ta pozwoli Ci tworzyć unikalne przedmioty – od dekoracyjnych naczyń po piękne ozdoby i prezenty, które zachwycą Twoich bliskich.
          </p>
          <p>
            Wspólna praca umożliwi nam na skupienie się na Twoich potrzebachi pomysłach, dzięki czemu efekty będą dokładnie takie, jak sobie wymarzysz. Serdecznie zapraszam do Bottega da Kris, gdzie Twoje ceramiczne wyroby mogą nabrać nowego życia dzięki szkliwieniu. Przekonaj się, jak wiele radości i satysfakcji może przynieść proces wykańczania ceramiki, tworząc wyjątkowe, spersonalizowane prezenty i dekoracje.
          </p>
        </>
      ),
      img: lekcja_szkliwienia,
      details: {
        czas: "2",
        cena: (
          <>
            180zł
            <br />
            Pakiet lepienie + szkliwienie: 320zł (4h)
          </>
        ),
        iloscOsob: "5",
      },
      additionalInfo: "",
    },
  },
  "szlif-ceramiczny": {
    workshopId: 5,
    title: "SZLIF CERAMICZNY",
    seo: { title: "Szlifowanie ceramiki | Bottega da Kris", description: "Poznaj techniki wykończenia ceramiki. Naucz się szlifować i przygotować swoje dzieła do szkliwienia." },
    trainingMain: {
      title: "DOSKONAL SWOJE UMIEJĘTNOŚCI",
      subtitle: "",
      content: (
        <>
          <p>
            Zapraszam na spotkania, które pozwolą Ci doskonalić Twoje umiejętności w ceramice. W Bottega da Kris oferuję indywidualne zajęcia, podczas których skupię się na rozwijaniu Twojego talentu i technik.
          </p>
          <p className="py-4">
            Nasze spotkania to doskonała okazja, aby pogłębić wiedzę i umiejętności w zakresie toczenia na kole oraz szkliwienia. Bez względu na to, czy masz już doświadczenie w ceramice, czy dopiero zaczynasz, moje warsztaty pomogą Ci osiągnąć nowy poziom w tworzeniu wyrobów ceramicznych.
          </p>
          <p className="font-medium">Kurs obejmuje:</p>
          <div className={listWrapper}>
            {/* The old site set invalid list styles here, so browsers fall back to the global decimal markers. */}
            <ul style={{ textIndent: 12 }}>
              <li>— &nbsp;Indywidualne podejście do Twoich potrzeb</li>
              <li>— &nbsp;Doskonalenie toczenia na kole garncarskim</li>
              <li>— &nbsp;Zaawansowane metody szkliwienia</li>
              <li>— &nbsp;Tworzenie bardziej skomplikowanych i artystycznych wyrobów ceramicznych</li>
            </ul>
          </div>
          <p>
            Moja pracownia ceramiczna w Łodzi to idealne miejsce do rozwijania swoich umiejętności w inspirującej i wspierającej atmosferze. Warsztaty w Bottega da Kris to nie tylko nauka, ale także możliwość odkrywania własnego stylu i pasji do ceramiki.
          </p>
          <p>
            Przyjdź i przekonaj się, jak wiele radości może przynieść ceramika. Zarezerwuj swoje spotkanie już dziś i pozwól, abyśmy wspólnie rozwijali Twoje umiejętności w Bottega da Kris!
          </p>
        </>
      ),
      img: szlif_ceramiczny,
      details: { czas: "3h", cena: "1200zł", iloscOsob: "max 2" },
      additionalInfo: "",
    },
  },
  "grupy-zorganizowane": {
    title: "GRUPY ZORGANIZOWANE",
    seo: { title: "Zajęcia grupowe | Bottega da Kris", description: "Zorganizuj kreatywny czas z przyjaciółmi. Grupowe warsztaty ceramiki to świetna zabawa i artystyczna przygoda!" },
    trainingMain: {
      title: "GRUPY ZORGANIZOWANE",
      subtitle: "",
      content: (
        <>
          <p>
            Zapraszam na wyjątkowe warsztaty, które kieruję do osób szukających wspólnej przygody przy tworzeniu dzieł ceramicznych. Czas spędzony na zajęciach w Bottega da Kris to doskonały pomysł na spotkania integracyjne, świętowanie urodzin, wieczór panieński oraz każdą inną okazję, którą chcecie celebrować w kreatywny sposób.
          </p>
          <p className="py-4">
            Podczas zajęć będziecie mogli przy jednym stole wspólnie spędzić czas, porozmawiać, oddać się twórczej pracy i stworzyć własne unikalne dzieło. Po wykonaniu pracy mogą one zostać wypalone (wliczone w cenę) lub przekazane w stanie surowym. Wpalone wyroby można odebrać maxymalnie w ciągu 30 dni.
          </p>
          <p className="font-medium">Co Was czeka?</p>
          <div className={listWrapper}>
            <ul style={{ textIndent: 12 }}>
              <li>— &nbsp;Kreatywna zabawa przy kole garncarskim</li>
              <li>— &nbsp;Tworzenie wyjątkowych wyrobów ceramicznych</li>
              <li>— &nbsp;Możliwość personalizowania swoich dzieł</li>
              <li>— &nbsp;Niezapomniane chwile spędzone z bliskimi</li>
              <li>— &nbsp;Przekąski i napoje</li>
            </ul>
          </div>
          <p className="font-medium">Warsztaty idealne na:</p>
          <div className={listWrapper}>
            <ul style={{ textIndent: 12 }}>
              <li>— &nbsp;Spotkania integracyjne</li>
              <li>— &nbsp;Urodziny i rocznice</li>
              <li>— &nbsp;Wieczory panieńskie i kawalerskie</li>
              <li>— &nbsp;Inne okazje, które chcecie uczcić w kreatywny sposób</li>
            </ul>
          </div>
          <p>
            Moje warsztaty to nie tylko nauka, ale także świetny sposób na relaks i odkrycie w sobie artystycznej pasji. Każde spotkanie dostosuję do potrzeb i oczekiwań grupy, abyście mogli w pełni cieszyć się wspólnym czasem.
          </p>
        </>
      ),
      img: grupy_zorganizowane,
      details: { czas: "ustalane indywidualnie", cena: "ustalana indywidualnie", iloscOsob: "max 15" },
      additionalInfo: "",
    },
  },
};

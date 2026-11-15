import about from "@/assets/about.png";
import about2 from "@/assets/about2.png";
import { About } from "@/components/About/About";
import { Animation } from "@/components/Animation/Animation";
import { PageHeader } from "@/components/PageHeader/PageHeader";

export default function AboutMe() {
  return (
    <div className="pb-10">
      <PageHeader title="O MNIE" />
      <div className="px-6 md:px-24 py-12">
        <Animation>
          <div>
            <About
              title="BOTTEGA DA KRIS - DOWIEDZ SIĘ O MNIE WIĘCEJ!"
              subtitle="Krzysztof - Artysta z pasją do ceramiki"
              content={
                <>
                  <span>
                    Mam na imię Krzysztof. Od ponad 20 lat mieszkam w Łodzi i wspieram społeczność LGBTQ+ oraz jestem dumnym opiekunem dwóch wspaniałych kotów – Kazimierza i Lenny’ego. Z zamiłowania jestem pasjonatem sztuki. Ceramika stała się dla mnie pewnego rodzaju lekarstwem, które pojawiło się chwilę po tym, jak doświadczyłem wypalenia zawodowego. Można powiedzieć, że mnie to uratowało, dając nowe życie mojej artystycznej duszy.
                  </span>
                  <br />
                  <br />
                  <span>
                    Od tego czasu rozwijam swoją pasję, szkoląc się pod okiem polskich i włoskich ceramików. Wciąż doskonalę swoje umiejętności, by spełnić marzenie o przekazywaniu wiedzy, jaką sam otrzymałem. Tworzę, szkliwię, edukuję – to właśnie sprawia mi największą radość.
                  </span>
                  <br />
                  <br />
                  <span>
                    Bottega da Kris to miejsce przyjazne dla mniejszości LGBTQ+, w którym czas płynie inaczej, a ja zatracam się w sztuce, skupiając się jedynie na glinie i obrotach koła garncarskiego. To przestrzeń, która przenosi mnie do innego świata, do którego chciałbym zapraszać każdego z Was.
                  </span>
                </>
              }
              image={about}
              imgPosition="left"
            />
          </div>
        </Animation>
        <Animation>
          <div className="pt-24 md:pt-0">
            <About
              title="MOJA PODRÓŻ ARTYSTYCZNA"
              content={
                <>
                  <span>
                    Moje zainteresowanie sztuką sięga dzieciństwa, kiedy marzyłem o studiowaniu malarstwa lub zostaniu projektantem mody. Na wiele lat te marzenia zostały zapomniane, gdy zacząłem rozwijać pasję do medycyny, laryngologii i nauki, co zaowocowało doktoratem. Jednak po tak długiej przerwie ponownie obudziła się we mnie artystyczna dusza.
                  </span>
                  <br />
                  <br />
                  <span>
                    Jestem miłośnikiem Włoch – od kontynentu, przez wyspy. Mam bzika na punkcie Italii i mówię po włosku. Jestem również zapalonym podróżnikiem i wielkim fanem Leonarda da Vinci, którego geniusz mnie fascynuje.
                  </span>
                  <br />
                  <br />
                  <span>
                    Zapraszam do Bottega da Kris, miejsca, gdzie sztuka i pasja spotykają się w harmonii, a każdy dzień jest nową okazją do tworzenia i odkrywania piękna ceramiki.
                  </span>
                  <br />
                  <br />
                  <br />
                  <span>
                    “È meglio essere ottimisti e avere torto, che pessimisti e avere ragione”
                    <br />
                    <span className="text-bottega-brown">~ Albert Einstein</span>
                  </span>
                </>
              }
              image={about2}
              imgPosition="right"
            />
          </div>
        </Animation>
      </div>
    </div>
  );
}

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/components';
import { SITE_URL } from '@/lib/seo/config';

interface WorkshopRescheduleEmailProps {
  warsztatNazwa: string;
  imieNazwisko: string;
  data: string;
  godzina: string;
  kwotaPozostała: number;
}

function WorkshopRescheduleEmail({
  warsztatNazwa,
  imieNazwisko,
  data,
  godzina,
  kwotaPozostała,
}: WorkshopRescheduleEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Zmiana terminu warsztatów - ${warsztatNazwa}`}</Preview>
      <Tailwind config={{
        theme: {
          extend: {
            colors: {
              'bottega-brown': '#AC8976',
              'bottega-dark-brown': '#321B05',
            },
          },
        },
      }}>
        <Body className="bg-slate-50 font-sans m-0 p-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <Container className="mx-auto py-5 max-w-2xl bg-white">
            {/* Main Workshop Card with Background */}
            <Section className="p-0 mx-auto max-w-2xl">
              <table
                cellPadding="0"
                cellSpacing="0"
                className="w-full mx-auto"
                style={{
                  width: '600px',
                  backgroundImage: `url('${SITE_URL}/assets/voucher_background.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <tr>
                  <td className="py-10 px-12">
                    {/* Inner content with overlay */}
                    <table
                      cellPadding="0"
                      cellSpacing="0"
                      className="w-full p-12 text-white relative"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.33)',
                        minHeight: '350px'
                      }}
                    >
                      <tr>
                        <td>
                          {/* Logo */}
                          <Img
                            src={`${SITE_URL}/assets/logo.png`}
                            width="105"
                            height="auto"
                            alt="Bottega da Kris"
                            className="mb-4 block mx-auto"
                          />

                          {/* Title */}
                          <Text className="text-3xl font-thin text-center text-white mb-0">
                            ZMIANA TERMINU WARSZTATÓW
                          </Text>

                          {/* Subtitle */}
                          <Text className="text-center italic text-base mt-0 mb-8" style={{ color: '#f5f5dc' }}>
                            Warsztaty ceramiczne w Bottega da Kris
                          </Text>

                          {/* Workshop Name */}
                          <table cellPadding="0" cellSpacing="0" className="mx-auto mb-8 max-w-max">
                            <tr>
                              <td>
                                <Text
                                  className="text-center font-thin text-xl m-0 pb-1"
                                  style={{
                                    color: '#f5f5dc',
                                    borderBottom: '2px solid #f5f5dc'
                                  }}
                                >
                                  {warsztatNazwa}
                                </Text>
                              </td>
                            </tr>
                          </table>

                          {/* Workshop Details Table */}
                          <table
                            cellPadding="0"
                            cellSpacing="0"
                            className="mx-8 text-white text-xl"
                            style={{ width: 'calc(100% - 60px)' }}
                          >
                            <tr>
                              <td className="pr-5 w-3/10 align-bottom pb-1">
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>Imię i nazwisko:</Text>
                              </td>
                              <td className="pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>{imieNazwisko}</Text>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-5 w-3/10 pt-6 align-bottom pb-1">
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>Nowa data:</Text>
                              </td>
                              <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>{data}</Text>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-5 w-3/10 pt-6 align-bottom pb-1">
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>Nowa godzina:</Text>
                              </td>
                              <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>{godzina}</Text>
                              </td>
                            </tr>

                            {kwotaPozostała > 0 && (
                              <tr>
                                <td className="pr-5 w-3/10 pt-6 align-bottom pb-1">
                                  <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>Kwota do zapłaty:</Text>
                                </td>
                                <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                  <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>{kwotaPozostała} PLN</Text>
                                </td>
                            </tr>
                            )}
                          </table>

                          {/* Bottom message */}
                          <table cellPadding="0" cellSpacing="0" className="mt-6 mx-8">
                            <tr>
                              <td>
                                <Text className="italic text-base m-0 text-center" style={{ color: '#f5f5dc' }}>
                                  Potwierdzamy zmianę terminu Twoich warsztatów. W razie pytań prosimy o kontakt: biuro@bottegadakris.pl
                                </Text>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WorkshopRescheduleEmail.PreviewProps = {
  warsztatNazwa: 'Warsztaty garncarskie dla początkujących',
  imieNazwisko: 'Anna Kowalska',
  data: '22 sierpnia 2024',
  godzina: '14:00',
  kwotaPozostała: 150
} as Parameters<typeof WorkshopRescheduleEmail>[0];

export default WorkshopRescheduleEmail;

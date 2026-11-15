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

interface WorkshopCancelEmailProps {
  warsztatNazwa: string;
  imieNazwisko: string;
  data: string;
  godzina: string;
}

function WorkshopCancelEmail({
  warsztatNazwa,
  imieNazwisko,
  data,
  godzina,
}: WorkshopCancelEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Anulowanie warsztatów - ${warsztatNazwa}`}</Preview>
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
                        minHeight: 'auto'
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
                            ANULOWANIE WARSZTATÓW
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
                            className="mx-8 text-white text-lg"
                            style={{ width: 'calc(100% - 60px)', tableLayout: 'fixed' }}
                          >
                            <tr>
                              <td className="pr-5 w-3/10 align-bottom pb-1">
                                <Text className="m-0 text-lg" style={{ color: '#f5f5dc' }}>Imię i nazwisko:</Text>
                              </td>
                              <td className="pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text className="m-0 text-lg" style={{ color: '#f5f5dc' }}>{imieNazwisko}</Text>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-5 w-3/10 pt-6 align-bottom pb-1">
                                <Text className="m-0 text-lg" style={{ color: '#f5f5dc' }}>Data:</Text>
                              </td>
                              <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text className="m-0 text-lg" style={{ color: '#f5f5dc' }}>{data}</Text>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-5 w-3/10 pt-6 align-bottom pb-1">
                                <Text className="m-0 text-lg" style={{ color: '#f5f5dc' }}>Godzina:</Text>
                              </td>
                              <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text className="m-0 text-lg" style={{ color: '#f5f5dc' }}>{godzina}</Text>
                              </td>
                            </tr>
                          </table>

                          {/* Bottom message */}
                          <table cellPadding="0" cellSpacing="0" className="mt-6 mx-8">
                            <tr>
                              <td>
                                <Text className="italic text-base m-0 text-center" style={{ color: '#f5f5dc' }}>
                                  Potwierdzamy anulowanie Twoich warsztatów. W razie pytań prosimy o kontakt: biuro@bottegadakris.pl
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

WorkshopCancelEmail.PreviewProps = {
  warsztatNazwa: 'Warsztaty garncarskie dla początkujących',
  imieNazwisko: 'Anna Kowalska',
  data: '15 sierpnia 2024',
  godzina: '10:00'
} as Parameters<typeof WorkshopCancelEmail>[0];

export default WorkshopCancelEmail;

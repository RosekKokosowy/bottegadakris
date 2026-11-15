import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/components';
import { SITE_URL } from '@/lib/seo/config';

interface VoucherEmailProps {
  voucherCode: string;
  workshopName?: string;
  fromName?: string;
  forName?: string;
}

function VoucherEmail({
  voucherCode,
  workshopName = "",
  fromName = "",
  forName = "",
}: VoucherEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Twój voucher ${workshopName}- Bottega da Kris`}</Preview>
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
            {/* Main Voucher Card with Background */}
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
                  <td className="p-12">
                    {/* Inner content with overlay */}
                    <table
                      cellPadding="0"
                      cellSpacing="0"
                      className="w-full p-4 text-white relative"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.33)',
                        minHeight: '400px'
                      }}
                    >
                      <tr>
                        <td>
                          {/* Logo */}
                            <Img
                              src={`${SITE_URL}/assets/logo.png`}
                              width="150"
                              height="auto"
                              alt="Bottega da Kris"
                              className="mb-5 block mx-auto"
                            />


                          {/* Title */}
                          <Text className="text-4xl font-thin text-center text-white my-5 z-10">
                            VOUCHER
                          </Text>

                          {/* Subtitle */}
                          <Text className="text-center italic text-base mb-8" style={{ color: '#f5f5dc' }}>
                            Na warsztaty ceramiczne w Bottega da Kris
                          </Text>

                          {/* Workshop Name */}
                          {workshopName && (
                            <table cellPadding="0" cellSpacing="0" className="mx-auto mb-8 max-w-max">
                              <tr>
                                <td>
                                  <Text
                                    className="text-center font-thin text-xl m-0 pb-2"
                                    style={{
                                      color: '#f5f5dc',
                                      borderBottom: '2px solid #f5f5dc'
                                    }}
                                  >
                                    {workshopName}
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          )}

                          {/* Voucher Details Table */}
                          <table
                            cellPadding="0"
                            cellSpacing="0"
                            className="mx-12 text-white text-xl"
                            style={{ width: 'calc(100% - 100px)' }}
                          >
                            {fromName && (
                              <tr>
                                <td className="pr-5 w-1/5 align-bottom pb-1">
                                  <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>od:</Text>
                                </td>
                                <td className="pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                  <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>{fromName}</Text>
                                </td>
                              </tr>
                            )}

                            {forName && (
                              <tr>
                                <td className="pr-5 w-1/5 pt-6 align-bottom pb-1">
                                  <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>dla:</Text>
                                </td>
                                <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                  <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>{forName}</Text>
                                </td>
                              </tr>
                            )}

                            <tr>
                              <td className="pr-5 w-1/5 pt-6 align-bottom pb-1">
                                <Text className="m-0 text-xl" style={{ color: '#f5f5dc' }}>kod:</Text>
                              </td>
                              <td className="pt-6 pb-1" style={{ borderBottom: '2px solid #f5f5dc' }}>
                                <Text
                                  className="m-0 text-xl tracking-wide"
                                  style={{
                                    color: '#f5f5dc',
                                    fontFamily: 'Monaco, Consolas, monospace'
                                  }}
                                >
                                  {voucherCode}
                                </Text>
                              </td>
                            </tr>
                          </table>

                          {/* Bottom instruction */}
                          <table cellPadding="0" cellSpacing="0" className="mt-6 mx-12">
                            <tr>
                              <td>
                                <Text className="italic text-base m-0 text-white">
                                  Umów termin na <Link href="https://www.bottegadakris.pl" className="text-white no-underline font-semibold">bottegadakris.pl</Link>
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

            {/* Instructions Section */}
            <Section className="py-8 px-5">
              <Text className="text-xl font-semibold text-gray-700 mb-5 text-center">
                Jak wykorzystać voucher:
              </Text>

              <table cellPadding="0" cellSpacing="0" className="bg-slate-50 rounded-lg p-6 w-full">
                <tr>
                  <td>
                    <table cellPadding="0" cellSpacing="0" className="w-full mb-4">
                      <tr>
                        <td className="w-10 align-top">
                          <div className="bg-bottega-brown text-white w-7 h-7 rounded-full text-center text-sm font-bold" style={{ lineHeight: '28px' }}>
                            1
                          </div>
                        </td>
                        <td className="pl-3">
                          <Text className="text-gray-600 m-0 text-base">
                            Wejdź na stronę <Link href="https://www.bottegadakris.pl" className="text-bottega-brown no-underline font-semibold">bottegadakris.pl</Link>
                          </Text>
                        </td>
                      </tr>
                    </table>

                    <table cellPadding="0" cellSpacing="0" className="w-full mb-4">
                      <tr>
                        <td className="w-10 align-top">
                          <div className="bg-bottega-brown text-white w-7 h-7 rounded-full text-center text-sm font-bold" style={{ lineHeight: '28px' }}>
                            2
                          </div>
                        </td>
                        <td className="pl-3">
                          <Text className="text-gray-600 m-0 text-base">
                            Wybierz interesujące Cię warsztaty lub usługi
                          </Text>
                        </td>
                      </tr>
                    </table>

                    <table cellPadding="0" cellSpacing="0" className="w-full mb-4">
                      <tr>
                        <td className="w-10 align-top">
                          <div className="bg-bottega-brown text-white w-7 h-7 rounded-full text-center text-sm font-bold" style={{ lineHeight: '28px' }}>
                            3
                          </div>
                        </td>
                        <td className="pl-3">
                          <Text className="text-gray-600 m-0 text-base">
                            Podczas finalizacji zamówienia wprowadź kod: <strong className="text-bottega-brown">{voucherCode}</strong>
                          </Text>
                        </td>
                      </tr>
                    </table>

                    <table cellPadding="0" cellSpacing="0" className="w-full">
                      <tr>
                        <td className="w-10 align-top">
                          <div className="bg-bottega-brown text-white w-7 h-7 rounded-full text-center text-sm font-bold" style={{ lineHeight: '28px' }}>
                            4
                          </div>
                        </td>
                        <td className="pl-3">
                          <Text className="text-gray-600 m-0 text-base">
                            Wartość vouchera zostanie automatycznie odjęta od kwoty do zapłaty
                          </Text>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Footer */}
            <Section className="pt-6 px-5 pb-8 border-t border-gray-200 bg-gray-50">

              <Text className="text-sm text-gray-500 text-center m-0">
                W razie pytań skontaktuj się z nami: <Link href="mailto:kontakt@bottegadakris.pl" className="text-bottega-brown no-underline">kontakt@bottegadakris.pl</Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

VoucherEmail.PreviewProps = {
  voucherCode: 'VOUCHER2024',
  workshopName: 'Warsztaty garncarskie dla początkujących',
  fromName: 'Anna Kowalska',
  forName: 'Jan Nowak'
} as Parameters<typeof VoucherEmail>[0];

export default VoucherEmail;

import "server-only";

import { Document, Font, Image, Page, renderToBuffer, StyleSheet, Text, View } from "@react-pdf/renderer";
import { readFileSync } from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");

// Built-in PDF fonts cannot render Polish letters, so the voucher embeds Poppins.
Font.register({
  family: "Poppins",
  fonts: [
    { src: path.join(publicDir, "fonts/Poppins-Thin.ttf"), fontWeight: 100 },
    { src: path.join(publicDir, "fonts/Poppins-Light.ttf"), fontWeight: 300 },
    { src: path.join(publicDir, "fonts/Poppins-LightItalic.ttf"), fontWeight: 300, fontStyle: "italic" },
    { src: path.join(publicDir, "fonts/Poppins-Regular.ttf"), fontWeight: 400 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

// Passed as bytes: react-pdf would read a Windows path like C:... as a URL.
const png = (file: string) => ({ data: readFileSync(path.join(publicDir, file)), format: "png" as const });
const background = png("assets/voucher_background.png");
const logo = png("assets/logo.png");

const beige = "#f5f5dc";

const styles = StyleSheet.create({
  page: { fontFamily: "Poppins", padding: 30 },
  card: { position: "relative", width: "100%", padding: 40 },
  background: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, objectFit: "cover" },
  overlay: { padding: 15, backgroundColor: "rgba(0,0,0,0.33)", color: "white", height: 400 },
  logo: { width: 105 },
  title: { textAlign: "center", fontWeight: 100, fontSize: 28, marginTop: 10 },
  subtitle: { textAlign: "center", fontStyle: "italic", fontWeight: 300, color: beige, marginTop: 6 },
  workshop: { alignSelf: "center", marginTop: 16, borderBottomWidth: 2, borderBottomColor: beige, color: beige, fontWeight: 100, fontSize: 20, textAlign: "center" },
  rows: { marginHorizontal: 40, marginTop: 18 },
  row: { flexDirection: "row", marginTop: 16, fontSize: 16 },
  label: { width: "20%", paddingRight: 16, color: beige, fontWeight: 300 },
  value: { flex: 1, borderBottomWidth: 2, borderBottomColor: beige, color: beige, fontWeight: 300 },
  footer: { marginTop: 22, fontStyle: "italic", fontWeight: 300, color: beige },
});

export interface IVoucherPdf {
  warsztatNazwa: string;
  od: string;
  dla: string;
  kod: string;
}

/** Gift voucher attached to the purchase e-mail (replaces the old html-pdf/PhantomJS rendering). */
export async function renderVoucherPdf({ warsztatNazwa, od, dla, kod }: IVoucherPdf): Promise<Buffer> {
  return renderToBuffer(
    <Document title={`Voucher ${kod}`} author="Bottega da Kris">
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
          <Image src={background} style={styles.background} />
          <View style={styles.overlay}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
            <Image src={logo} style={styles.logo} />
            <Text style={styles.title}>VOUCHER</Text>
            <Text style={styles.subtitle}>Na warsztaty ceramiczne w Bottega da Kris</Text>
            <Text style={styles.workshop}>{warsztatNazwa}</Text>

            <View style={styles.rows}>
              {[["od:", od], ["dla:", dla], ["kod:", kod]].map(([label, value]) => (
                <View key={label} style={styles.row}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
              ))}
              <Text style={styles.footer}>Umów termin na bottegadakris.pl</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>,
  );
}

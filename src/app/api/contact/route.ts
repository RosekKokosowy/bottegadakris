import { NextResponse } from "next/server";
import { escapeHtml, MAIL_OFFICE, sendMail } from "@/lib/mail.inc";
import { log } from "@/lib/trace.inc";
import { IContactRequest } from "@/types/IContact";

export async function POST(req: Request) {
    try {
        const { email, telefon, imieNazwisko, wiadomosc } = (await req.json()) as IContactRequest;
        if (!email || !telefon || !imieNazwisko || !wiadomosc) {
            return NextResponse.json({ message: "Uzupełnij wszystkie pola" }, { status: 400 });
        }

        const success = await sendMail({
            to: MAIL_OFFICE,
            replyTo: email,
            subject: "Formularz kontaktowy,",
            html: `Wiadomość od klienta z formularza kontaktowego na stronie<br /><b>${escapeHtml(imieNazwisko)}</b>: <br />${escapeHtml(wiadomosc).replace(/\n/g, "<br />")}<br /><hr /><br />Dane kontaktowe: <br />Adres e-mail: <b>${escapeHtml(email)}</b><br />Numer telefonu: <b>${escapeHtml(telefon)}</b>`,
        });

        return NextResponse.json({ success }, { status: success ? 200 : 500 });
    } catch (error) {
        log("POST /api/contact", error, "Failed to send contact form.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getPaymentDetails, IPaymentKind } from "@/lib/payment.inc";
import { log } from "@/lib/trace.inc";

export async function POST(req: Request) {
    try {
        const { uid, id, rodzaj } = (await req.json()) as { uid?: string; id?: string; rodzaj?: string };
        if (!uid || !id || (rodzaj !== "T" && rodzaj !== "V")) return NextResponse.json({ message: "Błędny rodzaj zapisu" }, { status: 400 });

        const details = await getPaymentDetails({ uid, id: Number(id), rodzaj: rodzaj as IPaymentKind });
        return details ? NextResponse.json(details) : NextResponse.json({ message: "Nie znaleziono płatności" }, { status: 404 });
    } catch (error) {
        log("POST /api/payment/details", error, "Failed to fetch payment details.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

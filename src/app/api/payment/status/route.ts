import { NextResponse } from "next/server";
import { handlePaymentNotification, IPaymentKind } from "@/lib/payment.inc";
import { log } from "@/lib/trace.inc";

/** Przelewy24 urlStatus notification (registered in lib/payment.inc.ts). */
export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") ?? "";
    const id = Number(searchParams.get("id"));
    const rodzaj = searchParams.get("r");

    try {
        if (!uid || !id || (rodzaj !== "T" && rodzaj !== "V")) return NextResponse.json({ message: "Invalid notification" }, { status: 400 });

        await handlePaymentNotification({ uid, id, rodzaj: rodzaj as IPaymentKind }, await req.json());
        return NextResponse.json({ success: true });
    } catch (error) {
        log("POST /api/payment/status", error, `Payment notification failed for ${rodzaj}:${id}.`);
        return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
    }
}

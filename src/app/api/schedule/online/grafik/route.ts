import { NextResponse } from "next/server";
import { getGrafik, WorkshopNotFoundError } from "@/lib/schedule.inc";
import { log } from "@/lib/trace.inc";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const dataOd = searchParams.get("dataOd") ?? "";
    const ileDni = Math.min(Number(searchParams.get("ileDni") ?? 5), 31);
    const zapisId = Number(searchParams.get("zapisId")) || undefined;
    const warsztatTyp = Number(searchParams.get("warsztatTyp")) || undefined;

    if (!DATE.test(dataOd) || !(ileDni > 0)) return NextResponse.json({ error: "Nieprawidłowe parametry" }, { status: 400 });

    try {
        return NextResponse.json(await getGrafik({ dataOd, ileDni, zapisId, warsztatTyp }));
    } catch (error) {
        if (error instanceof WorkshopNotFoundError) return NextResponse.json({ error: error.message }, { status: 404 });
        log("GET /api/schedule/online/grafik", error, "Failed to build the booking calendar.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

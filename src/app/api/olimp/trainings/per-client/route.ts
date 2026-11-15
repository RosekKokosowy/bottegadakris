import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { getClientBookings } from "@/lib/training.inc";

export const GET = withAdmin("GET /api/olimp/trainings/per-client", async (req: Request) => {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Brak klienta" }, { status: 400 });
    return NextResponse.json({ data: await getClientBookings(id) });
});

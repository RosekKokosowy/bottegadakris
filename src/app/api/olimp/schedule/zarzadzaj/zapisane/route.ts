import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { getDaySchedule } from "@/lib/schedule.inc";

export const GET = withAdmin("GET /api/olimp/schedule/zarzadzaj/zapisane", async (req: Request) => {
    const data = new URL(req.url).searchParams.get("data") ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return NextResponse.json({ error: "Nieprawidłowa data" }, { status: 400 });
    return NextResponse.json(await getDaySchedule(data));
});

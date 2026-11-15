import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { saveWorkingHours } from "@/lib/schedule.inc";

/** Saves one weekday's working hours and breaks. */
export const POST = withAdmin("POST /api/olimp/schedule", async (req: Request) => {
    const error = await saveWorkingHours(await req.json());
    return error ? NextResponse.json({ error }, { status: 400 }) : NextResponse.json({ sukces: true });
});

import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { getWorkingHours } from "@/lib/schedule.inc";

export const GET = withAdmin("GET /api/olimp/schedule/zarzadzaj/godziny-pracy", async () => NextResponse.json(await getWorkingHours()));

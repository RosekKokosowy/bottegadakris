import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { cancelBookings } from "@/lib/training.inc";

export const POST = withAdmin("POST /api/olimp/trainings/remove", async (req: Request) => {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ message: "No IDs provided or invalid format" }, { status: 400 });

    const { processedIds, errors } = await cancelBookings(ids.map(Number));
    if (errors.length === 0) return NextResponse.json({ success: true, processedIds, message: `Successfully removed ${processedIds.length} workshop(s)` });
    if (processedIds.length > 0) return NextResponse.json({ success: true, processedIds, errors, message: `Partially successful: ${processedIds.length} removed, ${errors.length} failed` }, { status: 206 });
    return NextResponse.json({ success: false, errors, message: "Failed to remove any workshops" }, { status: 400 });
});

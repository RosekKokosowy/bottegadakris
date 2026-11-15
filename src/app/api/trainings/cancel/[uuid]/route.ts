import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo/config";
import { log } from "@/lib/trace.inc";
import { cancelBookingByUuid } from "@/lib/training.inc";

/** Link from the booking confirmation e-mail: cancels the booking and shows the result page. */
export async function GET(_req: Request, { params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;

    try {
        await cancelBookingByUuid(uuid);
    } catch (error) {
        log("GET /api/trainings/cancel/[uuid]", error, `Failed to cancel booking ${uuid}.`);
    }

    // The result page reads the booking status itself, so it is shown in both cases.
    return NextResponse.redirect(`${SITE_URL}/warsztaty/anuluj/${encodeURIComponent(uuid)}`);
}

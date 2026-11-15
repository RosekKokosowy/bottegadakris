import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { setBookingPaid } from "@/lib/training.inc";

/** Records the on-site payment of the rest of a booking. */
export const POST = withAdmin("POST /api/olimp/trainings/set-payed", async (req: Request) => {
    const { id, oplacony, doplata } = await req.json();
    await setBookingPaid({ id: Number(id), doplata: Number(doplata) || 0 });
    return NextResponse.json({ oplacony, id });
});

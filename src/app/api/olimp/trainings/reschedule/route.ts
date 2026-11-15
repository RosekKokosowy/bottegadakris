import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { BookingError, rescheduleBooking } from "@/lib/training.inc";

export const PUT = withAdmin("PUT /api/olimp/trainings/reschedule", async (req: Request) => {
    const { id, data, godzina } = await req.json();
    try {
        await rescheduleBooking({ id: Number(id), data, godzina });
        return NextResponse.json({ success: true, id });
    } catch (error) {
        if (error instanceof BookingError) return NextResponse.json({ message: error.message }, { status: 400 });
        throw error;
    }
});

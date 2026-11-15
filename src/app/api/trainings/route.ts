import { NextResponse } from "next/server";
import { log } from "@/lib/trace.inc";
import { BookingError, createBooking } from "@/lib/training.inc";
import { getWorkshops } from "@/lib/workshop.inc";
import { IBookingRequest } from "@/types/IBooking";

export async function GET() {
    try {
        return NextResponse.json(await getWorkshops());
    } catch (error) {
        log("GET /api/trainings", error, "Failed to fetch workshops.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const id = await createBooking((await req.json()) as IBookingRequest);
        return NextResponse.json({ success: true, id });
    } catch (error) {
        if (error instanceof BookingError) return NextResponse.json({ message: error.message }, { status: 400 });
        log("POST /api/trainings", error, "Failed to create booking.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

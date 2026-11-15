import { NextResponse } from "next/server";
import { log } from "@/lib/trace.inc";
import { createVoucher, VoucherError } from "@/lib/voucher.inc";
import { IVoucherRequest } from "@/types/IVoucher";

export async function POST(req: Request) {
    try {
        return NextResponse.json(await createVoucher((await req.json()) as IVoucherRequest));
    } catch (error) {
        if (error instanceof VoucherError) return NextResponse.json({ message: error.message }, { status: 400 });
        log("POST /api/voucher", error, "Failed to create voucher.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

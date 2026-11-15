import { NextResponse } from "next/server";
import { log } from "@/lib/trace.inc";
import { findVoucherByCode } from "@/lib/voucher.inc";

export async function GET(req: Request) {
    const code = new URL(req.url).searchParams.get("code") ?? "";

    try {
        const voucher = code.length === 8 ? await findVoucherByCode(code) : undefined;
        return voucher ? NextResponse.json(voucher) : NextResponse.json({}, { status: 400 });
    } catch (error) {
        log("GET /api/voucher/code-to-training", error, "Failed to check voucher code.");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

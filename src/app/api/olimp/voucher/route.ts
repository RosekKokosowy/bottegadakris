import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { getVouchers } from "@/lib/voucher.inc";

export const GET = withAdmin("GET /api/olimp/voucher", async (req: Request) => {
    const { searchParams } = new URL(req.url);
    return NextResponse.json(await getVouchers({ dataOd: searchParams.get("dataOd") ?? "", dataDo: searchParams.get("dataDo") ?? "", client: searchParams.get("client") || undefined }));
});

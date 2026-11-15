import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { getPaymentReport } from "@/lib/payment.inc";

export const GET = withAdmin("GET /api/olimp/payment/list", async (req: Request) => {
    const { searchParams } = new URL(req.url);
    return NextResponse.json(await getPaymentReport({ dataOd: searchParams.get("dataOd") ?? "", dataDo: searchParams.get("dataDo") ?? "", client: searchParams.get("client") || undefined }));
});

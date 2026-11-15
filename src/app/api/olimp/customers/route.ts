import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { getCustomers } from "@/lib/customer.inc";

export const GET = withAdmin("GET /api/olimp/customers", async (req: Request) => NextResponse.json(await getCustomers(new URL(req.url).searchParams.get("search") || undefined)));

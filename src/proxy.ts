import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/** The admin panel (/olimp/*) and its API (/api/olimp/*) require a signed-in administrator. */
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/olimp", request.url));
}

// /olimp itself is the login page and stays public.
export const config = { matcher: ["/olimp/:path+", "/api/olimp/:path*"] };

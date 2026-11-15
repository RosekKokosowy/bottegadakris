import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { findBlogPosts } from "@/lib/blog.inc";
import { IBlogStatus } from "@/types/IBlogPost";

export const GET = withAdmin("GET /api/olimp/blog", async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "") as IBlogStatus | "";
    return NextResponse.json(await findBlogPosts({ status, search: searchParams.get("search") || undefined }));
});

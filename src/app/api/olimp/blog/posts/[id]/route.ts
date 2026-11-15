import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { deleteBlogPost, findBlogPostById, SlugTakenError, updateBlogPost } from "@/lib/blog.inc";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withAdmin("GET /api/olimp/blog/posts/[id]", async (_req: Request, { params }: Ctx) => {
    const post = await findBlogPostById(Number((await params).id));
    return post ? NextResponse.json(post) : NextResponse.json({ message: "Not found" }, { status: 404 });
});

export const PUT = withAdmin("PUT /api/olimp/blog/posts/[id]", async (req: Request, { params }: Ctx) => {
    const id = Number((await params).id);
    const body = await req.json();
    if (!body.tytul || !body.slug || !body.tresc) return NextResponse.json({ message: "Uzupełnij tytuł, slug i treść" }, { status: 400 });
    try {
        await updateBlogPost(id, body);
        return NextResponse.json({ id });
    } catch (error) {
        if (error instanceof SlugTakenError) return NextResponse.json({ message: error.message }, { status: 409 });
        throw error;
    }
});

export const DELETE = withAdmin("DELETE /api/olimp/blog/posts/[id]", async (_req: Request, { params }: Ctx) => {
    const id = Number((await params).id);
    return (await deleteBlogPost(id)) ? NextResponse.json({ id }) : NextResponse.json({ message: "Not found" }, { status: 404 });
});

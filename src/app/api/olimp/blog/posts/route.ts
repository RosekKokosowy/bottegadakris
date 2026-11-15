import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { createBlogPost, SlugTakenError } from "@/lib/blog.inc";

export const POST = withAdmin("POST /api/olimp/blog/posts", async (req: Request) => {
    const body = await req.json();
    if (!body.tytul || !body.slug || !body.tresc) return NextResponse.json({ message: "Uzupełnij tytuł, slug i treść" }, { status: 400 });
    try {
        return NextResponse.json({ id: await createBlogPost(body) }, { status: 201 });
    } catch (error) {
        if (error instanceof SlugTakenError) return NextResponse.json({ message: error.message }, { status: 409 });
        throw error;
    }
});

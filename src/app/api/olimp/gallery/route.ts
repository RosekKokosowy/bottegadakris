import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { createGalleryItem, findGalleryItems } from "@/lib/gallery.inc";

export const GET = withAdmin("GET /api/olimp/gallery", async () => NextResponse.json(await findGalleryItems()));

export const POST = withAdmin("POST /api/olimp/gallery", async (req: Request) => {
    const body = await req.json();
    if (!body.src || !body.alt || !body.title || !body.description || !body.size) return NextResponse.json({ message: "Uzupełnij wymagane pola" }, { status: 400 });
    return NextResponse.json({ id: await createGalleryItem(body) }, { status: 201 });
});

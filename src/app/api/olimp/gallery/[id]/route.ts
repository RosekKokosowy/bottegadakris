import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { deleteGalleryItem, findGalleryItem, updateGalleryItem } from "@/lib/gallery.inc";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withAdmin("GET /api/olimp/gallery/[id]", async (_req: Request, { params }: Ctx) => {
    const item = await findGalleryItem(Number((await params).id));
    return item ? NextResponse.json(item) : NextResponse.json({ message: "Not found" }, { status: 404 });
});

export const PUT = withAdmin("PUT /api/olimp/gallery/[id]", async (req: Request, { params }: Ctx) => {
    const id = Number((await params).id);
    return (await updateGalleryItem(id, await req.json())) ? NextResponse.json({ id }) : NextResponse.json({ message: "Not found" }, { status: 404 });
});

export const DELETE = withAdmin("DELETE /api/olimp/gallery/[id]", async (_req: Request, { params }: Ctx) => {
    const id = Number((await params).id);
    return (await deleteGalleryItem(id)) ? NextResponse.json({ id }) : NextResponse.json({ message: "Not found" }, { status: 404 });
});

import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/authentication.inc";
import { saveFiles } from "@/lib/files.inc";

export const POST = withAdmin("POST /api/olimp/files/upload", async (req: Request) => {
    const files = (await req.formData()).getAll("files").filter((file): file is File => file instanceof File);
    if (files.length === 0) return NextResponse.json({ message: "No files uploaded" }, { status: 400 });
    return NextResponse.json({ urls: await saveFiles(files) });
});

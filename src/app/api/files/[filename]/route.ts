import { NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/files.inc";
import { log } from "@/lib/trace.inc";

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;

    try {
        const file = await readUploadedFile(filename);
        if (!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

        // SVG can carry script, so it is downloaded rather than rendered inline.
        const inline = file.contentType.startsWith("image/") && file.contentType !== "image/svg+xml";
        return new NextResponse(new Uint8Array(file.body), {
            headers: {
                "Content-Type": file.contentType,
                "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(file.originalName)}"`,
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        log("GET /api/files/[filename]", error, `Failed to read file ${filename}.`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import "server-only";

import { randomInt } from "crypto";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
  ".avif": "image/avif", ".pdf": "application/pdf", ".mp4": "video/mp4", ".txt": "text/plain",
};

/** `<8 random digits>_<timestamp>_<sanitized name>`, same scheme as the old backend so stored links keep working. */
function generateFileName(originalName: string) {
  const name = originalName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return `${randomInt(10000000, 100000000)}_${Date.now()}_${name}`;
}

/** Saves uploads and returns their links (`/files/<name>`). */
export async function saveFiles(files: File[]): Promise<string[]> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    const fileName = generateFileName(file.name);
    await writeFile(path.join(UPLOAD_DIR, fileName), Buffer.from(await file.arrayBuffer()));
    urls.push(`/files/${fileName}`);
  }
  return urls;
}

/** Reads an uploaded file; returns undefined for unknown names or anything outside the upload folder. */
export async function readUploadedFile(fileName: string) {
  const safeName = path.basename(fileName);
  const filePath = path.join(UPLOAD_DIR, safeName);
  if (safeName !== fileName || !filePath.startsWith(UPLOAD_DIR + path.sep)) return undefined;

  try {
    if (!(await stat(filePath)).isFile()) return undefined;
  } catch {
    return undefined;
  }

  const ext = path.extname(safeName).toLowerCase();
  return {
    body: await readFile(filePath),
    contentType: MIME[ext] ?? "application/octet-stream",
    originalName: safeName.split("_").slice(2).join("_") || safeName,
  };
}

import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import { IBlogPost, IBlogPostRequest, IBlogStatus } from "@/types/IBlogPost";
import { execute, jsonArray, select } from "./db.inc";

export const BLOG_TAG = "blog";

const SELECT_POST = `
  SELECT b.*,
    (SELECT JSON_ARRAYAGG(bp.url_pliku) FROM blog_pliki bp WHERE bp.blog_id = b.id) as attachments
  FROM blog b
`;

const parse = (post: IBlogPost): IBlogPost => ({ ...post, attachments: jsonArray<string>(post.attachments) });

export async function findBlogPosts({ status, search }: { status?: IBlogStatus | ""; search?: string } = {}): Promise<IBlogPost[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (status) {
    where.push("b.status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(b.tytul LIKE ? OR b.slug LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const rows = await select<IBlogPost>(`${SELECT_POST} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY b.data_utworzenia DESC`, params);
  return rows.map(parse);
}

async function findBlogPostBy(column: "slug" | "id", value: string | number, status?: IBlogStatus): Promise<IBlogPost | undefined> {
  const params: unknown[] = [value];
  let sql = `${SELECT_POST} WHERE b.${column} = ?`;
  if (status) {
    sql += " AND b.status = ?";
    params.push(status);
  }
  const [post] = await select<IBlogPost>(`${sql} LIMIT 1`, params);
  return post && parse(post);
}

export const findBlogPostById = (id: number) => findBlogPostBy("id", id);

/* ───────────── public, cached ───────────── */
export const getPublishedPosts = unstable_cache(() => findBlogPosts({ status: "AKTYWNY" }), [BLOG_TAG, "list"], { tags: [BLOG_TAG], revalidate: 3600 });

export const getPublishedPost = unstable_cache((slug: string) => findBlogPostBy("slug", slug, "AKTYWNY"), [BLOG_TAG, "slug"], { tags: [BLOG_TAG], revalidate: 3600 });

/* ───────────── admin ───────────── */
export class SlugTakenError extends Error {
  constructor() {
    super("Slug musi być unikalny");
  }
}

async function saveAttachments(blogId: number, attachments?: string[]) {
  await execute(`DELETE FROM blog_pliki WHERE blog_id=?`, [blogId]);
  for (const url of attachments ?? []) {
    await execute(`INSERT INTO blog_pliki (blog_id, url_pliku) VALUES (?, ?)`, [blogId, url]);
  }
}

export async function createBlogPost({ tytul, slug, tresc, status, attachments }: IBlogPostRequest): Promise<number> {
  const [existing] = await select<{ id: number }>(`SELECT id FROM blog WHERE slug = ? LIMIT 1`, [slug]);
  if (existing) throw new SlugTakenError();

  const { insertId } = await execute(`INSERT INTO blog (tytul, slug, tresc, status) VALUES (?, ?, ?, ?)`, [tytul, slug, tresc, status ?? "AKTYWNY"]);
  await saveAttachments(insertId, attachments);
  revalidateTag(BLOG_TAG, "max");
  return insertId;
}

export async function updateBlogPost(id: number, { tytul, slug, tresc, status, attachments }: IBlogPostRequest): Promise<void> {
  const [existing] = await select<{ id: number }>(`SELECT id FROM blog WHERE slug = ? AND id != ? LIMIT 1`, [slug, id]);
  if (existing) throw new SlugTakenError();

  // The old editor never sent `status`, so keep the stored one unless it is given.
  await execute(`UPDATE blog SET tytul=?, slug=?, tresc=?, status=COALESCE(?, status) WHERE id=?`, [tytul, slug, tresc, status ?? null, id]);
  await saveAttachments(id, attachments);
  revalidateTag(BLOG_TAG, "max");
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  await execute(`DELETE FROM blog_pliki WHERE blog_id = ?`, [id]);
  const { affectedRows } = await execute(`DELETE FROM blog WHERE id = ?`, [id]);
  revalidateTag(BLOG_TAG, "max");
  return affectedRows > 0;
}

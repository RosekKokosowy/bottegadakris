import "server-only";

import mysql, { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

const globalForDb = globalThis as unknown as { bottegaPool?: Pool };

// One pool per process; dev hot-reload would otherwise open a new pool on every change.
const pool =
  globalForDb.bottegaPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.bottegaPool = pool;

/** Runs a parameterized query (`?` placeholders). Never interpolate user input into `sql`. */
export async function select<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.query<RowDataPacket[]>(sql, params);
  return rows as T[];
}

export async function execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const [result] = await pool.query<ResultSetHeader>(sql, params);
  return result;
}

/** MySQL returns DECIMAL as string; this keeps money arithmetic numeric. */
export const num = (value: unknown): number => Number(value ?? 0) || 0;

/** JSON_ARRAYAGG comes back as a string on MariaDB and already parsed on MySQL. */
export const jsonArray = <T>(value: unknown): T[] => {
  if (!value) return [];
  return (typeof value === "string" ? JSON.parse(value) : value) as T[];
};

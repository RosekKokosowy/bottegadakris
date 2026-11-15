import "server-only";

import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { select } from "./db.inc";
import { log } from "./trace.inc";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        haslo: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.haslo) return null;

        try {
          // Passwords are stored as MariaDB PASSWORD() hashes by the old system.
          const [user] = await select<{ id: number; login: string; imie: string; nazwisko: string }>(
            `SELECT id, login, imie, nazwisko FROM uzytkownicy WHERE status='AKTYWNY' AND login=? AND PASSWORD(?)=haslo LIMIT 1`,
            [credentials.login, credentials.haslo],
          );
          return user ? { id: String(user.id), login: user.login, name: `${user.imie ?? ""} ${user.nazwisko ?? ""}`.trim() } : null;
        } catch (error) {
          log("[Auth]", error, "authorize() has failed to execute");
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  pages: { signIn: "/olimp" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.login = user.login;
      return token;
    },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.sub ?? "", login: token.login ?? "" };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Wraps an admin route handler: answers 401 without a session (the proxy already blocks these paths,
 * this keeps the API safe on its own) and turns unexpected errors into a logged 500.
 */
export function withAdmin<A extends unknown[]>(src: string, handler: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      return await handler(...args);
    } catch (error) {
      log(src, error, "Admin request failed.");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

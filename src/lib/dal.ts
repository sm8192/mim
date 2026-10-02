import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { sql } from "@/lib/db";

/**
 * Reads and verifies the session from the cookie. Redirects to /login when
 * there is no valid session. Memoized per render pass with React cache().
 */
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId, username: session.username };
});

/**
 * Returns the current user (safe columns only) or null. Does not redirect,
 * so it can be used for optional/optimistic reads.
 */
export const getUser = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);
  if (!session?.userId) return null;

  try {
    const rows = await sql`
      SELECT id, username, created_at
      FROM users
      WHERE id = ${session.userId}
      LIMIT 1
    `;
    const user = rows[0];
    if (!user) return null;

    return {
      id: String(user.id),
      username: user.username as string,
      createdAt: user.created_at as string,
    };
  } catch {
    return null;
  }
});

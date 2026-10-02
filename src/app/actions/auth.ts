"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { AuthFormSchema, type AuthFormState } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session-cookie";

const SALT_ROUNDS = 10;

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validated = AuthFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: z_fieldErrors(validated.error) };
  }

  const { username, password } = validated.data;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let userId: string;
  try {
    const rows = await sql`
      INSERT INTO users (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id
    `;
    userId = String(rows[0].id);
  } catch (error: unknown) {
    // 23505 = unique_violation (username already taken)
    if (isUniqueViolation(error)) {
      return { errors: { username: ["That username is already taken."] } };
    }
    console.error("signup failed", error);
    return { message: "Something went wrong. Please try again." };
  }

  await createSession(userId, username);
  redirect("/dashboard");
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validated = AuthFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // Keep the message generic so we don't reveal which field was wrong.
  const invalidMessage = "Invalid username or password.";

  if (!validated.success) {
    return { message: invalidMessage };
  }

  const { username, password } = validated.data;

  let userId: string | null = null;
  let passwordHash: string | null = null;
  try {
    const rows = await sql`
      SELECT id, password_hash
      FROM users
      WHERE lower(username) = lower(${username})
      LIMIT 1
    `;
    if (rows[0]) {
      userId = String(rows[0].id);
      passwordHash = rows[0].password_hash as string;
    }
  } catch (error) {
    console.error("login lookup failed", error);
    return { message: "Something went wrong. Please try again." };
  }

  // Always run a compare to keep timing roughly constant whether or not the
  // user exists, which avoids leaking valid usernames via response time.
  const dummyHash = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8f0Q3h0f6qGv3Z9z1aZ1aZ1aZ1aZ1";
  const ok = await bcrypt.compare(password, passwordHash ?? dummyHash);

  if (!userId || !passwordHash || !ok) {
    return { message: invalidMessage };
  }

  await createSession(userId, username);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

// Minimal field-error extraction compatible with zod v4.
function z_fieldErrors(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): { username?: string[]; password?: string[] } {
  const result: { username?: string[]; password?: string[] } = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key === "username" || key === "password") {
      (result[key] ??= []).push(issue.message);
    }
  }
  return result;
}

import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@/lib/definitions";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error(
    "SESSION_SECRET is not set. Generate one with `openssl rand -base64 32` " +
      "and add it to .env.local (see README).",
  );
}

const encodedKey = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE = "session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined,
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    // Invalid or expired token.
    return null;
  }
}

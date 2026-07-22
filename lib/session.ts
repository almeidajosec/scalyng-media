import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "scalyng_session";
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function getSecret(): Uint8Array {
  const pw = process.env.APP_PASSWORD;
  if (!pw) throw new Error("APP_PASSWORD env var is not set");
  return new TextEncoder().encode(pw + "|scalyng-media-v1");
}

export async function createSessionToken(): Promise<string> {
  return await new SignJWT({ authed: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.authed === true;
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.APP_PASSWORD || "";
  if (!expected) return false;
  return input === expected;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

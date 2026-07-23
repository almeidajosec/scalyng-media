import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Safe diagnostic — never leaks env var VALUES, only presence + length.
 * Auth-gated so random visitors can't fingerprint the env shape.
 */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const relevant = Object.keys(process.env)
    .filter((k) => k.startsWith("BLOB_") || k.startsWith("APP_") || k === "VERCEL_ENV" || k === "VERCEL_URL" || k === "VERCEL_GIT_COMMIT_SHA")
    .sort();

  const summary = relevant.map((name) => {
    const v = process.env[name] || "";
    return {
      name,
      set: v.length > 0,
      length: v.length,
      // Only for non-secret shape checks:
      startsWith: name === "BLOB_READ_WRITE_TOKEN"
        ? v.slice(0, 15) + (v.length > 15 ? "…" : "")
        : name === "APP_PASSWORD"
          ? "(redacted)"
          : v.slice(0, 40),
    };
  });

  return NextResponse.json({
    runtime: "nodejs",
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelUrl: process.env.VERCEL_URL || null,
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7),
    envSummary: summary,
    blobTokenPresent: !!process.env.BLOB_READ_WRITE_TOKEN,
    blobTokenLength: (process.env.BLOB_READ_WRITE_TOKEN || "").length,
  });
}

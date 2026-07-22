import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { deleteByUrl } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const url = typeof body?.url === "string" ? body.url : null;
  if (!url) return NextResponse.json({ error: "missing_url" }, { status: 400 });

  await deleteByUrl(url);
  return NextResponse.json({ ok: true });
}

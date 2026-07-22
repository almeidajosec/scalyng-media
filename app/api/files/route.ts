import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { listAll, listByClient } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = req.nextUrl.searchParams.get("client");
  const files = client ? await listByClient(client) : await listAll();
  return NextResponse.json({ files });
}

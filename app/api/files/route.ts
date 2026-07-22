import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listAll, listByClient } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const client = req.nextUrl.searchParams.get("client");
  const files = client ? await listByClient(client) : await listAll();
  return NextResponse.json({ files });
}

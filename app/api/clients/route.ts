import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listClients } from "@/lib/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const clients = await listClients();
  return NextResponse.json({ clients });
}

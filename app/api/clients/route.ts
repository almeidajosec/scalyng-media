import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { listClients } from "@/lib/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const clients = await listClients();
  return NextResponse.json({ clients });
}

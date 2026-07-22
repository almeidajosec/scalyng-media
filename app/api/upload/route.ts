import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { uploadToBlob } from "@/lib/blob";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const clientRaw = form.get("client");
  if (typeof clientRaw !== "string" || !clientRaw.trim()) {
    return NextResponse.json({ error: "missing_client" }, { status: 400 });
  }
  const clientSlug = slugify(clientRaw);
  if (!clientSlug) return NextResponse.json({ error: "invalid_client" }, { status: 400 });

  const files = form.getAll("files").filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "no_files" }, { status: 400 });
  }

  const uploaded: { name: string; url: string }[] = [];
  const errors: { name: string; error: string }[] = [];

  for (const file of files) {
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      const res = await uploadToBlob(clientSlug, file.name, buf, file.type || undefined);
      uploaded.push({ name: file.name, url: res.url });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ name: file.name, error: msg });
    }
  }

  // If ALL uploads failed, return 500 so the client shows a real error
  // instead of a silent success.
  const status = uploaded.length === 0 && errors.length > 0 ? 500 : 200;
  return NextResponse.json({ client: clientSlug, uploaded, errors }, { status });
}

export const dynamic = "force-dynamic";

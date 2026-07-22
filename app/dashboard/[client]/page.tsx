import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { listByClient } from "@/lib/blob";
import { slugify } from "@/lib/utils";
import { UploadZone } from "@/components/UploadZone";
import { FileGrid } from "@/components/FileGrid";
import { CopyAllJsonButton } from "@/components/CopyAllJsonButton";

export const dynamic = "force-dynamic";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client } = await params;
  const clientSlug = slugify(decodeURIComponent(client));

  let files: Awaited<ReturnType<typeof listByClient>> = [];
  let error: string | null = null;
  try {
    files = await listByClient(clientSlug);
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Failed to load files";
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          All clients
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{clientSlug}</h1>
            <p className="text-sm text-slate-500">
              {files.length} file{files.length === 1 ? "" : "s"}
            </p>
          </div>
          <CopyAllJsonButton files={files} />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300">
          Can&apos;t reach Blob storage: {error}.
        </div>
      )}

      <UploadZone clientSlug={clientSlug} />

      <FileGrid files={files} />
    </div>
  );
}

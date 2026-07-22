"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { cn, humanSize } from "@/lib/utils";

type ItemState = "pending" | "uploading" | "done" | "error";
type Item = { file: File; state: ItemState; url?: string; error?: string };

export function UploadZone({ clientSlug }: { clientSlug: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (arr.length === 0) return;

      setItems((prev) => [...prev, ...arr.map((f) => ({ file: f, state: "pending" as ItemState }))]);

      // Upload in parallel batches of 4 to avoid overwhelming the server
      const batchSize = 4;
      for (let i = 0; i < arr.length; i += batchSize) {
        const batch = arr.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (file) => {
            setItems((prev) =>
              prev.map((it) => (it.file === file ? { ...it, state: "uploading" } : it))
            );
            try {
              const fd = new FormData();
              fd.append("client", clientSlug);
              fd.append("files", file);
              const res = await fetch("/api/upload", { method: "POST", body: fd });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "upload_failed");
              const url = data.uploaded?.[0]?.url as string | undefined;
              setItems((prev) =>
                prev.map((it) => (it.file === file ? { ...it, state: "done", url } : it))
              );
            } catch (e: unknown) {
              const msg = e instanceof Error ? e.message : String(e);
              setItems((prev) =>
                prev.map((it) => (it.file === file ? { ...it, state: "error", error: msg } : it))
              );
            }
          })
        );
      }
      router.refresh();
    },
    [clientSlug, router]
  );

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-brand-accent bg-indigo-50 dark:bg-indigo-950"
            : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <Upload className="h-8 w-8 text-slate-400 mb-2" />
        <div className="text-sm font-medium">Drop files or click to upload</div>
        <div className="text-xs text-slate-500 mt-1">
          Uploaded to <code className="rounded bg-slate-200 dark:bg-slate-800 px-1">{clientSlug}/</code>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onFiles(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <ul className="space-y-1 text-xs">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between rounded border border-slate-200 dark:border-slate-800 px-2 py-1">
              <span className="truncate">
                {it.file.name} <span className="text-slate-500">({humanSize(it.file.size)})</span>
              </span>
              <span
                className={cn(
                  "ml-2 shrink-0",
                  it.state === "done" && "text-emerald-600",
                  it.state === "error" && "text-red-600",
                  it.state === "uploading" && "text-slate-500"
                )}
              >
                {it.state === "pending" && "queued"}
                {it.state === "uploading" && "uploading…"}
                {it.state === "done" && "done"}
                {it.state === "error" && (it.error || "error")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

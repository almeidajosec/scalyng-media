import { listAll } from "@/lib/blob";

export type ClientSummary = {
  slug: string;
  fileCount: number;
  totalBytes: number;
  latestUpload?: string;
};

export async function listClients(): Promise<ClientSummary[]> {
  const files = await listAll();
  const byClient = new Map<string, ClientSummary>();
  for (const f of files) {
    const s = byClient.get(f.clientSlug) ?? {
      slug: f.clientSlug,
      fileCount: 0,
      totalBytes: 0,
      latestUpload: undefined as string | undefined,
    };
    s.fileCount += 1;
    s.totalBytes += f.size;
    if (!s.latestUpload || f.uploadedAt > s.latestUpload) s.latestUpload = f.uploadedAt;
    byClient.set(f.clientSlug, s);
  }
  return Array.from(byClient.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

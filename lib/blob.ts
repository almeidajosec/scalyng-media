import { put, list, del, type ListBlobResult, type PutBlobResult } from "@vercel/blob";

export type StoredFile = {
  pathname: string;
  url: string;
  downloadUrl?: string;
  size: number;
  uploadedAt: string;
  clientSlug: string;
  filename: string;
};

function splitKey(pathname: string): { client: string; filename: string } {
  const idx = pathname.indexOf("/");
  if (idx === -1) return { client: "misc", filename: pathname };
  return { client: pathname.slice(0, idx), filename: pathname.slice(idx + 1) };
}

export async function uploadToBlob(
  clientSlug: string,
  filename: string,
  body: Buffer | Blob | ArrayBuffer,
  contentType?: string
): Promise<PutBlobResult> {
  const key = `${clientSlug}/${filename}`;
  return await put(key, body, {
    access: "public",
    addRandomSuffix: false,
    contentType,
  });
}

export async function listAll(prefix?: string): Promise<StoredFile[]> {
  const files: StoredFile[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res: ListBlobResult = await list({
      prefix,
      cursor,
      limit: 1000,
    });
    for (const b of res.blobs) {
      const { client, filename } = splitKey(b.pathname);
      files.push({
        pathname: b.pathname,
        url: b.url,
        downloadUrl: b.downloadUrl,
        size: b.size,
        uploadedAt: b.uploadedAt.toString(),
        clientSlug: client,
        filename,
      });
    }
    cursor = res.cursor;
  } while (cursor);
  return files;
}

export async function listByClient(clientSlug: string): Promise<StoredFile[]> {
  return listAll(`${clientSlug}/`);
}

export async function deleteByUrl(url: string): Promise<void> {
  await del(url);
}

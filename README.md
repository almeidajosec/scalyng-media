# scalyng-media

Private media host for Scalyng agency ad creatives. Team members sign in with Google, upload files into per-client folders, and get public URLs to feed into Meta Ads, Google Ads, TikTok Ads, and any other platform that fetches images by URL.

**Stack:** Next.js 15 App Router · TypeScript · Tailwind · Auth.js v5 (Google) · Vercel Blob.

---

## First-time setup

You need three things wired up before the app can sign in and store files:

### 1. Google OAuth client

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create a new **OAuth 2.0 Client ID**, type **Web application**.
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local dev)
   - Your Vercel deployment URL, e.g. `https://scalyng-media.vercel.app`
   - Your custom domain if you attach one (e.g. `https://media.scalyng.com`)
4. Under **Authorized redirect URIs**, add the same origins with `/api/auth/callback/google` appended:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://scalyng-media.vercel.app/api/auth/callback/google`
   - `https://media.scalyng.com/api/auth/callback/google`
5. Save. Copy the **Client ID** and **Client Secret**.

If your project is not yet published in the OAuth consent screen, add every team member's email as a test user, or publish the app internally (Google Workspace only).

### 2. Vercel Blob store

1. In the [Vercel dashboard](https://vercel.com), open the `scalyng-media` project.
2. **Storage → Create → Blob**. Name it `scalyng-media-blob` (or anything).
3. Connect the store to this project. Vercel auto-injects `BLOB_READ_WRITE_TOKEN` into the project env vars — you can confirm under **Settings → Environment Variables**.

### 3. Env vars in Vercel

Set the following under **Settings → Environment Variables** (Production + Preview):

| Var | How to get it |
| --- | --- |
| `AUTH_SECRET` | Run `openssl rand -base64 32` locally and paste. |
| `AUTH_GOOGLE_ID` | Client ID from step 1. |
| `AUTH_GOOGLE_SECRET` | Client Secret from step 1. |
| `BLOB_READ_WRITE_TOKEN` | Auto-injected in step 2 (verify present). |
| `ALLOWED_EMAIL_DOMAINS` | `scalyng.com,betterdatatoday.com` |

Redeploy after saving env vars (Vercel → Deployments → last deployment → **Redeploy**).

---

## Local development

```bash
git clone https://github.com/almeidajosec/scalyng-media.git
cd scalyng-media
cp .env.local.example .env.local   # fill in the values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the app works

- **Auth gate** — `signIn` callback rejects any email whose domain is not in `ALLOWED_EMAIL_DOMAINS`.
- **Storage** — Vercel Blob keys are stored as `{client-slug}/{original-filename}`. `addRandomSuffix` is disabled so URLs match filenames 1:1.
- **Clients** — no database. Client list is derived from unique top-level prefixes in the Blob store.
- **Public URLs** — every uploaded file gets a permanent `https://<hash>.public.blob.vercel-storage.com/…` URL. Paste those into Meta Ads `image_url` fields, `asset_feed_spec`, etc.

---

## Directory layout

```
app/
  page.tsx                 # landing / sign-in
  dashboard/
    page.tsx               # clients list
    layout.tsx             # header + user bar
    [client]/page.tsx      # per-client files, upload zone
  api/
    auth/[...nextauth]/    # NextAuth handlers
    upload/                # POST multipart
    files/                 # GET list, POST /delete
    clients/               # GET client summary
components/
  UploadZone.tsx
  FileGrid.tsx
  ClientCard.tsx
  NewClientForm.tsx
  CopyButton.tsx
  CopyAllJsonButton.tsx
  SignInButton.tsx
  UserBar.tsx
  SessionProvider.tsx
lib/
  auth.ts / auth-handlers.ts
  blob.ts                  # put/list/del wrappers
  clients.ts               # derive client list from blob prefixes
  utils.ts                 # slugify, humanSize, isImage, cn
middleware.ts              # protects /dashboard/* and /api/*
```

---

## Adding a new team member

Add their email domain to `ALLOWED_EMAIL_DOMAINS` (comma-separated) and redeploy. Or add the specific email as a test user in the Google OAuth consent screen if you haven't published the app.

---

## Production custom domain

Under Vercel → **Settings → Domains**, attach `media.scalyng.com` (or similar). Update:

- Google OAuth authorised JS origin + redirect URI (see step 1).
- Nothing else — Auth.js reads the host from the incoming request when `trustHost: true` is set.

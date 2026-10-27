# Projects — adding projects today, and the path to an admin dashboard

## 1. How it works now (static site)

The site is a **static export** (`output: "export"`): `npm run build` produces plain HTML in `out/`.
There is no server, database or admin panel yet — so adding or changing a project means
**editing files and redeploying**. It takes a few minutes and needs no special tooling beyond Node and Poppler.

```
public/projects/<slug>/<brochure>.pdf      original PDF (kept as-is, served for viewing/download)
scripts/projects/<slug>.media.mjs          which PDF images/pages become web images
public/projects/<slug>/media/*.webp        generated images (640 / 960 / 1280 / 1920 px)
data/projects/<slug>/media.json            generated sizes (prevents layout shift)
data/projects/<slug>/index.ts              the project content (AR + EN), typed by data/projects/types.ts
data/projects/index.ts                     list of projects shown on the site
lib/projects.ts                            data access used by every page/component
```

### Add a new project (≈ 30–60 minutes)

1. Put the brochure in `public/projects/<folder>/<file>.pdf`.
2. Run `pdfimages -list <file>.pdf` to see the embedded images, then copy
   `scripts/projects/marota-city.media.mjs` to `scripts/projects/<folder>.media.mjs` and map the
   images you want (renderings, plans; use `mask` for 3D drawings with transparency).
3. `npm run project-media -- <folder>` → generates the WebP files and `media.json`.
4. Copy `data/projects/marota-city/index.ts` to `data/projects/<folder>/index.ts` and fill in the
   content in both languages. **Only facts from the brochure or confirmed by the company** —
   every figure has a `pdfPage` field so the page can cite its source.
5. Register it in `data/projects/index.ts`.
6. `npm run build` and upload `out/` (or push — if the host builds from Git).

Useful switches in the project file:

| Field | Effect |
|---|---|
| `status: "draft"` | Hidden from the site (not built) |
| `order` | Position in lists (lower first) |
| `featured: true` | Becomes the large card on /projects and the home-page project |
| `progress` | Status badge, e.g. "قيد التنفيذ" — set only when confirmed |
| `floors` / `gallery` / `documents` | Leave empty to hide the related section |

**Edit / delete:** change or remove the project's folder and its entry in `data/projects/index.ts`, rebuild, redeploy.

## 2. Recommended next step: an admin dashboard (`/admin`)

Goal: the company adds, edits, orders, publishes and deletes projects, uploads images and PDFs,
**without a developer and without redeploying by hand**.

### Recommended architecture

| Piece | Choice | Why |
|---|---|---|
| Database | Supabase PostgreSQL | Relational data, Row Level Security |
| Files | Supabase Storage (buckets `project-media`, `project-docs`) | Large files, resumable uploads |
| Auth | Supabase Auth (email + password or magic link), admin role | Only staff can write |
| Hosting | Vercel (or any Node host) **instead of a static export** | Needed for ISR + server-side admin |
| Rendering | Public pages stay statically generated, refreshed with on-demand revalidation | Same speed as today |

**Why the hosting changes:** `output: "export"` cannot run Server Actions, Route Handlers that
receive requests, middleware/proxy, or revalidation. A secure admin needs at least one of those.
The move is small: remove `output: "export"` and the custom image loader (Vercel optimises images itself),
keep everything else.

> **If static hosting is mandatory**, a fallback works: `/admin` as a client-only app talking to
> Supabase directly (security enforced by RLS), and a "Publish" button that calls a build hook
> (GitHub Actions / Netlify / Cloudflare Pages) to rebuild the site. Changes then go live after
> a 1–3 minute build instead of instantly.

### Data model (proposal — mirrors `data/projects/types.ts`)

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order int not null default 100,
  featured boolean not null default false,
  name jsonb not null,            -- { "ar": "...", "en": "..." }
  code text,
  type jsonb not null,
  location jsonb,
  progress jsonb,
  tagline jsonb not null,
  summary jsonb not null,
  content jsonb not null default '{}',   -- facts, chapters, floors, floorGroups, notes
  updated_at timestamptz not null default now()
);

create table project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade,
  role text not null,             -- hero | card | gallery | plan-2d | plan-3d | chapter
  storage_path text not null,
  width int not null, height int not null,
  alt jsonb not null, caption jsonb,
  sort_order int not null default 100
);

create table project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade,
  title jsonb not null,
  storage_path text not null,
  size_bytes bigint not null,
  page_count int,
  language text not null default 'ar'
);

create table admins (user_id uuid primary key references auth.users on delete cascade);

-- Row Level Security: everyone reads published content, only admins write
alter table projects enable row level security;
create policy "read published" on projects for select using (status = 'published');
create policy "admins all" on projects for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));
-- same pattern for project_media / project_documents (join to projects.status for reads)
```

### Security rules

- The **service-role key never reaches the browser**; it lives only in server environment variables.
- Every write goes through an authenticated admin session; RLS rejects everyone else even if a request is forged.
- Storage buckets: public read for published files, write only for admins (storage RLS policies).
- Validate uploads before accepting them: images `image/jpeg|png|webp` ≤ 15 MB; PDFs `application/pdf` ≤ 100 MB
  (check the MIME type **and** the file signature `%PDF-`).
- Large PDFs use **resumable uploads** (Supabase Storage supports the TUS protocol) so a dropped connection doesn't restart a 50 MB upload.
- Rate-limit the login, and log admin actions (who changed what, when).

### Image processing in the admin world

Today `npm run project-media` extracts images from PDFs and resizes them at development time.
With an admin, either:
- upload already-chosen images (hero, gallery, plans) and let the host optimise them (Vercel Image Optimisation), or
- run the same extraction script in a background job (e.g. a GitHub Action or Supabase Edge Function + queue) after a PDF upload.

### Migration steps (estimate: 4–7 working days)

1. Create the Supabase project; add the tables, RLS policies and buckets above.
2. Write a one-off script that imports the current file-based projects into the database.
3. Change `lib/projects.ts` to read from Supabase (the components don't change — they only use these functions).
4. Switch hosting to Vercel; remove `output: "export"` and the custom image loader.
5. Build `/admin`: login, project list (order, publish/unpublish, delete), project editor (AR/EN tabs),
   media manager (upload, reorder, alt text), document upload with progress.
6. On save/publish, call `revalidatePath()` for `/ar/projects`, `/en/projects` and the project pages — changes are live in seconds.

**Needed from you before starting:** where the site will be hosted, a Supabase account (or approval to create one),
and the list of people who should have admin access.

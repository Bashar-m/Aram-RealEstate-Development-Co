<div align="center">

<img src="public/brand/web/aram-logo-primary.webp" alt="ARAM Real Estate Development Co." width="200" />

# ARAM Real Estate Development — Corporate Website

**آرام للتطوير العقاري — الموقع التعريفي الرسمي**

A bilingual (Arabic / English), fully static corporate website with an interactive projects showcase.

![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![Static export](https://img.shields.io/badge/Deploy-static_export-3B4D23)
![Status](https://img.shields.io/badge/status-prototype-A68F31)

</div>

---

## نبذة

موقع تعريفي لشركة آرام للتطوير العقاري بالعربية (افتراضيًا، من اليمين لليسار) والإنجليزية، يُبنى كموقع **Static** كامل يمكن رفعه على أي استضافة. يضم الصفحات التعريفية وقسم **مشاريعنا**، ويبدأ بمشروع ماروتا سيتي T104 / T105: مقطع تفاعلي للمبنى، والمخططات الأفقية لكل طابق، ومعرض للتصورات المعمارية، وعارض للكتيّب لا يُحمَّل إلا عند الطلب.

> **الحالة:** نسخة أولية للعرض والمراجعة. بيانات التواصل وصور الصفحات العامة ونصوص السياسات تجريبية إلى حين اعتماد المحتوى الرسمي.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Routes](#routes)
- [Project structure](#project-structure)
- [Editing content](#editing-content)
- [Projects](#projects)
- [Images & media pipeline](#images--media-pipeline)
- [Internationalisation](#internationalisation)
- [Performance & accessibility](#performance--accessibility)
- [Deployment](#deployment)
- [Content status](#content-status)
- [Roadmap](#roadmap)

---

## Features

- **Bilingual by design**: Arabic (RTL, default) and English (LTR) on `/ar` and `/en`, with per-locale `lang`/`dir`, metadata, canonical URLs and `hreflang`. The language switcher keeps the visitor on the same page.
- **Brand-led design**: the ARAM palette and typography, with ornaments drawn from the roof lines of the emblem. Mobile-first, tested from 320 px to 1920 px.
- **Projects showcase**:
  - Featured project card and project listing that grows naturally as projects are added.
  - Editorial project page: immersive hero, documented key figures (each cites its brochure page), storytelling chapters, location.
  - **Interactive building section**: pick any level (basements → roof) to see its 2D plan or 3D view, with unit areas, zoom, pinch and drag.
  - Editorial gallery with a swipeable, keyboard-accessible lightbox.
  - **On-demand brochure viewer** (PDF.js): loads only when opened, renders one page at a time and streams the file with HTTP range requests.
- **Static & fast**: no server, database or runtime dependencies; Server Components by default; heavy features are code-split and lazy-loaded.
- **Accessible**: semantic HTML, skip link, visible focus states, accessible mobile menu (focus trap, Escape), native `<dialog>` modals, `prefers-reduced-motion` support.
- **SEO**: unique titles and descriptions, Open Graph, `sitemap.xml` with language alternates, `robots.txt`, Organization JSON-LD.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, `output: "export"`, Turbopack) |
| UI | React 19.3, Server Components by default |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 with brand tokens in `@theme` |
| Icons | Lucide React |
| PDF viewer | PDF.js (`pdfjs-dist` 6.4, legacy build, loaded on demand) |
| Fonts | IBM Plex Sans Arabic + Inter via `next/font` (self-hosted at build time) |
| Images | `next/image` + custom loader over pre-generated WebP variants (sharp) |

No animation or UI component libraries are used: motion is implemented in CSS, including scroll-driven animations.

## Getting started

**Prerequisites**

- Node.js **22.13+** (developed on Node 24)
- npm
- *Optional:* [Poppler](https://poppler.freedesktop.org/), only needed to extract images from a project brochure (`brew install poppler` on macOS)

**Install and run**

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The root `/` redirects to `/ar/`.

**Production build**

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
npx serve out          # preview the static output locally
```

> `next start` is not used: the site is exported as static files to `out/`.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the static site into `out/` |
| `npm run typecheck` | Generate route types and run the TypeScript compiler |
| `npm run lint` | Run ESLint |
| `npm run images` | Regenerate responsive WebP variants from `assets/photos/` |
| `npm run project-media -- <slug>` | Extract and optimise a project's images from its brochure PDF |

## Routes

| Page | Arabic | English |
|---|---|---|
| Home | `/ar/` | `/en/` |
| About | `/ar/about/` | `/en/about/` |
| Vision | `/ar/vision/` | `/en/vision/` |
| Projects | `/ar/projects/` | `/en/projects/` |
| Marota City T104 / T105 | `/ar/projects/marota-city-t104-t105/` | `/en/projects/marota-city-t104-t105/` |
| Policies | `/ar/policies/` | `/en/policies/` |
| Contact | `/ar/contact/` | `/en/contact/` |

Unknown URLs render a bilingual 404 page (`out/404.html`).

## Project structure

```text
app/
  [locale]/                 Pages per language + root layout (lang, dir, fonts, metadata)
    projects/[slug]/        Project detail pages (generated from project data)
  (redirect)/               "/" → "/ar/"
  global-not-found.tsx      Bilingual 404
  sitemap.ts, robots.ts     SEO files (static)
components/
  layout/                   Header (mobile menu, language switcher), footer
  home/                     Home page sections
  projects/                 Project cards, hero, story, floor-plan explorer, gallery, PDF viewer
  contact/                  Contact form (prototype)
  ui/                       Shared building blocks (buttons, page hero, CTA, brand ornaments…)
data/
  company.ts                Contact details, social links, site URL — single source of truth
  images.ts                 Site photography and logo registry
  projects/                 Project data model, registry and one folder per project
messages/
  ar.ts, en.ts              All interface text (English is type-checked against Arabic)
lib/                        i18n, routes, metadata, fonts, image loader, project data access
scripts/                    Image optimisation and PDF media extraction
assets/photos/              Source photographs (not served directly)
public/
  brand/                    Original identity files + web-optimised logos (brand/web)
  images/                   Generated photo variants
  projects/<slug>/          Original brochure PDF + generated media
docs/projects-cms.md        Adding projects today, and the plan for an admin dashboard
types/                      Ambient type declarations
```

## Editing content

| To change… | Edit |
|---|---|
| Arabic text | `messages/ar.ts` |
| English text | `messages/en.ts`: TypeScript flags any missing key |
| Phone, WhatsApp, email, address, hours, social links | `data/company.ts` |
| Production domain (canonical, sitemap, Open Graph) | `NEXT_PUBLIC_SITE_URL` or `data/company.ts` |
| Brand colours | `app/globals.css`, `@theme` block |
| Fonts | `lib/fonts.ts` |
| Logos | `public/brand/web/` (paths in `data/images.ts`) |
| Favicon and app icons | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` |
| Page photography | Replace a file in `assets/photos/` (same name), then `npm run images` |
| Project content | `data/projects/<slug>/index.ts` |

**Contact data is safe by default.** While `tel`, `whatsapp.number`, `email.address` or a social `href` in `data/company.ts` is `null`, the value is shown as plain text and is not clickable. Fill it in and it becomes a working link or button automatically.

## Projects

Projects are typed data, kept separate from the UI:

```text
data/projects/types.ts            Data model (Project, ProjectFloor, ProjectFact, ProjectMedia…)
data/projects/<slug>/index.ts     Content in Arabic and English, with the source page of every figure
data/projects/<slug>/media.json   Generated image dimensions
data/projects/index.ts            Registry of projects
lib/projects.ts                   Data access: the only layer components use
```

Each project controls its own `status` (`draft` / `published`), `order`, `featured` flag and construction `progress`. Sections without data (floors, gallery, documents) are hidden automatically.

**Adding a project** takes roughly four steps: add the PDF, map its images, run `npm run project-media -- <slug>`, then fill in the data file and rebuild. The full walkthrough is in [`docs/projects-cms.md`](docs/projects-cms.md), together with the proposed architecture for an `/admin` dashboard (Supabase PostgreSQL, Storage and Auth with Row Level Security).

## Images & media pipeline

All image processing happens **at development time**, never on request:

| Source | Command | Output |
|---|---|---|
| `assets/photos/*.jpg` | `npm run images` | `public/images/<name>-<320…1920>.webp` |
| Project brochure PDF | `npm run project-media -- <slug>` | `public/projects/<slug>/media/<name>-<640…1920>.webp` + `media.json` |

- Images are extracted from the PDF at their **native resolution** and only ever scaled down, never upscaled.
- 3D drawings are rebuilt as transparent cut-outs using the PDF's own soft masks.
- `lib/image-loader.ts` maps `next/image` widths to the generated files, so responsive `srcset`s work without an image server.
- Stored dimensions prevent layout shift (CLS = 0).

## Internationalisation

- Every route lives under `app/[locale]` with `generateStaticParams` for `ar` and `en`, and is built as static HTML.
- Interface strings live in `messages/`; project content lives in each project's data file as `{ ar, en }` pairs.
- Direction-aware UI uses logical properties (`ms-`, `ps-`, `start-`) and `rtl:` variants, so arrows and swipe gestures follow the reading direction.
- Arabic text uses IBM Plex Sans Arabic; Latin text and numerals use Inter.

## Performance & accessibility

Measured with Lighthouse 12 (mobile, simulated slow 4G, 4× CPU) against the production build served with gzip:

| Page | Performance | Accessibility | Best practices | SEO | CLS | TBT |
|---|---|---|---|---|---|---|
| Home | 89 | 100 | 100 | 100 | 0 | 0 ms |
| Projects | 90 | 100 | 100 | 100 | 0 | 0 ms |
| Project page | 89 | 100 | 100 | 100 | 0 | 0 ms |
| Contact | 91 | 100 | 100 | 100 | 0 | 0 ms |

- Simulated LCP is 3.5–3.8 s. The remaining cost is mostly the framework runtime (~150 KB of compressed JavaScript); a CDN with HTTP/2 or HTTP/3 should improve real-world results.
- The project page adds ~7 KB of JavaScript over standard pages. PDF.js (~0.5 MB) and its worker (~1.3 MB) load only when the brochure viewer is opened.
- Every page was audited at 320, 375, 430, 768, 1024, 1440 and 1920 px in both languages: no horizontal overflow, no off-screen content, no touch targets below 40 px.

## Deployment

`npm run build` produces a self-contained static site in **`out/`**. Upload it to any static host (Netlify, Cloudflare Pages, Vercel, Amazon S3 + CloudFront, Nginx, Apache…).

- **Clean URLs:** with `trailingSlash: true` every page is exported as `<route>/index.html`, so no rewrite rules are needed.
- **404:** configure the host to serve `404.html` for unknown paths.
- **Domain:** set `NEXT_PUBLIC_SITE_URL` before building so canonical URLs, `hreflang` and the sitemap are correct.
- **Brochures:** the host should support HTTP range requests for PDFs (almost all do) so the viewer can stream large files.
- **Caching:** files under `/_next/static/` are content-hashed and can be cached long-term (`immutable`).

## Content status

| Item | Status |
|---|---|
| Contact details, social links | Placeholders, displayed as plain text until official data is added |
| Contact form | Validates input but does not send; shows a clear "not enabled" notice |
| Policies | Drafts pending legal review; the page says so |
| Page photography (non-project) | Illustrative stock photos (Unsplash License), not ARAM projects |
| Project content | Taken from the official brochure; items awaiting confirmation are tracked separately |

## Roadmap

- [ ] Replace placeholder contact data, social links and the production domain
- [ ] Official company photography and approved copy
- [ ] Connect the contact form to a form service
- [ ] `/admin` dashboard for project CRUD: see [`docs/projects-cms.md`](docs/projects-cms.md)
- [ ] Additional projects

---

<div align="center">

© ARAM Real Estate Development Co. All rights reserved. This is a private repository.

</div>

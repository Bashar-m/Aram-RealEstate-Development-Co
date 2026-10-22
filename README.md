# آرام للتطوير العقاري — الموقع التعريفي (نسخة أولية)

ARAM Real Estate Development — bilingual (Arabic / English) static corporate website.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Lucide · fully static export.

## التشغيل / Running

```bash
npm install
npm run dev        # http://localhost:3000  →  /ar/ , /en/
npm run build      # static site generated in out/
npm run typecheck
npm run lint
npm run images     # regenerate responsive photos after changing assets/photos
```

Deploy by uploading the `out/` folder to any static host (Netlify, Vercel, Cloudflare Pages, S3, Nginx…).
Before the production build, set the real domain: `NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build`.

## الصفحات / Routes

| Page | Arabic | English |
|---|---|---|
| Home | `/ar/` | `/en/` |
| About | `/ar/about/` | `/en/about/` |
| Vision | `/ar/vision/` | `/en/vision/` |
| Policies | `/ar/policies/` | `/en/policies/` |
| Contact | `/ar/contact/` | `/en/contact/` |

`/` redirects to `/ar/`. Unknown URLs show the bilingual 404 (`out/404.html`).

## أين أعدّل؟ / What to edit

| What | File |
|---|---|
| All Arabic text | `messages/ar.ts` |
| All English text | `messages/en.ts` (same keys as Arabic — TypeScript flags anything missing) |
| Phone, WhatsApp, email, address, hours, social links, domain | `data/company.ts` |
| Brand colours & fonts | `app/globals.css` (`@theme` block) and `lib/fonts.ts` |
| Logos used on the site | `public/brand/web/` (generated from the originals in `public/brand/`) — paths in `data/images.ts` |
| Favicon / app icons | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` |
| Photos | Replace a file in `assets/photos/` (keep the name), then `npm run images` |

Placeholder contact data is displayed as plain text. As soon as `tel`, `whatsapp.number`, `email.address`
or a social `href` is filled in `data/company.ts`, it automatically becomes a working link / button.

## Structure

```
app/[locale]/        pages (home, about, vision, policies, contact) + root layout (lang/dir)
app/(redirect)/      "/" → "/ar/"
components/layout/   header (incl. mobile menu & language switcher), footer
components/home/     home page sections
components/ui/       shared building blocks (buttons, photo, page hero, CTA, roof motif…)
components/contact/  contact form (prototype — validates, never sends)
messages/            translations
data/                company data, image registry
lib/                 i18n, routes, metadata (SEO), fonts, image loader
scripts/             image optimisation
```

## Notes

- Photography is illustrative stock (Unsplash License) and does **not** show ARAM projects.
- Policy texts are drafts pending legal review; the page says so.
- The contact form is not connected to any service. To enable it on a static host, post it to a form
  service (Formspree, Web3Forms, Netlify Forms…) — see the comment in `components/contact/contact-form.tsx`.

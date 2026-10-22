/**
 * Central company data — the ONLY place to edit contact details and links.
 *
 * Everything below is placeholder content for the prototype.
 * While a `href`/`number` is null the value is shown as plain text (not clickable),
 * so no fake number can ever be dialled. Fill them in once official data is approved.
 */

export const company = {
  name: {
    ar: "شركة آرام للتطوير العقاري",
    en: "ARAM Real Estate Development Co.",
  },
  shortName: { ar: "آرام", en: "ARAM" },

  // Production domain — used for canonical URLs, hreflang, sitemap and Open Graph.
  // Set NEXT_PUBLIC_SITE_URL at build time, or replace the fallback.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aram-realestate.example",

  contact: {
    phone: {
      display: "05X XXX XXXX",
      // e.g. "+9665XXXXXXXX" — enables the tel: link
      tel: null as string | null,
    },
    whatsapp: {
      display: "05X XXX XXXX",
      // International format, digits only, e.g. "9665XXXXXXXX" — enables the WhatsApp button
      number: null as string | null,
    },
    email: {
      display: "info@aram-realestate.example",
      // e.g. "info@aram.com" — enables the mailto: link
      address: null as string | null,
    },
    // Office address — shows "to be added" text while null
    address: {
      ar: null as string | null,
      en: null as string | null,
    },
    // Working hours — shows "to be announced" text while null
    hours: {
      ar: null as string | null,
      en: null as string | null,
    },
  },

  // Social accounts — icons render as disabled until a URL is added
  social: [
    { id: "instagram", label: "Instagram", href: null },
    { id: "x", label: "X", href: null },
    { id: "linkedin", label: "LinkedIn", href: null },
    { id: "youtube", label: "YouTube", href: null },
  ] as { id: SocialId; label: string; href: string | null }[],
};

export type SocialId = "instagram" | "x" | "linkedin" | "youtube";

export function whatsappHref(number: string | null) {
  return number ? `https://wa.me/${number.replace(/\D/g, "")}` : null;
}

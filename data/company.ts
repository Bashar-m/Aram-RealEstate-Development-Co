/**
 * Central company data — the ONLY place to edit contact details and links.
 *
 * Optional fields (address, hours) are hidden on the site while they are null.
 */

// Production domain — used for canonical URLs, hreflang, sitemap, robots and Open Graph.
// NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging build).
const SITE_URL = "https://aram-construction.com";
const siteUrlFromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

if (siteUrlFromEnv && !/^https:\/\/[^/\s]+$/.test(siteUrlFromEnv)) {
  throw new Error(`NEXT_PUBLIC_SITE_URL must be an https origin without a path, got "${siteUrlFromEnv}".`);
}

export const company = {
  name: {
    ar: "شركة آرام للتطوير العقاري",
    en: "ARAM Real Estate Development Co.",
  },
  shortName: { ar: "آرام", en: "ARAM" },

  siteUrl: siteUrlFromEnv || SITE_URL,

  contact: {
    phone: {
      display: "+963 944 703 009",
      tel: "+963944703009",
    },
    whatsapp: {
      // International format, digits only
      number: "963944703009",
    },
    email: {
      display: "info@aram-construction.com",
      address: "info@aram-construction.com",
    },
    // Office address — the row is hidden while null
    address: {
      ar: null as string | null,
      en: null as string | null,
    },
    // Working hours — the row is hidden while null
    hours: {
      ar: null as string | null,
      en: null as string | null,
    },
  },

  social: [
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/share/19ZbAB1ypd/" },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/aram.alaqaria" },
  ] as { id: SocialId; label: string; href: string }[],
};

export type SocialId = "facebook" | "instagram";

export function whatsappHref(number: string, text?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

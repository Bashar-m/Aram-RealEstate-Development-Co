import type { Metadata } from "next";
import { company } from "@/data/company";
import { brand } from "@/data/images";
import { getMessages } from "./i18n";
import { locales, pagePath, type Locale, type PageKey } from "./routes";

const ogLocale: Record<Locale, string> = { ar: "ar_SA", en: "en_US" };

/** Per-page title, description, canonical, hreflang and Open Graph tags. */
export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const t = getMessages(locale);
  const { title, description } = t.meta[page];
  const url = pagePath(locale, page);

  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pagePath(l, page)])),
        "x-default": pagePath("ar", page),
      },
    },
    openGraph: {
      type: "website",
      url,
      title: page === "home" ? title : `${title} | ${t.meta.siteName}`,
      description,
      siteName: t.meta.siteName,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: brand.og, width: 1200, height: 630, alt: company.name[locale] }],
    },
    twitter: { card: "summary_large_image", title, description, images: [brand.og] },
  };
}

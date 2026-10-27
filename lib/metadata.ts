import type { Metadata } from "next";
import { company } from "@/data/company";
import { brand } from "@/data/images";
import type { Project } from "@/data/projects/types";
import { getMessages } from "./i18n";
import { locales, pagePath, projectPath, type Locale, type PageKey } from "./routes";

const ogLocale: Record<Locale, string> = { ar: "ar_SA", en: "en_US" };

type MetaInput = {
  locale: Locale;
  title: string;
  description: string;
  /** Path of this page in a given locale */
  path: (locale: Locale) => string;
  /** Title is used as-is (no "| site name" suffix) */
  absoluteTitle?: boolean;
  image?: { url: string; width: number; height: number; alt: string };
};

/** Title, description, canonical, hreflang and Open Graph tags for any page. */
export function buildMetadata({ locale, title, description, path, absoluteTitle, image }: MetaInput): Metadata {
  const t = getMessages(locale);
  const url = path(locale);
  const ogImage = image ?? { url: brand.og, width: 1200, height: 630, alt: company.name[locale] };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, path(l)])),
        "x-default": path("ar"),
      },
    },
    openGraph: {
      type: "website",
      url,
      title: absoluteTitle ? title : `${title} | ${t.meta.siteName}`,
      description,
      siteName: t.meta.siteName,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

/** Metadata for the fixed site pages (texts in messages/<locale>.ts → meta). */
export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const { title, description } = getMessages(locale).meta[page];
  return buildMetadata({ locale, title, description, path: (l) => pagePath(l, page), absoluteTitle: page === "home" });
}

/** Metadata for a project detail page (texts from the project data). */
export function projectMetadata(locale: Locale, project: Project): Metadata {
  return buildMetadata({
    locale,
    title: [project.name[locale], project.code].filter(Boolean).join(" — "),
    description: project.summary[locale],
    path: (l) => projectPath(l, project.slug),
    image: { url: `${project.hero.src}-1280.webp`, width: 1280, height: Math.round((1280 * project.hero.height) / project.hero.width), alt: project.hero.alt[locale] },
  });
}

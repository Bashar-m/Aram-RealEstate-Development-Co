import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { locales, pagePath, pages } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, company.siteUrl).toString();

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: url(pagePath(locale, page)),
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url(pagePath(l, page))])),
      },
    })),
  );
}

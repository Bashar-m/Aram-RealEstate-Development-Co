import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { getPublishedProjects } from "@/lib/projects";
import { locales, pagePath, pages, projectPath } from "@/lib/routes";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, company.siteUrl).toString();

  const entry = (path: (l: (typeof locales)[number]) => string, priority: number) =>
    locales.map((locale) => ({
      url: url(path(locale)),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(path(l))])) },
    }));

  const projects = await getPublishedProjects();
  return [
    ...pages.flatMap((page) => entry((l) => pagePath(l, page), page === "home" ? 1 : 0.7)),
    ...projects.flatMap((p) => entry((l) => projectPath(l, p.slug), 0.8)),
  ];
}

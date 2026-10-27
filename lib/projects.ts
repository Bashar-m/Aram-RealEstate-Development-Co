/**
 * Project data access. Components call these functions only — never the data files directly —
 * so switching the source to a database (Supabase, see docs/projects-cms.md) is a change here.
 * Functions are async for that reason, even though today's data is local.
 */
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects/types";
import type { Locale } from "./routes";

export async function getPublishedProjects(): Promise<Project[]> {
  return projects.filter((p) => p.status === "published").sort((a, b) => a.order - b.order);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getPublishedProjects()).find((p) => p.slug === slug);
}

export async function getFeaturedProject(): Promise<Project | undefined> {
  const list = await getPublishedProjects();
  return list.find((p) => p.featured) ?? list[0];
}

export function formatFileSize(bytes: number, locale: Locale) {
  const mb = bytes / 1024 / 1024;
  // Western digits in both languages, matching the rest of the site
  return `${mb.toLocaleString("en", { maximumFractionDigits: 1 })} ${locale === "ar" ? "ميغابايت" : "MB"}`;
}

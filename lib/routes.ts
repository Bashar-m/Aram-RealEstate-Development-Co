// Locale + route helpers. Safe to import from Client Components (no message data here).

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const pages = ["home", "about", "vision", "projects", "policies", "contact"] as const;
export type PageKey = (typeof pages)[number];

const slugs: Record<PageKey, string> = {
  home: "",
  about: "about",
  vision: "vision",
  projects: "projects",
  policies: "policies",
  contact: "contact",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** `/ar/`, `/en/about/` … (trailing slash matches `trailingSlash: true`) */
export function pagePath(locale: Locale, page: PageKey) {
  const slug = slugs[page];
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

/** `/ar/projects/<slug>/` */
export function projectPath(locale: Locale, slug: string) {
  return `/${locale}/projects/${slug}/`;
}

/** Same page in another language: `/ar/about/` → `/en/about/` */
export function switchLocalePath(pathname: string, target: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments[0] = target;
  else segments.unshift(target);
  return `/${segments.join("/")}/`;
}

export function normalizePath(pathname: string) {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

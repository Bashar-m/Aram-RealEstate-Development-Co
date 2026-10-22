import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { company } from "@/data/company";
import { fontVariables } from "@/lib/fonts";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { dirOf, locales } from "@/lib/routes";
import "../globals.css";

// Only /ar and /en exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const t = getMessages(await resolveLocale(params));
  return {
    metadataBase: new URL(company.siteUrl),
    title: { default: t.meta.home.title, template: `%s | ${t.meta.siteName}` },
    description: t.meta.home.description,
    applicationName: t.meta.siteName,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#3b4d23",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="fixed start-4 top-3 z-[60] -translate-y-24 rounded-lg bg-brand px-5 py-3 font-semibold text-white transition-transform focus:translate-y-0"
        >
          {t.header.skipToContent}
        </a>
        <SiteHeader locale={locale} t={t} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} t={t} />
        <RevealObserver />
      </body>
    </html>
  );
}

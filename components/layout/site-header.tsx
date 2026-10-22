import type { Messages } from "@/lib/i18n";
import { pagePath, pages, type Locale } from "@/lib/routes";
import { HeaderBar } from "./header-bar";

export function SiteHeader({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <HeaderBar
      locale={locale}
      homeHref={pagePath(locale, "home")}
      contactHref={pagePath(locale, "contact")}
      items={pages.map((page) => ({ href: pagePath(locale, page), label: t.nav[page] }))}
      labels={{
        contactCta: t.header.contactCta,
        openMenu: t.header.openMenu,
        closeMenu: t.header.closeMenu,
        mainNav: t.header.mainNav,
        homeLink: t.header.homeLink,
        switchLanguage: t.header.switchLanguage,
        switchLanguageShort: t.header.switchLanguageShort,
        switchLanguageLabel: t.header.switchLanguageLabel,
      }}
    />
  );
}

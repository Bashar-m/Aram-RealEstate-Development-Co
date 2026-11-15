import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { LogoPrimary } from "@/components/ui/logo";
import { RoofDivider } from "@/components/ui/roof";
import { SocialIcon } from "@/components/ui/social-icons";
import { company } from "@/data/company";
import type { Messages } from "@/lib/i18n";
import { pagePath, pages, type Locale } from "@/lib/routes";

export function SiteFooter({ locale, t }: { locale: Locale; t: Messages }) {
  // Static export: the year is set at build time
  const year = new Date().getFullYear();
  const { phone, email } = company.contact;

  return (
    <footer className="bg-stone pt-16 sm:pt-20">
      <div className="container-site">
        <RoofDivider className="mb-14 sm:mb-16" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href={pagePath(locale, "home")} aria-label={t.header.homeLink} className="inline-block rounded-sm">
              <LogoPrimary alt={company.name[locale]} className="w-40 sm:w-44" />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">{t.footer.description}</p>
          </div>

          <nav aria-labelledby="footer-pages" className="lg:col-span-2 lg:col-start-6">
            <h2 id="footer-pages" className="text-sm font-semibold text-gold-ink">
              {t.footer.pages}
            </h2>
            <ul className="mt-4">
              {pages.map((page) => (
                <li key={page}>
                  <Link href={pagePath(locale, page)} className="inline-flex min-h-11 items-center text-ink/80 transition-colors hover:text-brand">
                    {t.nav[page]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-gold-ink">{t.footer.contact}</h2>
            <ul className="mt-5 space-y-4 text-ink/80">
              <li className="flex items-center gap-3">
                <Phone aria-hidden strokeWidth={1.6} className="size-[1.1rem] shrink-0 text-gold" />
                <span className="sr-only">{t.contact.info.phone}: </span>
                <a href={`tel:${phone.tel}`} dir="ltr" className="hover:text-brand">{phone.display}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden strokeWidth={1.6} className="size-[1.1rem] shrink-0 text-gold" />
                <span className="sr-only">{t.contact.info.email}: </span>
                <a href={`mailto:${email.address}`} dir="ltr" className="break-all hover:text-brand">{email.display}</a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-gold-ink">{t.footer.follow}</h2>
            <ul className="mt-5 flex gap-2">
              {company.social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-brand/25 text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    <SocialIcon id={s.id} className="size-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-8 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {company.name[locale]}. {t.footer.rights}
          </p>
          <p className="max-w-xl">{t.common.illustrativeNote}</p>
        </div>
      </div>
    </footer>
  );
}

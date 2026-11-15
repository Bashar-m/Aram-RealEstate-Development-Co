import type { ReactNode } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { buttonClasses } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SocialIcon } from "@/components/ui/social-icons";
import { company, whatsappHref } from "@/data/company";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  return pageMetadata(await resolveLocale(params), "contact");
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-b border-line py-5 first:pt-0">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-stone text-brand">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <div className="mt-1 text-lg font-medium">{children}</div>
      </div>
    </li>
  );
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const c = t.contact;
  const { phone, email, whatsapp, address, hours } = company.contact;
  const iconProps = { "aria-hidden": true, strokeWidth: 1.6, className: "size-5" } as const;

  return (
    <>
      <PageHero
        locale={locale}
        t={t}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        description={c.hero.description}
        image="timberHouse"
        imageAlt={t.images.timberHouse}
      />

      <section className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Contact details — values come from data/company.ts */}
          <div data-reveal className="lg:col-span-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">{c.info.title}</h2>
            <ul className="mt-8">
              <InfoRow icon={<Phone {...iconProps} />} label={c.info.phone}>
                <a href={`tel:${phone.tel}`} dir="ltr" className="hover:text-brand">{phone.display}</a>
              </InfoRow>
              <InfoRow icon={<Mail {...iconProps} />} label={c.info.email}>
                <a href={`mailto:${email.address}`} dir="ltr" className="break-all hover:text-brand">{email.display}</a>
              </InfoRow>
              {address[locale] && (
                <InfoRow icon={<MapPin {...iconProps} />} label={c.info.address}>
                  {address[locale]}
                </InfoRow>
              )}
              {hours[locale] && (
                <InfoRow icon={<Clock {...iconProps} />} label={c.info.hours}>
                  {hours[locale]}
                </InfoRow>
              )}
            </ul>

            <div className="mt-8">
              <a href={whatsappHref(whatsapp.number)} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "w-full")}>
                <MessageCircle aria-hidden strokeWidth={1.75} className="size-5" />
                {c.info.whatsapp}
              </a>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-semibold text-gold-ink">{t.footer.follow}</h3>
              <ul className="mt-4 flex gap-2">
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

          {/* Form */}
          <div data-reveal className="lg:col-span-7 lg:col-start-6">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-45px_rgb(40_55_29/0.45)] sm:p-10 lg:p-12">
              <h2 className="text-2xl font-semibold sm:text-3xl">{c.form.title}</h2>
              <p className="mt-3 text-muted">{c.form.intro}</p>
              <div className="mt-8">
                <ContactForm t={c.form} whatsappNumber={whatsapp.number} emailAddress={email.address} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

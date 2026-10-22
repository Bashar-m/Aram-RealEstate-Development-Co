import type { ReactNode } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { buttonClasses } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
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
  const waHref = whatsappHref(whatsapp.number);
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
                {phone.tel ? (
                  <a href={`tel:${phone.tel}`} dir="ltr" className="hover:text-brand">{phone.display}</a>
                ) : (
                  <span dir="ltr">{phone.display}</span>
                )}
              </InfoRow>
              <InfoRow icon={<Mail {...iconProps} />} label={c.info.email}>
                {email.address ? (
                  <a href={`mailto:${email.address}`} dir="ltr" className="break-all hover:text-brand">{email.display}</a>
                ) : (
                  <span dir="ltr" className="break-all">{email.display}</span>
                )}
              </InfoRow>
              <InfoRow icon={<MapPin {...iconProps} />} label={c.info.address}>
                {address[locale] ?? <span className="text-muted">{c.info.addressPending}</span>}
              </InfoRow>
              <InfoRow icon={<Clock {...iconProps} />} label={c.info.hours}>
                {hours[locale] ?? <span className="text-muted">{c.info.hoursPending}</span>}
              </InfoRow>
            </ul>

            <div className="mt-8">
              {waHref ? (
                <a href={waHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "w-full")}>
                  <MessageCircle aria-hidden strokeWidth={1.75} className="size-5" />
                  {c.info.whatsapp}
                </a>
              ) : (
                <>
                  <span
                    aria-disabled="true"
                    aria-describedby="whatsapp-pending"
                    className={buttonClasses("outline", "pointer-events-none w-full opacity-50")}
                  >
                    <MessageCircle aria-hidden strokeWidth={1.75} className="size-5" />
                    {c.info.whatsapp}
                  </span>
                  <p id="whatsapp-pending" className="mt-3 text-sm text-muted">
                    {c.info.whatsappPending}
                  </p>
                </>
              )}
            </div>

            <p className="mt-8 rounded-xl bg-stone p-4 text-sm leading-relaxed text-muted">{c.info.placeholderNote}</p>
          </div>

          {/* Form */}
          <div data-reveal className="lg:col-span-7 lg:col-start-6">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-45px_rgb(40_55_29/0.45)] sm:p-10 lg:p-12">
              <h2 className="text-2xl font-semibold sm:text-3xl">{c.form.title}</h2>
              <p className="mt-3 text-muted">{c.form.intro}</p>
              <div className="mt-8">
                <ContactForm t={c.form} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

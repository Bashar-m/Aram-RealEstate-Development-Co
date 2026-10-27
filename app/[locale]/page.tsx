import { AboutPreview } from "@/components/home/about-preview";
import { Hero } from "@/components/home/hero";
import { ProjectsPreview } from "@/components/home/projects-preview";
import { ValuesSection } from "@/components/home/values-section";
import { VisionPreview } from "@/components/home/vision-preview";
import { WhyAram } from "@/components/home/why-aram";
import { CtaBand } from "@/components/ui/cta-band";
import { company } from "@/data/company";
import { brand } from "@/data/images";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { pagePath } from "@/lib/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  return pageMetadata(await resolveLocale(params), "home");
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);

  // Only verified facts belong here — add contact points once official.
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name[locale],
    alternateName: company.name[locale === "ar" ? "en" : "ar"],
    url: new URL(pagePath(locale, "home"), company.siteUrl).toString(),
    logo: new URL(brand.logoPrimary.src, company.siteUrl).toString(),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <Hero locale={locale} t={t} />
      <AboutPreview locale={locale} t={t} />
      <VisionPreview locale={locale} t={t} />
      <ValuesSection t={t} />
      <ProjectsPreview locale={locale} t={t} />
      <WhyAram t={t} />
      <CtaBand locale={locale} t={t} />
    </>
  );
}

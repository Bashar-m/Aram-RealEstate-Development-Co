import { Download, ExternalLink, FileText } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { ProjectDocument } from "@/data/projects/types";
import { format } from "@/lib/format";
import type { Messages } from "@/lib/i18n";
import { formatFileSize } from "@/lib/projects";
import type { Locale } from "@/lib/routes";
import { BrochureViewerButton } from "./brochure-viewer-button";
import { MediaImage } from "./media-image";

/** Brochure cover + actions. Neither the PDF nor the viewer code loads until "View" is pressed. */
export function ProjectBrochure({ doc, locale, t }: { doc: ProjectDocument; locale: Locale; t: Messages }) {
  const b = t.projects.brochure;

  return (
    <section id="brochure" aria-labelledby="brochure-title" className="section-y overflow-hidden">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div data-reveal className="relative lg:col-span-6">
          <div aria-hidden className="absolute inset-x-[8%] -bottom-6 top-10 -z-10 rounded-2xl bg-brand/10 ltr:rotate-[2.5deg] rtl:-rotate-[2.5deg]" />
          <div className="overflow-hidden rounded-2xl shadow-[0_40px_70px_-40px_rgb(40_55_29/0.6)] ring-1 ring-black/5 transition-transform duration-700 hover:-translate-y-1 ltr:-rotate-[1.5deg] rtl:rotate-[1.5deg]">
            <MediaImage media={doc.cover} locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>

        <div data-reveal className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow">{b.eyebrow}</p>
          <h2 id="brochure-title" className="mt-5 text-[1.875rem] leading-[1.3] font-semibold sm:text-4xl lg:text-[2.75rem]">
            {b.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{b.text}</p>

          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            {[
              doc.title[locale],
              format(b.pages, { n: doc.pageCount }),
              formatFileSize(doc.sizeBytes, locale),
              b.language,
            ].map((item, i) => (
              <li key={item} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5">
                {i === 0 && <FileText aria-hidden className="size-4 text-gold" strokeWidth={1.75} />}
                <span dir={i === 2 ? "auto" : undefined}>{item}</span>
              </li>
            ))}
          </ul>
          {locale !== doc.language && b.onlyArabic && <p className="mt-4 text-sm text-muted">{b.onlyArabic}</p>}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BrochureViewerButton
              file={doc.file}
              title={doc.title[locale]}
              pageCount={doc.pageCount}
              locale={locale}
              label={b.view}
              labels={t.projects.viewer}
              actions={{ download: b.download, openTab: b.openTab }}
            />
            <a href={doc.file} download className={buttonClasses("outline")}>
              <Download aria-hidden className="size-4" strokeWidth={1.75} />
              {b.download}
            </a>
          </div>
          <a
            href={doc.file}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            <ExternalLink aria-hidden className="size-4" strokeWidth={1.75} />
            {b.openTab}
          </a>
        </div>
      </div>
    </section>
  );
}

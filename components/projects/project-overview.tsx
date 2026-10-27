import type { CSSProperties } from "react";
import type { Project } from "@/data/projects/types";
import { format } from "@/lib/format";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";

/** Summary + documented key figures. Every figure cites its brochure page. */
export function ProjectOverview({ project, locale, t }: { project: Project; locale: Locale; t: Messages }) {
  const d = t.projects.detail;

  return (
    <section id="overview" aria-labelledby="overview-title" className="section-y">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div data-reveal className="lg:col-span-5">
            <p className="eyebrow">{d.overview}</p>
            <h2 id="overview-title" className="mt-5 text-[1.875rem] leading-[1.3] font-semibold sm:text-4xl lg:text-[2.75rem]">
              {project.tagline[locale]}
            </h2>
          </div>
          <div data-reveal className="lg:col-span-6 lg:col-start-7 lg:pt-12">
            <p className="text-xl leading-relaxed text-ink/85 sm:text-[1.375rem]">{project.summary[locale]}</p>
            <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted">{t.projects.type}</dt>
                <dd className="mt-1 font-medium">{project.type[locale]}</dd>
              </div>
              {project.location && (
                <div>
                  <dt className="text-sm text-muted">{t.projects.location}</dt>
                  <dd className="mt-1 font-medium">{project.location[locale]}</dd>
                </div>
              )}
              {project.progress && (
                <div>
                  <dt className="text-sm text-muted">{t.projects.status}</dt>
                  <dd className="mt-1 font-medium">{project.progress[locale]}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{d.factsEyebrow}</p>
              <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">{d.factsTitle}</h3>
            </div>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {project.facts.map((fact, i) => (
              <li key={`${fact.value}-${fact.label.en}`} className="group bg-ivory transition-colors duration-500 hover:bg-white">
                <div
                  data-reveal
                  style={{ "--delay": `${(i % 4) * 80}ms` } as CSSProperties}
                  className="flex h-full flex-col p-5 sm:p-7 lg:p-8"
                >
                  <span dir="ltr" className="text-[1.75rem] leading-none font-light text-brand tabular-nums sm:text-5xl lg:text-[3.25rem] rtl:text-right">
                    {fact.value}
                  </span>
                  <span className="mt-4 font-semibold sm:text-lg">{fact.label[locale]}</span>
                  {fact.detail && <span className="mt-1.5 text-sm leading-relaxed text-muted">{fact.detail[locale]}</span>}
                  <span className="mt-auto pt-5 text-xs text-gold-ink">{format(d.source, { page: fact.pdfPage })}</span>
                </div>
              </li>
            ))}
          </ul>
          {project.imageryNote && <p className="mt-5 text-sm text-muted">{project.imageryNote[locale]}</p>}
        </div>
      </div>
    </section>
  );
}

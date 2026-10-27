import type { CSSProperties } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import type { Project } from "@/data/projects/types";
import type { Messages } from "@/lib/i18n";
import { pagePath, type Locale } from "@/lib/routes";
import { MediaImage } from "./media-image";
import { ProgressBadge } from "./progress-badge";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function ProjectHero({ project, locale, t }: { project: Project; locale: Locale; t: Messages }) {
  const p = t.projects;

  return (
    <section
      aria-labelledby="project-title"
      className="on-dark relative isolate flex min-h-[max(38rem,calc(100svh-4rem))] items-end overflow-hidden bg-brand-deep text-white lg:min-h-[max(42rem,calc(100svh-5rem))]"
    >
      <MediaImage
        media={project.hero}
        locale={locale}
        fill
        priority
        sizes="100vw"
        className="animate-settle -z-20 object-[42%_45%]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-brand-deep via-brand-deep/45 to-brand-deep/5" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden from-brand-deep/70 to-transparent lg:block ltr:bg-linear-to-r rtl:bg-linear-to-l" />

      {/* Level ruler — a quiet nod to the tower section */}
      <div aria-hidden className="absolute inset-y-28 end-6 hidden w-6 flex-col justify-between lg:end-12 lg:flex">
        {Array.from({ length: 23 }, (_, i) => (
          <span key={i} className={i % 5 === 0 ? "h-px w-6 bg-gold-light/80" : "h-px w-3 self-end bg-white/35"} />
        ))}
      </div>

      <div className="container-site relative pt-36 pb-12 sm:pb-16 lg:pb-20">
        <nav aria-label={t.header.breadcrumb} className="animate-rise">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <li>
              <Link href={pagePath(locale, "home")} className="hover:text-white hover:underline">
                {t.nav.home}
              </Link>
            </li>
            <li aria-hidden className="opacity-60">/</li>
            <li>
              <Link href={pagePath(locale, "projects")} className="hover:text-white hover:underline">
                {t.nav.projects}
              </Link>
            </li>
            <li aria-hidden className="opacity-60">/</li>
            <li aria-current="page" className="text-white">{project.name[locale]}</li>
          </ol>
        </nav>

        <div className="animate-rise mt-7 flex flex-wrap items-center gap-3" style={delay(80)}>
          {project.progress && <ProgressBadge label={project.progress[locale]} tone="dark" />}
          <span className="text-sm text-white/80">{project.type[locale]}</span>
        </div>

        <h1 id="project-title" className="animate-rise mt-5" style={delay(160)}>
          <span className="block text-5xl leading-[1.1] font-semibold sm:text-7xl lg:text-8xl">{project.name[locale]}</span>
          {project.code && (
            <span dir="ltr" className="text-outline mt-2 block text-[2.75rem] leading-none font-semibold tracking-tight sm:text-7xl lg:text-[6.5rem] rtl:text-right">
              {project.code}
            </span>
          )}
        </h1>

        <p className="animate-rise mt-7 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl" style={delay(260)}>
          {project.tagline[locale]}
        </p>

        <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4" style={delay(360)}>
          <ButtonLink href="#floor-plans" variant="secondary" arrow>
            {p.explorer.eyebrow}
          </ButtonLink>
          <ButtonLink href="#overview" variant="outlineLight">
            {p.detail.scroll}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Arrow, buttonClasses } from "@/components/ui/button";
import { RoofMark } from "@/components/ui/roof";
import type { Project } from "@/data/projects/types";
import type { Messages } from "@/lib/i18n";
import { projectPath, type Locale } from "@/lib/routes";
import { MediaImage } from "./media-image";
import { ProgressBadge } from "./progress-badge";

type FeaturedProjectProps = {
  project: Project;
  locale: Locale;
  t: Messages;
  index?: number;
  priority?: boolean;
};

/**
 * Large editorial card: photograph on one side, an overlapping ivory panel on the other.
 * Built so it still looks complete when it is the only project on the page.
 */
export function FeaturedProject({ project, locale, t, index = 1, priority }: FeaturedProjectProps) {
  const href = projectPath(locale, project.slug);
  const p = t.projects;

  return (
    <article className="group relative grid lg:grid-cols-12" aria-labelledby={`project-${project.slug}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-brand-deep sm:aspect-[16/10] lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:aspect-auto lg:min-h-[38rem]"
      >
        <MediaImage
          media={project.card}
          locale={locale}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-[1.045]"
        />
        <span aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-deep/70 via-transparent to-transparent" />
        <span className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full bg-ivory/90 px-3.5 py-1.5 text-xs font-semibold text-brand backdrop-blur-sm sm:start-7 sm:top-7">
          <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
          {p.featured}
        </span>
        {project.code && (
          <span
            className="text-outline absolute start-5 bottom-14 text-[2.75rem] leading-none font-semibold tracking-tight transition-transform duration-700 group-hover:-translate-y-1 sm:start-7 sm:bottom-16 sm:text-6xl lg:bottom-6 lg:text-7xl"
          >
            {project.code.replace(" / ", "·")}
          </span>
        )}
      </Link>

      <div className="relative z-10 -mt-10 mx-3 rounded-2xl bg-ivory p-6 shadow-[0_30px_60px_-35px_rgb(40_55_29/0.45)] sm:mx-8 sm:p-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:mt-0 lg:mb-14 lg:self-end lg:p-12">
        <span
          aria-hidden
          className="absolute inset-x-6 top-0 h-0.5 scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100 sm:inset-x-10 lg:inset-x-12 ltr:origin-left rtl:origin-right"
        />
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-gold-ink tabular-nums">{String(index).padStart(2, "0")}</span>
          {project.progress && <ProgressBadge label={project.progress[locale]} />}
        </div>

        <h2 id={`project-${project.slug}`} className="mt-5 text-3xl leading-tight font-semibold sm:text-4xl">
          {project.name[locale]}
          {project.code && (
            <span dir="ltr" className="mt-1 block text-lg font-medium text-muted">
              {project.code}
            </span>
          )}
        </h2>
        <p className="mt-4 leading-relaxed text-muted">{project.tagline[locale]}</p>

        <dl className="mt-6 grid gap-3 border-t border-line pt-6 text-sm">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">{p.type}</dt>
            <dd className="font-medium">{project.type[locale]}</dd>
          </div>
          {project.location && (
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-muted">{p.location}</dt>
              <dd className="font-medium">{project.location[locale]}</dd>
            </div>
          )}
        </dl>

        <ul className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-6">
          {project.highlights.map((h) => (
            <li key={h.label.en}>
              <span className="block text-2xl font-light text-brand tabular-nums sm:text-3xl">{h.value}</span>
              <span className="mt-1 block text-xs leading-snug text-muted sm:text-sm">{h.label[locale]}</span>
            </li>
          ))}
        </ul>

        <Link href={href} className={buttonClasses("primary", "mt-8 w-full sm:w-auto")}>
          {p.explore}
          <Arrow />
        </Link>
        <RoofMark className="pointer-events-none absolute -bottom-3 w-16 opacity-20 ltr:right-6 rtl:left-6" />
      </div>
    </article>
  );
}

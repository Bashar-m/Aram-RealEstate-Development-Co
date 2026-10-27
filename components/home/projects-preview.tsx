import Link from "next/link";
import { Arrow, TextLink, buttonClasses } from "@/components/ui/button";
import { MediaImage } from "@/components/projects/media-image";
import { ProgressBadge } from "@/components/projects/progress-badge";
import type { Messages } from "@/lib/i18n";
import { getFeaturedProject } from "@/lib/projects";
import { pagePath, projectPath, type Locale } from "@/lib/routes";

/** "From our projects" — a single featured project on the home page. */
export async function ProjectsPreview({ locale, t }: { locale: Locale; t: Messages }) {
  const project = await getFeaturedProject();
  if (!project) return null;
  const h = t.home.projects;
  const href = projectPath(locale, project.slug);

  return (
    <section aria-labelledby="home-projects-title" className="section-y overflow-hidden pt-0 sm:pt-0 lg:pt-0">
      <div className="container-site">
        <div className="grid items-end gap-6 border-t border-line pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-24">
          <div data-reveal className="lg:col-span-7">
            <p className="eyebrow">{h.eyebrow}</p>
            <h2 id="home-projects-title" className="mt-5 text-[1.875rem] leading-[1.3] font-semibold sm:text-4xl lg:text-[2.75rem]">
              {project.name[locale]}{" "}
              {project.code && (
                <span dir="ltr" className="text-gold">
                  {project.code}
                </span>
              )}
            </h2>
          </div>
          <div data-reveal className="flex lg:col-span-5 lg:justify-end">
            <TextLink href={pagePath(locale, "projects")}>{h.all}</TextLink>
          </div>
        </div>

        <Link
          href={href}
          data-reveal
          className="group relative mt-10 block overflow-hidden rounded-2xl bg-brand-deep lg:mt-14"
          aria-label={`${h.link}: ${project.name[locale]}`}
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[21/9]">
            <MediaImage
              media={project.hero}
              locale={locale}
              fill
              sizes="(min-width: 1320px) 1240px, 100vw"
              className="object-[50%_35%] transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
            />
            <span aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-deep/90 via-brand-deep/25 to-transparent lg:via-brand-deep/10" />
          </div>
          <div className="on-dark relative grid gap-6 p-6 text-white sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-10 lg:grid-cols-12 lg:items-end lg:p-12">
            <div className="lg:col-span-5">
              {project.progress && <ProgressBadge label={project.progress[locale]} tone="dark" />}
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{project.tagline[locale]}</p>
            </div>
            <ul className="grid grid-cols-3 gap-4 lg:col-span-4 lg:col-start-6">
              {project.highlights.map((f) => (
                <li key={f.label.en} className="border-s border-white/25 ps-3 sm:ps-4">
                  <span className="block text-2xl font-light tabular-nums sm:text-4xl">{f.value}</span>
                  <span className="mt-1 block text-xs text-white/75 sm:text-sm">{f.label[locale]}</span>
                </li>
              ))}
            </ul>
            <span className={buttonClasses("secondary", "w-full sm:w-fit lg:col-span-3 lg:justify-self-end")}>
              {h.link}
              <Arrow />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

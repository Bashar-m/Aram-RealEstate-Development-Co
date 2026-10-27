import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectCard } from "@/components/projects/project-card";
import { CtaBand } from "@/components/ui/cta-band";
import { RoofLines } from "@/components/ui/roof";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getPublishedProjects } from "@/lib/projects";
import Link from "next/link";
import { pagePath } from "@/lib/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">) {
  return pageMetadata(await resolveLocale(params), "projects");
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const p = t.projects;
  const projects = await getPublishedProjects();
  const featured = projects.find((x) => x.featured) ?? projects[0];
  const others = projects.filter((x) => x !== featured);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <RoofLines className="absolute -top-24 -z-10 w-[46rem] text-brand/10 max-sm:w-[30rem] ltr:-right-40 rtl:-left-40" />
        <div className="container-site grid gap-8 pt-14 pb-14 sm:pt-20 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pt-28 lg:pb-20">
          <div className="lg:col-span-8">
            <nav aria-label={t.header.breadcrumb} className="animate-rise">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <li>
                  <Link href={pagePath(locale, "home")} className="hover:text-brand hover:underline">
                    {t.nav.home}
                  </Link>
                </li>
                <li aria-hidden className="opacity-60">/</li>
                <li aria-current="page" className="text-ink">{p.hero.eyebrow}</li>
              </ol>
            </nav>
            <h1 className="animate-rise mt-7" style={{ "--delay": "120ms" } as React.CSSProperties}>
              <span className="eyebrow">{p.hero.eyebrow}</span>
              <span className="mt-5 block text-[2.5rem] leading-[1.2] font-semibold sm:text-6xl lg:text-7xl">{p.hero.title}</span>
            </h1>
          </div>
          <div className="animate-rise lg:col-span-4" style={{ "--delay": "240ms" } as React.CSSProperties}>
            <p className="text-lg leading-relaxed text-muted">{p.hero.description}</p>
            <p className="mt-6 flex items-baseline gap-3 border-t border-line pt-5">
              <span className="text-5xl font-light text-brand tabular-nums">{String(projects.length).padStart(2, "0")}</span>
              <span className="text-sm font-medium text-muted">{p.countLabel}</span>
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <section aria-label={p.featured} className="pb-20 sm:pb-24 lg:pb-32">
          <div className="container-site">
            <FeaturedProject project={featured} locale={locale} t={t} priority />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="more-projects" className="bg-stone section-y">
          <div className="container-site">
            <h2 id="more-projects" className="eyebrow">
              {p.others}
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand locale={locale} t={t} className="pb-20 sm:pb-24 lg:pb-32" />
    </>
  );
}

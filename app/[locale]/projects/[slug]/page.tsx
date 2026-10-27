import { notFound } from "next/navigation";
import { ArchitecturalGallery } from "@/components/projects/architectural-gallery";
import { FloorPlanExplorer } from "@/components/projects/floor-plan-explorer";
import { ProjectBrochure } from "@/components/projects/project-brochure";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectOverview } from "@/components/projects/project-overview";
import { ProjectStory } from "@/components/projects/project-story";
import { TextLink } from "@/components/ui/button";
import { CtaBand } from "@/components/ui/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { projectMetadata } from "@/lib/metadata";
import { getProject, getPublishedProjects } from "@/lib/projects";
import { pagePath } from "@/lib/routes";

// Only projects that exist at build time; anything else is a 404
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPublishedProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const locale = await resolveLocale(params);
  const project = await getProject((await params).slug);
  if (!project) notFound();
  return projectMetadata(locale, project);
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const locale = await resolveLocale(params);
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const t = getMessages(locale);
  const p = t.projects;
  const brochure = project.documents[0];

  return (
    <>
      <ProjectHero project={project} locale={locale} t={t} />
      <ProjectOverview project={project} locale={locale} t={t} />
      <ProjectStory project={project} locale={locale} t={t} />

      {project.floors.length > 0 && (
        <section id="floor-plans" aria-labelledby="floor-plans-title" className="section-y bg-stone">
          <div className="container-site">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <SectionHeading id="floor-plans-title" eyebrow={p.explorer.eyebrow} title={p.explorer.title} className="lg:col-span-7" />
              <p data-reveal className="max-w-xl text-lg leading-relaxed text-muted lg:col-span-5">
                {p.explorer.intro}
              </p>
            </div>
            <div className="mt-12 lg:mt-16">
              <FloorPlanExplorer locale={locale} floors={project.floors} groups={project.floorGroups} note={project.floorsNote} t={p.explorer} />
            </div>
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="on-dark section-y overflow-hidden bg-brand-deep text-white">
          <div className="container-site">
            <SectionHeading id="gallery-title" eyebrow={p.gallery.eyebrow} title={p.gallery.title} className="max-w-3xl" />
            <div className="mt-12 lg:mt-16">
              <ArchitecturalGallery items={project.gallery} locale={locale} t={p.gallery} />
            </div>
            {project.imageryNote && <p className="mt-8 text-sm text-white/60">{project.imageryNote[locale]}</p>}
          </div>
        </section>
      )}

      {brochure && <ProjectBrochure doc={brochure} locale={locale} t={t} />}

      <div className="container-site">
        <TextLink href={pagePath(locale, "projects")}>{p.detail.back}</TextLink>
      </div>
      <CtaBand locale={locale} t={t} className="pt-10 pb-20 sm:pb-24 lg:pb-32" />
    </>
  );
}

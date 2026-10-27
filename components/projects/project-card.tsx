import Link from "next/link";
import { Arrow } from "@/components/ui/button";
import type { Project } from "@/data/projects/types";
import type { Messages } from "@/lib/i18n";
import { projectPath, type Locale } from "@/lib/routes";
import { MediaImage } from "./media-image";
import { ProgressBadge } from "./progress-badge";

/** Compact card for additional (non-featured) projects. */
export function ProjectCard({ project, locale, t }: { project: Project; locale: Locale; t: Messages }) {
  return (
    <article className="group">
      <Link href={projectPath(locale, project.slug)} className="block rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone">
          <MediaImage
            media={project.card}
            locale={locale}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-1000 group-hover:scale-[1.04]"
          />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold transition-colors group-hover:text-brand">
              {project.name[locale]}
              {project.code && <span dir="ltr" className="ms-2 text-base font-medium text-muted">{project.code}</span>}
            </h3>
            <p className="mt-1 text-sm text-muted">{project.type[locale]}</p>
          </div>
          {project.progress && <ProgressBadge label={project.progress[locale]} />}
        </div>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
          {t.projects.explore}
          <Arrow />
        </span>
      </Link>
    </article>
  );
}

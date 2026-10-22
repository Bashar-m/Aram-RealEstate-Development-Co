import { FileClock, Plus } from "lucide-react";
import { CtaBand } from "@/components/ui/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { getMessages, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/policies">) {
  return pageMetadata(await resolveLocale(params), "policies");
}

export default async function PoliciesPage({ params }: PageProps<"/[locale]/policies">) {
  const locale = await resolveLocale(params);
  const t = getMessages(locale);
  const p = t.policies;

  return (
    <>
      <PageHero locale={locale} t={t} eyebrow={p.hero.eyebrow} title={p.hero.title} description={p.hero.description} />

      <section className="section-y">
        <div className="container-site">
          {/* Draft notice — required until the policies are legally approved */}
          <div
            role="note"
            data-reveal
            className="flex flex-col gap-4 rounded-2xl border border-gold/40 bg-gold-light/15 p-6 sm:flex-row sm:gap-5 sm:p-8"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gold-light/40 text-brand-deep">
              <FileClock aria-hidden strokeWidth={1.6} className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">{p.notice.title}</h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-ink/80">{p.notice.text}</p>
              <p className="mt-3 text-sm font-semibold text-gold-ink">{p.status}</p>
            </div>
          </div>

          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
            <aside className="lg:col-span-4">
              <nav aria-labelledby="toc-title" className="lg:sticky lg:top-28">
                <h2 id="toc-title" className="eyebrow">
                  {p.tocLabel}
                </h2>
                <ol className="mt-6 flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-s lg:border-line">
                  {p.sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex min-h-11 items-center gap-3 rounded-full border border-line px-4 text-[0.9375rem] text-ink/80 transition-colors hover:border-brand hover:text-brand lg:-ms-px lg:rounded-none lg:border-0 lg:border-s-2 lg:border-transparent lg:ps-5 lg:hover:border-gold"
                      >
                        <span className="text-xs font-medium text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="space-y-4 lg:col-span-8">
              {p.sections.map((s, i) => (
                <details
                  key={s.id}
                  id={s.id}
                  open={i === 0}
                  data-reveal
                  className="accordion group rounded-2xl border border-line bg-white/70 transition-colors open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl p-6 sm:gap-6 sm:p-8">
                    <span className="text-sm font-medium text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="flex-1 text-xl font-semibold sm:text-2xl">{s.title}</h2>
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand/20 text-brand transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-white">
                      <Plus aria-hidden strokeWidth={1.75} className="size-5" />
                    </span>
                  </summary>
                  <div className="px-6 pb-8 sm:px-8 sm:ps-[4.75rem]">
                    <p className="text-lg leading-relaxed text-muted">{s.summary}</p>
                    <ul className="mt-6 space-y-4">
                      {s.points.map((point) => (
                        <li key={point} className="flex gap-4 leading-relaxed">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} t={t} className="pb-20 sm:pb-24 lg:pb-32" />
    </>
  );
}

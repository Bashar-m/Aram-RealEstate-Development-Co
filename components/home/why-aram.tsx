import { Photo } from "@/components/ui/photo";
import { RoofMark } from "@/components/ui/roof";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Messages } from "@/lib/i18n";

export function WhyAram({ t }: { t: Messages }) {
  const w = t.home.why;

  return (
    <section aria-labelledby="why-title" className="section-y bg-stone">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div data-reveal className="relative lg:sticky lg:top-28">
            <Photo
              image="villaTerrace"
              alt={t.images.villaTerrace}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="aspect-[4/3] rounded-2xl sm:aspect-[16/10] lg:aspect-[4/5]"
            />
            <div className="absolute -top-7 end-6 rounded-xl bg-stone px-4 pt-4 pb-3 sm:end-10">
              <RoofMark className="w-16 sm:w-20" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading id="why-title" eyebrow={w.eyebrow} title={w.title}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{w.intro}</p>
          </SectionHeading>

          <ol className="mt-12 border-t border-brand/15">
            {w.points.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-brand/15 py-8 sm:grid-cols-[4.5rem_1fr] sm:gap-x-6"
              >
                <span aria-hidden className="text-3xl leading-none font-light text-gold tabular-nums sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

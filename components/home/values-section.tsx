import type { CSSProperties } from "react";
import { Leaf, Lightbulb, Ruler, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Messages } from "@/lib/i18n";

// One icon per value, in the same order as messages.home.values.items
const icons = [Ruler, ShieldCheck, Lightbulb, Leaf];

export function ValuesSection({ t }: { t: Messages }) {
  const v = t.home.values;

  return (
    <section aria-labelledby="values-title" className="section-y">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <SectionHeading id="values-title" eyebrow={v.eyebrow} title={v.title} className="lg:col-span-6" />
          <p data-reveal className="max-w-xl text-lg leading-relaxed text-muted lg:col-span-5 lg:col-start-8">
            {v.intro}
          </p>
        </div>

        {/* Hairline grid: 1 → 2 → 4 columns */}
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {v.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={item.title} className="group relative bg-ivory transition-colors duration-500 hover:bg-white">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 ltr:origin-left rtl:origin-right"
                />
                <div
                  data-reveal
                  style={{ "--delay": `${i * 90}ms` } as CSSProperties}
                  className="flex h-full flex-col p-7 sm:p-8 lg:min-h-[21rem] lg:p-9"
                >
                  <div className="flex items-start justify-between">
                    <Icon aria-hidden strokeWidth={1.35} className="size-8 text-brand transition-transform duration-500 group-hover:-translate-y-0.5" />
                    <span className="text-sm font-medium text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-12 text-xl font-semibold sm:text-[1.375rem] lg:mt-28">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

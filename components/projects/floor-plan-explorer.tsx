"use client";

import Image from "next/image";
import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { FloorGroupId, Localized, ProjectFloor, ProjectMedia } from "@/data/projects/types";
import { cn } from "@/lib/cn";
import { format } from "@/lib/format";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";
import { ZoomPan } from "./zoom-pan";

type ExplorerText = Messages["projects"]["explorer"];

type FloorPlanExplorerProps = {
  locale: Locale;
  floors: ProjectFloor[];
  groups: { id: FloorGroupId; label: Localized }[];
  note?: Localized;
  t: ExplorerText;
};

// Width of each band in the building section — basements span the plot,
// the podium is wide, the towers narrower, the roof narrowest.
function barWidth(floor: ProjectFloor) {
  if (floor.group === "basements") return "w-full";
  if (floor.level <= 2) return "w-[84%]";
  if (floor.level >= 22) return "w-[44%]";
  return "w-[58%]";
}

/**
 * Interactive building explorer: pick a level on the building section (desktop) or via
 * groups + floor chips (mobile) to see its published 2D plan / 3D view, zoomable.
 */
export function FloorPlanExplorer({ locale, floors, groups, note, t }: FloorPlanExplorerProps) {
  const ordered = useMemo(() => [...floors].sort((a, b) => a.level - b.level), [floors]);
  const [floorId, setFloorId] = useState(() => (ordered.find((f) => f.group === "residential") ?? ordered[0]).id);
  const [view, setView] = useState<"2d" | "3d">("2d");
  const chipRow = useRef<HTMLDivElement>(null);
  const diagram = useRef<HTMLDivElement>(null);

  const index = ordered.findIndex((f) => f.id === floorId);
  const floor = ordered[index];
  const groupFloors = ordered.filter((f) => f.group === floor.group);
  const media: ProjectMedia | undefined = view === "2d" ? (floor.plan2d ?? floor.plan3d) : (floor.plan3d ?? floor.plan2d);

  // Keep the active chip visible in the mobile scroller
  useEffect(() => {
    const row = chipRow.current;
    const chip = row?.querySelector<HTMLElement>(`[data-floor="${floorId}"]`);
    if (!row || !chip) return;
    row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [floorId]);

  const step = (delta: number) => {
    const next = ordered[index + delta];
    if (next) setFloorId(next.id);
  };

  // Building section behaves like a radio group: ↑/↓ move between levels
  const onDiagramKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0;
    const next = ordered[index + delta];
    if (!delta || !next) return;
    e.preventDefault();
    setFloorId(next.id);
    diagram.current?.querySelector<HTMLElement>(`[data-floor="${next.id}"]`)?.focus();
  };

  const listed = floor.units?.length ?? 0;
  const top = [...ordered].reverse();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Building section — desktop */}
      <div className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-28">
          <p id="building-label" className="mb-5 text-sm font-semibold text-muted">
            {t.building}
          </p>
          <div ref={diagram} role="radiogroup" aria-labelledby="building-label" onKeyDown={onDiagramKey} className="flex flex-col">
            {top.map((f) => {
              const active = f.id === floorId;
              const sameGroup = f.group === floor.group;
              return (
                <Fragment key={f.id}>
                  {f.level === -1 && (
                    <div aria-hidden className="my-2 flex items-center gap-2 text-[10px] font-medium text-gold-ink">
                      <span className="h-px flex-1 bg-gold/60" />
                      {t.ground}
                      <span className="h-px flex-1 bg-gold/60" />
                    </div>
                  )}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={f.label[locale]}
                    tabIndex={active ? 0 : -1}
                    data-floor={f.id}
                    onClick={() => setFloorId(f.id)}
                    className="group/row flex w-full items-center gap-3 rounded-sm py-[1.5px] outline-offset-1"
                  >
                    <span
                      className={cn(
                        "w-8 shrink-0 text-end text-[11px] tabular-nums transition-colors",
                        active ? "font-bold text-brand" : "text-muted group-hover/row:text-ink",
                      )}
                    >
                      {f.short[locale]}
                    </span>
                    <span className="flex flex-1 justify-center">
                      <span
                        className={cn(
                          "block rounded-[2px] transition-[background-color,transform] duration-300",
                          barWidth(f),
                          f.group === "residential" ? "h-2.5" : "h-3.5",
                          active
                            ? "scale-x-[1.04] bg-brand"
                            : sameGroup
                              ? "bg-brand/30 group-hover/row:bg-gold-light"
                              : "bg-brand/12 group-hover/row:bg-gold-light",
                        )}
                      />
                    </span>
                  </button>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-9">
        {/* Groups */}
        <div role="group" aria-label={t.groups} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {groups.map((g) => {
            const active = g.id === floor.group;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFloorId((ordered.find((f) => f.group === g.id) ?? floor).id)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors",
                  active ? "border-brand bg-brand text-white" : "border-line bg-white/60 text-ink/80 hover:border-brand/50 hover:text-brand",
                )}
              >
                {g.label[locale]}
              </button>
            );
          })}
        </div>

        {/* Floors in the group — mobile & tablet */}
        <div className="mt-4 flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={index === 0}
            aria-label={t.prev}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-brand disabled:opacity-35"
          >
            <ArrowDown aria-hidden className="size-4" />
          </button>
          <div ref={chipRow} role="group" aria-label={t.floors} className="no-scrollbar relative flex flex-1 gap-1.5 overflow-x-auto scroll-smooth py-1">
            {groupFloors.map((f) => {
              const active = f.id === floorId;
              return (
                <button
                  key={f.id}
                  type="button"
                  data-floor={f.id}
                  aria-pressed={active}
                  aria-label={f.label[locale]}
                  onClick={() => setFloorId(f.id)}
                  className={cn(
                    "min-h-11 min-w-11 shrink-0 rounded-lg px-3 text-sm font-semibold tabular-nums transition-colors",
                    active ? "bg-gold-light text-brand-deep" : "bg-white/70 text-ink/75",
                  )}
                >
                  {f.short[locale]}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={index === ordered.length - 1}
            aria-label={t.next}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-brand disabled:opacity-35"
          >
            <ArrowUp aria-hidden className="size-4" />
          </button>
        </div>

        {/* Stage */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
            <div aria-live="polite">
              <h3 className="text-xl font-semibold sm:text-2xl">{floor.label[locale]}</h3>
              <p className="mt-0.5 text-sm text-muted">{groups.find((g) => g.id === floor.group)?.label[locale]}</p>
            </div>
            {floor.plan2d && floor.plan3d && (
              <div role="radiogroup" aria-label={floor.label[locale]} className="flex rounded-full bg-stone p-1">
                {(["2d", "3d"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={view === v}
                    onClick={() => setView(v)}
                    className={cn(
                      "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                      view === v ? "bg-white text-brand shadow-sm" : "text-ink/70 hover:text-brand",
                    )}
                  >
                    {v === "2d" ? t.view2d : t.view3d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {media && (
            <ZoomPan
              key={media.src}
              labels={{ zoomIn: t.zoomIn, zoomOut: t.zoomOut, reset: t.reset, hint: t.zoomHint }}
              className="aspect-[4/5] bg-[#fbfbf9] sm:aspect-[4/3] lg:aspect-[16/11]"
            >
              <PlanImage media={media} locale={locale} />
            </ZoomPan>
          )}

          {/* Documented details for the selected level */}
          <div className="grid gap-6 border-t border-line px-5 py-6 sm:px-7 md:grid-cols-[1fr_auto]">
            <div>
              {floor.description && <p className="max-w-xl leading-relaxed">{floor.description[locale]}</p>}
              {floor.parking !== undefined && (
                <p className="flex items-baseline gap-3">
                  <span className="text-4xl font-light text-brand tabular-nums">{floor.parking}</span>
                  <span className="font-medium">{t.parking}</span>
                </p>
              )}
              {floor.units && (
                <table className="w-full max-w-lg text-sm">
                  <caption className="mb-3 text-start font-semibold">{t.units}</caption>
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th scope="col" className="py-2 text-start font-medium">{t.unit}</th>
                      <th scope="col" className="py-2 text-start font-medium">{t.unitType}</th>
                      <th scope="col" className="py-2 text-end font-medium">{t.area}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floor.units.map((u) => (
                      <tr key={`${u.number}-${u.area}`} className="border-b border-line/70">
                        <td className="py-2.5 font-semibold tabular-nums">{u.number}</td>
                        <td className="py-2.5">
                          {u.type === "duplex" ? (
                            <span className="rounded-full bg-gold-light/25 px-2 py-0.5 text-xs font-semibold text-gold-ink">{t.duplex}</span>
                          ) : (
                            t.apartment
                          )}
                        </td>
                        <td className="py-2.5 text-end tabular-nums">
                          {u.area} {t.sqm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {floor.statedUnitCount !== undefined && floor.statedUnitCount !== listed && (
                <p className="mt-3 text-xs text-muted">{format(t.statedNote, { n: floor.statedUnitCount })}</p>
              )}
            </div>
            <p className="text-xs text-gold-ink md:text-end">{format(t.pages, { pages: floor.pdfPages.join(locale === "ar" ? "، " : ", ") })}</p>
          </div>
        </div>

        {note && <p className="mt-5 text-sm leading-relaxed text-muted">{note[locale]}</p>}
      </div>
    </div>
  );
}

/** One drawing, with a soft placeholder until it has loaded. Remounts per image. */
function PlanImage({ media, locale }: { media: ProjectMedia; locale: Locale }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div aria-hidden className="absolute inset-6 animate-pulse rounded-xl bg-stone/70" />}
      <Image
        src={media.src}
        alt={media.alt[locale]}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        onLoad={() => setLoaded(true)}
        draggable={false}
        className={cn("object-contain p-3 transition-opacity duration-500 sm:p-6", loaded ? "opacity-100" : "opacity-0")}
      />
    </>
  );
}

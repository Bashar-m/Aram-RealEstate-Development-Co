"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Download, ExternalLink, Maximize, Minus, Plus, X } from "lucide-react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { buttonClasses } from "@/components/ui/button";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";

type PdfJs = typeof import("pdfjs-dist");

type PdfViewerProps = {
  file: string;
  title: string;
  pageCount: number;
  locale: Locale;
  labels: Messages["projects"]["viewer"];
  actions: { download: string; openTab: string };
  onClose: () => void;
};

const ZOOMS = [1, 1.5, 2, 3];

/**
 * Brochure viewer (PDF.js, loaded on demand).
 * - Fetches the file in 256 KB ranges, so the first page appears before the whole PDF downloads.
 * - Renders ONE page at a time to a canvas — never all pages in the DOM.
 * - Pages are numbered as in the file; the Arabic brochure reads right-to-left,
 *   so arrows and swipes follow the reading direction.
 */
export default function PdfViewer({ file, title, pageCount, locale, labels, actions, onClose }: PdfViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const doc = useRef<PDFDocumentProxy | null>(null);
  const swipe = useRef<number | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(pageCount);
  const [zoom, setZoom] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const rtl = locale === "ar";

  const goTo = (n: number) => setPage(Math.min(numPages, Math.max(1, n)));

  // Open as a modal dialog and lock the page behind it
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
      el?.close();
    };
  }, []);

  // Track the stage size so pages fit the screen
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load PDF.js + the document
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<PdfJs["getDocument"]> | null = null;

    (async () => {
      // Legacy build = wider browser support (older iOS Safari)
      const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.min.mjs")) as PdfJs;
      if (!pdfjs.GlobalWorkerOptions.workerPort) {
        pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url), {
          type: "module",
        });
      }
      task = pdfjs.getDocument({ url: file, disableAutoFetch: true, rangeChunkSize: 1 << 18 });
      task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
        if (!cancelled && total) setProgress(Math.min(99, Math.round((loaded / total) * 100)));
      };
      const pdf = await task.promise;
      if (cancelled) return;
      doc.current = pdf;
      setNumPages(pdf.numPages);
      setStatus("ready");
    })().catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
      doc.current = null;
      task?.destroy();
    };
  }, [file]);

  // Render the current page into a fresh canvas, then swap it in (no flashing)
  useEffect(() => {
    const pdf = doc.current;
    if (status !== "ready" || !pdf || !size.w || !holder.current) return;
    let cancelled = false;
    let task: RenderTask | null = null;

    (async () => {
      const pdfPage = await pdf.getPage(page);
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const fit = Math.min((size.w - 24) / base.width, (size.h - 24) / base.height);
      const cssScale = fit * ZOOMS[zoom];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: cssScale * dpr });

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
      canvas.className = "block max-w-none rounded-sm bg-white shadow-2xl";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `${title} — ${labels.page} ${page}`);

      task = pdfPage.render({ canvas, viewport });
      await task.promise;
      if (cancelled) return;
      holder.current?.replaceChildren(canvas);
      // Warm up the next page
      if (page < pdf.numPages) pdf.getPage(page + 1).catch(() => {});
    })().catch((error: { name?: string }) => {
      if (!cancelled && error?.name !== "RenderingCancelledException") setStatus("error");
    });

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [status, page, zoom, size, title, labels.page]);

  // Keyboard: arrows follow reading direction, PageUp/PageDown, Home/End
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const back = rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward || e.key === "PageDown") setPage((p) => Math.min(numPages, p + 1));
      else if (e.key === back || e.key === "PageUp") setPage((p) => Math.max(1, p - 1));
      else if (e.key === "Home") setPage(1);
      else if (e.key === "End") setPage(numPages);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numPages, rtl]);

  const onPointerDown = (e: PointerEvent) => {
    if (zoom === 0) swipe.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) < 60) return;
    goTo(page + ((dx > 0) === rtl ? 1 : -1));
  };

  const icon = "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent";
  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-label={title}
      className="on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-[#1d2815] p-0 text-white backdrop:bg-black/60"
    >
      <div className="flex h-full flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2 sm:px-5">
          <p className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-base">{title}</p>
          <a href={file} download className={icon} aria-label={actions.download} title={actions.download}>
            <Download aria-hidden className="size-5" strokeWidth={1.75} />
          </a>
          <a href={file} target="_blank" rel="noopener" className={icon} aria-label={actions.openTab} title={actions.openTab}>
            <ExternalLink aria-hidden className="size-5" strokeWidth={1.75} />
          </a>
          <button type="button" onClick={() => dialog.current?.close()} className={icon} aria-label={labels.close}>
            <X aria-hidden strokeWidth={1.75} />
          </button>
        </div>

        {/* Page stage */}
        <div ref={stage} className="relative min-h-0 flex-1" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div className="absolute inset-0 overflow-auto overscroll-contain">
            <div ref={holder} className="flex min-h-full w-max min-w-full items-center justify-center p-3" />
          </div>

          {status === "loading" && (
            <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center">
              <span aria-hidden className="size-12 animate-spin rounded-full border-2 border-white/15 border-t-gold-light" />
              <p className="font-medium">{labels.loading}</p>
              <p className="text-sm text-white/60 tabular-nums">{progress}%</p>
            </div>
          )}

          {status === "error" && (
            <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <AlertTriangle aria-hidden className="size-10 text-gold-light" strokeWidth={1.5} />
              <p className="text-lg font-semibold">{labels.errorTitle}</p>
              <p className="max-w-sm text-white/70">{labels.errorText}</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a href={file} target="_blank" rel="noopener" className={buttonClasses("secondary")}>
                  <ExternalLink aria-hidden className="size-4" />
                  {actions.openTab}
                </a>
                <a href={file} download className={buttonClasses("outlineLight")}>
                  <Download aria-hidden className="size-4" />
                  {actions.download}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="border-t border-white/10 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-5">
          <input
            type="range"
            min={1}
            max={numPages}
            value={page}
            onChange={(e) => goTo(Number(e.target.value))}
            aria-label={labels.slider}
            disabled={status !== "ready"}
            className="w-full accent-[var(--color-gold-light)] rtl:[direction:rtl]"
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button type="button" className={icon} onClick={() => goTo(page - 1)} disabled={page <= 1 || status !== "ready"} aria-label={labels.prev}>
                <Prev aria-hidden />
              </button>
              <label className="flex items-center gap-2 text-sm tabular-nums">
                <span className="sr-only sm:not-sr-only">{labels.page}</span>
                <input
                  key={page}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={numPages}
                  defaultValue={page}
                  disabled={status !== "ready"}
                  onKeyDown={(e) => e.key === "Enter" && goTo(Number(e.currentTarget.value))}
                  onBlur={(e) => goTo(Number(e.currentTarget.value) || page)}
                  className="h-10 w-14 rounded-lg border border-white/20 bg-white/10 text-center text-white"
                />
                <span className="text-white/70">
                  {labels.of} {numPages}
                </span>
              </label>
              <button type="button" className={icon} onClick={() => goTo(page + 1)} disabled={page >= numPages || status !== "ready"} aria-label={labels.next}>
                <Next aria-hidden />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" className={icon} onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label={labels.zoomOut}>
                <Minus aria-hidden className="size-4" />
              </button>
              <button type="button" className={`${icon} hidden sm:inline-flex`} onClick={() => setZoom(0)} disabled={zoom === 0} aria-label={labels.fit}>
                <Maximize aria-hidden className="size-4" />
              </button>
              <button type="button" className={icon} onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoom === ZOOMS.length - 1} aria-label={labels.zoomIn}>
                <Plus aria-hidden className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

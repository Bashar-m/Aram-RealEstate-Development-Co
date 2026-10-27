"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";

// PDF.js and the viewer are fetched only after the first click
const PdfViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

type BrochureViewerButtonProps = {
  file: string;
  title: string;
  pageCount: number;
  locale: Locale;
  label: string;
  labels: Messages["projects"]["viewer"];
  actions: { download: string; openTab: string };
};

export function BrochureViewerButton({ label, ...viewer }: BrochureViewerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClasses("primary", "cursor-pointer")} aria-haspopup="dialog">
        <BookOpen aria-hidden className="size-4" strokeWidth={1.75} />
        {label}
      </button>
      {open && <PdfViewer {...viewer} onClose={() => setOpen(false)} />}
    </>
  );
}

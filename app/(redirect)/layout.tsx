import type { Metadata } from "next";
import { company } from "@/data/company";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Root layout for "/" only. Every real page lives under app/[locale].
export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: company.name.ar,
  alternates: { canonical: "/ar/" },
  robots: { index: false, follow: true },
};

export default function RedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}

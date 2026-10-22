import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { LogoPrimary } from "@/components/ui/logo";
import { RoofLines } from "@/components/ui/roof";
import { company } from "@/data/company";
import { fontVariables } from "@/lib/fonts";
import { pagePath } from "@/lib/routes";
import "./globals.css";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة | Page not found",
};

// Bilingual 404 for any unmatched URL (exported as out/404.html).
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>
        <main className="relative isolate flex min-h-svh items-center overflow-hidden bg-ivory py-16">
          <RoofLines className="absolute -bottom-10 -left-24 -z-10 w-[40rem] text-brand/10" />
          <div className="container-site flex flex-col items-center text-center">
            <Link href={pagePath("ar", "home")} className="rounded-sm">
              <LogoPrimary alt={company.name.ar} className="w-36" />
            </Link>
            <p className="mt-12 text-7xl font-semibold text-gold sm:text-8xl">404</p>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">الصفحة غير موجودة</h1>
            <p className="mt-3 text-lg text-muted">عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
            <p lang="en" dir="ltr" className="mt-6 font-[family-name:var(--font-inter)] text-muted">
              Sorry, we couldn’t find the page you were looking for.
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href={pagePath("ar", "home")} className={buttonClasses("primary")}>
                العودة إلى الرئيسية
              </Link>
              <Link href={pagePath("en", "home")} lang="en" className={buttonClasses("outline", "font-[family-name:var(--font-inter)]")}>
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

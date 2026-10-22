import Link from "next/link";
import { LogoPrimary } from "@/components/ui/logo";
import { company } from "@/data/company";
import { defaultLocale, pagePath } from "@/lib/routes";

// A static export has no server redirects, so "/" sends visitors to the
// default (Arabic) site with a meta refresh, plus a visible fallback link.
export default function RootRedirect() {
  const target = pagePath(defaultLocale, "home");

  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-ivory p-6 text-center">
        <LogoPrimary alt={company.name.ar} className="w-40" />
        <p className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-brand">
          <Link href={target} className="font-semibold underline underline-offset-4">
            الانتقال إلى الموقع
          </Link>
          <Link href={pagePath("en", "home")} lang="en" className="underline underline-offset-4">
            English
          </Link>
        </p>
      </main>
    </>
  );
}

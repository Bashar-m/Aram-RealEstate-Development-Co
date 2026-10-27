"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Languages, Menu, X } from "lucide-react";
import { Arrow, buttonClasses } from "@/components/ui/button";
import { LogoLockup } from "@/components/ui/logo";
import { RoofLines } from "@/components/ui/roof";
import { cn } from "@/lib/cn";
import { normalizePath, otherLocale, switchLocalePath, type Locale } from "@/lib/routes";

type NavItem = { href: string; label: string };

type HeaderBarProps = {
  locale: Locale;
  homeHref: string;
  contactHref: string;
  items: NavItem[];
  labels: {
    contactCta: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
    homeLink: string;
    switchLanguage: string;
    switchLanguageShort: string;
    switchLanguageLabel: string;
  };
};

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function HeaderBar({ locale, homeHref, contactHref, items, labels }: HeaderBarProps) {
  const pathname = normalizePath(usePathname());
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 12, () => false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const target = otherLocale(locale);
  const switchHref = switchLocalePath(pathname, target);

  // Mobile menu: lock page scroll, trap focus, close on Escape / desktop resize
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel || !toggle) return;
      const focusables = [toggle, ...panel.querySelectorAll<HTMLElement>("a, button")];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500",
          scrolled || open
            ? "border-line/80 bg-ivory/92 shadow-[0_10px_30px_-18px_rgb(40_55_29/0.35)] backdrop-blur-md"
            : "border-transparent bg-ivory",
        )}
      >
        <div
          className={cn(
            "container-site flex items-center justify-between gap-4 transition-[height] duration-500",
            scrolled ? "h-16 lg:h-[4.5rem]" : "h-16 lg:h-20",
          )}
        >
          <Link href={homeHref} aria-label={labels.homeLink} className="shrink-0 rounded-sm" onClick={close}>
            <LogoLockup />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label={labels.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block px-3 py-2 text-[0.9375rem] font-medium transition-colors xl:px-4",
                        "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-center after:bg-gold after:transition-transform after:duration-300 xl:after:inset-x-4",
                        active
                          ? "text-brand after:scale-x-100"
                          : "text-ink/75 after:scale-x-0 hover:text-brand hover:after:scale-x-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href={switchHref}
              hrefLang={target}
              lang={target}
              aria-label={labels.switchLanguageLabel}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-semibold text-brand transition-colors hover:bg-stone sm:px-3"
            >
              <Languages aria-hidden strokeWidth={1.75} className="size-[1.15rem] text-gold" />
              <span className="hidden sm:inline">{labels.switchLanguage}</span>
              <span className="sm:hidden">{labels.switchLanguageShort}</span>
            </Link>

            <div className="hidden xl:block">
              <Link href={contactHref} className={buttonClasses("primary", "min-h-11 px-5")}>
                {labels.contactCta}
              </Link>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? labels.closeMenu : labels.openMenu}
              className="inline-flex size-11 items-center justify-center rounded-lg text-brand transition-colors hover:bg-stone lg:hidden"
            >
              {open ? <X aria-hidden strokeWidth={1.75} /> : <Menu aria-hidden strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — rendered outside <header> so `fixed` isn't trapped by its backdrop-filter */}
      <div
        ref={panelRef}
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-ivory lg:hidden",
          // Visibility flips instantly on open (so focus can move in) and only after the fade on close
          open
            ? "visible translate-y-0 opacity-100 [transition:opacity_.5s_var(--ease-soft),transform_.5s_var(--ease-soft),visibility_0s]"
            : "invisible -translate-y-3 opacity-0 [transition:opacity_.5s_var(--ease-soft),transform_.5s_var(--ease-soft),visibility_0s_.5s]",
        )}
      >
        <RoofLines className="absolute -bottom-6 w-[30rem] text-brand/10 ltr:-right-32 rtl:-left-32" />
        <nav aria-label={labels.mainNav} className="container-site relative pt-6">
          <ul>
            {items.map((item, i) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="group flex min-h-16 items-center gap-4 py-3 text-[1.375rem] font-semibold sm:text-2xl"
                  >
                    <span className="w-7 text-sm font-medium text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("flex-1", active ? "text-brand" : "text-ink")}>{item.label}</span>
                    {active ? (
                      <span aria-hidden className="size-2 rotate-45 bg-gold" />
                    ) : (
                      <Arrow className="text-muted" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="container-site relative mt-auto pt-10 pb-8">
          <Link href={contactHref} onClick={close} className={buttonClasses("primary", "w-full")}>
            {labels.contactCta}
            <Arrow />
          </Link>
        </div>
      </div>
    </>
  );
}

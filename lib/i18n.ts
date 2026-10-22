import { notFound } from "next/navigation";
import ar, { type Messages } from "@/messages/ar";
import en from "@/messages/en";
import { isLocale, type Locale } from "./routes";

const messages: Record<Locale, Messages> = { ar, en };

export type { Messages };

/** Server-side only: returns the copy for a locale (404s on an unknown one). */
export function getMessages(locale: string): Messages {
  if (!isLocale(locale)) notFound();
  return messages[locale];
}

/** Reads and validates the `[locale]` route param. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

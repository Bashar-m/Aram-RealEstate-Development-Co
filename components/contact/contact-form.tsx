"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { whatsappHref } from "@/data/company";
import { cn } from "@/lib/cn";
import type { Messages } from "@/lib/i18n";

type FormText = Messages["contact"]["form"];
type Field = "name" | "email" | "phone" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Channel = "whatsapp" | "email";

const MAX: Record<Field, number> = { name: 100, email: 254, phone: 20, message: 1500 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELDS: Field[] = ["name", "email", "phone", "message"];

function validate(values: Values, t: FormText["errors"]): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phoneDigits = values.phone.replace(/[\s\-()+]/g, "");
  const message = values.message.trim();

  if (!name) errors.name = t.nameRequired;
  else if (name.length < 2) errors.name = t.nameShort;

  if (email && !EMAIL.test(email)) errors.email = t.emailInvalid;

  if (phoneDigits && !/^\d{9,15}$/.test(phoneDigits)) errors.phone = t.phoneInvalid;

  if (!message) errors.message = t.messageRequired;
  else if (message.length < 10) errors.message = t.messageShort;

  return errors;
}

/** Builds the plain-text message the visitor sends from their own app. */
function compose(values: Values, t: FormText) {
  const lines = [t.compose.greeting, "", `${t.name}: ${values.name.trim()}`];
  if (values.email.trim()) lines.push(`${t.email}: ${values.email.trim()}`);
  if (values.phone.trim()) lines.push(`${t.phone}: ${values.phone.trim()}`);
  lines.push("", values.message.trim());
  return lines.join("\n");
}

/**
 * Contact form for a fully static site: nothing is sent to or stored on a server.
 * After validation it opens WhatsApp (wa.me) or the visitor's email app (mailto:)
 * with the message pre-filled, and the visitor confirms sending there.
 */
export function ContactForm({
  t,
  whatsappNumber,
  emailAddress,
}: {
  t: FormText;
  whatsappNumber: string;
  emailAddress: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<Channel | null>(null);

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setNotice(null);
    // After the first submit, re-validate live so errors clear as they're fixed
    if (submitted) setErrors(validate(next, t.errors));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values, t.errors);
    setErrors(found);

    const firstInvalid = FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      setNotice(null);
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const channel: Channel = submitter?.getAttribute("value") === "email" ? "email" : "whatsapp";
    const text = compose(values, t);

    if (channel === "whatsapp") {
      window.open(whatsappHref(whatsappNumber, text), "_blank", "noopener,noreferrer");
    } else {
      const subject = `${t.compose.subject} — ${values.name.trim()}`;
      window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    }
    setNotice(channel);
  };

  const hasErrors = Object.keys(errors).length > 0;

  const fieldClass = (field: Field) =>
    cn(
      "w-full rounded-lg border bg-ivory/60 px-4 text-base text-ink placeholder:text-muted/60",
      "transition-[border-color,box-shadow,background-color] duration-200 outline-none",
      "focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10",
      errors[field] ? "border-danger" : "border-line hover:border-brand/40",
    );

  const label = (field: Field, text: string, required: boolean) => (
    <label htmlFor={`contact-${field}`} className="flex items-baseline justify-between gap-3 text-[0.9375rem] font-semibold">
      <span>
        {text}
        {required && (
          <span aria-hidden className="text-gold-ink">
            {" "}*
          </span>
        )}
      </span>
      <span className="text-xs font-normal text-muted">{required ? t.required : t.optional}</span>
    </label>
  );

  const error = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-danger">
        <AlertCircle aria-hidden className="size-4 shrink-0" />
        {errors[field]}
      </p>
    );

  const a11y = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    maxLength: MAX[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-6">
      <div aria-live="polite" className="empty:hidden">
        {hasErrors && submitted && (
          <p className="flex items-center gap-2 rounded-lg bg-danger/8 px-4 py-3 text-sm font-medium text-danger">
            <AlertCircle aria-hidden className="size-4 shrink-0" />
            {t.errors.summary}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {label("name", t.name, true)}
          <input
            {...a11y("name")}
            type="text"
            autoComplete="name"
            required
            placeholder={t.namePlaceholder}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={cn(fieldClass("name"), "mt-2 h-12")}
          />
          {error("name")}
        </div>

        <div>
          {label("email", t.email, false)}
          <input
            {...a11y("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder={t.emailPlaceholder}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={cn(fieldClass("email"), "mt-2 h-12 rtl:text-right")}
          />
          {error("email")}
        </div>

        <div>
          {label("phone", t.phone, false)}
          <input
            {...a11y("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder={t.phonePlaceholder}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={cn(fieldClass("phone"), "mt-2 h-12 rtl:text-right")}
          />
          {error("phone")}
        </div>

        <div className="sm:col-span-2">
          {label("message", t.message, true)}
          <textarea
            {...a11y("message")}
            rows={5}
            required
            placeholder={t.messagePlaceholder}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            className={cn(fieldClass("message"), "mt-2 min-h-36 resize-y py-3 leading-relaxed")}
          />
          {error("message")}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" name="channel" value="whatsapp" className={buttonClasses("primary", "w-full cursor-pointer sm:w-auto")}>
            <MessageCircle aria-hidden strokeWidth={1.75} className="size-5" />
            {t.submitWhatsapp}
          </button>
          <button type="submit" name="channel" value="email" className={buttonClasses("outline", "w-full cursor-pointer sm:w-auto")}>
            <Mail aria-hidden strokeWidth={1.75} className="size-5" />
            {t.submitEmail}
          </button>
        </div>
        <p className="text-sm text-muted">{t.hint}</p>
      </div>

      <div role="status" className="empty:hidden">
        {notice && (
          <div className="flex gap-4 rounded-xl border border-brand/25 bg-brand/5 p-5">
            <CheckCircle2 aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <p className="font-semibold">{t.opened[notice].title}</p>
              <p className="mt-1.5 leading-relaxed text-ink/80">{t.opened[notice].text}</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

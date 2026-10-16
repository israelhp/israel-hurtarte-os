"use client";

import { useState, type FormEvent } from "react";
import { Banner, Button, Card, Field } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { socialLinks } from "@/content/social-links";
import { safeHref } from "@/lib/safe-href";
import { useT } from "@/features/settings/hooks";
import { CvButton, LinkList } from "@/features/apps/LinkList";
import { FIELD_LIMITS, buildMailto, validateContact, type ContactErrors } from "./mailto";

/** Hand a mailto: URL to the visitor's mail client without navigating away from the page. */
function openMailClient(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function ContactApp() {
  const t = useT();
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const email = socialLinks.find((l) => l.id === "email");
  const to =
    email && safeHref(email.href)?.startsWith("mailto:")
      ? email.href.slice("mailto:".length)
      : null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const found = validateContact(values);
    setErrors(found);
    setSent(false);
    const firstInvalid = (["name", "email", "message"] as const).find((k) => found[k]);
    if (firstInvalid) {
      // Move focus to the first invalid field so keyboard and screen-reader users land on the problem.
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (!to) return;
    openMailClient(buildMailto(to, t.form_subject, values));
    setSent(true);
  };

  const err = (k: keyof ContactErrors) =>
    errors[k] ? { "aria-invalid": true, "aria-describedby": `err-${k}` } : {};
  const msg = { name: t.form_err_name, email: t.form_err_email, message: t.form_err_msg };

  return (
    <div className="contact">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <h2>{t.contact_lead}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {t.contact_sub}
          </p>
        </div>
        <Card className="sect">
          <LinkList withLocation />
        </Card>
        <div>
          <CvButton primary />
        </div>
      </div>
      <form className="card form" onSubmit={onSubmit} noValidate>
        <Banner>{t.form_demo}</Banner>
        <Field
          label={t.form_name}
          name="name"
          autoComplete="name"
          maxLength={FIELD_LIMITS.name}
          placeholder={t.form_name_ph}
          {...err("name")}
        />
        {errors.name && (
          <span id="err-name" className="nc" role="alert">
            {msg.name}
          </span>
        )}
        <Field
          label={t.form_email}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
          placeholder="you@example.com"
          {...err("email")}
        />
        {errors.email && (
          <span id="err-email" className="nc" role="alert">
            {msg.email}
          </span>
        )}
        <Field
          label={t.form_msg}
          name="message"
          multiline
          maxLength={FIELD_LIMITS.message}
          placeholder={t.form_msg_ph}
          {...err("message")}
        />
        {errors.message && (
          <span id="err-message" className="nc" role="alert">
            {msg.message}
          </span>
        )}
        <Button variant="primary" type="submit" disabled={!to}>
          <Icon name="send" />
          {t.form_send}
        </Button>
        {sent && <Banner ok>{t.form_sent}</Banner>}
      </form>
    </div>
  );
}

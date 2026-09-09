"use client";

import Script from "next/script";
import { useState } from "react";

import styles from "./InquiryForm.module.css";
import { CONTACT } from "@/lib/site";

type Props = {
  kind: "owner" | "guest";
  siteKey: string;
  sourcePath: string;
};

type State = "idle" | "sending" | "sent" | "error";

/**
 * Enquiry form.
 *
 * Only rendered when Supabase and Turnstile are both configured - see
 * InquirySection - so this component never has to explain a broken backend to
 * a visitor. Whatever goes wrong, the WhatsApp number stays on screen.
 */
export function InquiryForm({ kind, siteKey, sourcePath }: Props) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  const owner = kind === "owner";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    // Turnstile's implicit render drops the token into this hidden input.
    const token = (data.get("cf-turnstile-response") as string | null) ?? "";

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") ?? "",
          message: data.get("message") ?? "",
          propertyLocation: data.get("propertyLocation") ?? "",
          stayDetails: data.get("stayDetails") ?? "",
          company: data.get("company") ?? "",
          sourcePath,
          turnstileToken: token,
        }),
      });

      if (res.ok) {
        setState("sent");
        form.reset();
        return;
      }

      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Something went wrong. Please message us on WhatsApp.");
      setState("error");
    } catch {
      setError("We could not reach the server. Please message us on WhatsApp.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.sent}>
        <h3>Thank you. That reached us.</h3>
        <p>
          We answer in English and Spanish, usually within minutes. If it is urgent,{" "}
          <a href={CONTACT.whatsappUrl} rel="noopener noreferrer" target="_blank">
            message us on WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" autoComplete="name" required maxLength={120} />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Phone or WhatsApp (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </div>

        {owner ? (
          <div className={styles.field}>
            <label htmlFor="propertyLocation">Where is the house?</label>
            <input
              id="propertyLocation"
              name="propertyLocation"
              type="text"
              maxLength={200}
              placeholder="Uvita, Dominical, Ojochal…"
            />
            <p className={styles.hint}>
              Roughly is fine. Whether it is already listed on Airbnb or VRBO is useful too.
            </p>
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor="stayDetails">Dates and how many people</label>
            <input
              id="stayDetails"
              name="stayDetails"
              type="text"
              maxLength={200}
              placeholder="12–19 March, 4 adults"
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="message">Anything else</label>
          <textarea id="message" name="message" maxLength={4000} />
        </div>

        {/* Invisible to people. Anything in it is a bot. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />

        <div className={styles.actions}>
          <button className={styles.submit} type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send"}
          </button>
          <span className={styles.status}>
            Or{" "}
            <a href={CONTACT.whatsappUrl} rel="noopener noreferrer" target="_blank">
              message us on WhatsApp
            </a>
            .
          </span>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}
      </form>
    </>
  );
}

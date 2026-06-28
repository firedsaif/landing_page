"use client";

import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./WaitlistForm.module.css";

gsap.registerPlugin(useGSAP);

/* EDIT: replace REPLACE_ME with your Formspree form ID. */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnjkdbag";

// Pragmatic email check — good enough for client-side gating.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  /** "light" sits on white surfaces, "dark" sits on the navy CTA band */
  variant?: "light" | "dark";
  /** label for the source so you can tell hero vs footer signups apart */
  source: string;
  cta?: string;
};

export default function WaitlistForm({
  variant = "light",
  source,
  cta = "Join the waitlist",
}: Props) {
  const id = useId();
  const scope = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Animate the success panel in when it replaces the form.
  useGSAP(
    () => {
      if (status !== "success") return;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-success]", {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: "power3.out",
        });
      });
    },
    { scope, dependencies: [status] }
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setError("Enter your work email so we can reach you.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("That email doesn’t look right — check for a typo.");
      return;
    }

    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: (() => {
          const fd = new FormData();
          fd.append("email", value);
          fd.append("source", source);
          return fd;
        })(),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setError("Something went wrong on our end. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Couldn’t reach the server. Check your connection and retry.");
    }
  }

  const isDark = variant === "dark";

  return (
    <div
      className={`${styles.root} ${isDark ? styles.dark : styles.light}`}
      ref={scope}
    >
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className={styles.success}
          data-success
        >
          <span className={styles.successMark} aria-hidden="true">
            <Check />
          </span>
          <div>
            <p className={styles.successTitle}>You’re on the list.</p>
            <p className={styles.successBody}>
              We’ll be in touch — keep an eye on your inbox.
            </p>
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
              <label htmlFor={`${id}-email`} className="sr-only">
                Work email
              </label>
              <input
                id={`${id}-email`}
                className={styles.input}
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@youragency.com"
                value={email}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-err` : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "submitting"}
                required
              />
              <button
                className={`btn btn-primary ${styles.submit}`}
                type="submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <>
                    <Spinner /> Adding you…
                  </>
                ) : (
                  cta
                )}
              </button>
            </div>

            <div className={styles.meta} id={`${id}-err`} aria-live="polite">
              {error ? (
                <span className={styles.error}>{error}</span>
              ) : (
                <span className={styles.hint}>
                  No spam, no sales calls. Just an invite when your spot opens.
                </span>
              )}
            </div>
        </form>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M4 10.5l3.5 3.5L16 5.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return <span className={styles.spinner} aria-hidden="true" />;
}

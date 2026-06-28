"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Certificate.module.css";

gsap.registerPlugin(useGSAP);

/* EDIT: sample certificate data — purely illustrative. */
const HOLDER = "City of Austin — Public Works";
const INSURED = "Lone Star Electric, LLC";
const ADDITIONAL_INSURED =
  "City of Austin is named as Additional Insured per forms CG 20 10 & CG 20 37.";

const COVERAGES = [
  { type: "General Liability", policy: "GL-4471920", limit: "$2,000,000" },
  { type: "Automobile Liability", policy: "CA-8830514", limit: "$1,000,000" },
  { type: "Umbrella / Excess", policy: "UMB-2209" + "88", limit: "$5,000,000" },
];

const ISSUED_DATE = "06/26/2026";
const EXP_DATE = "01/01/2027";

export default function Certificate() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const ai = root.querySelector<HTMLElement>("[data-ai]");
      const caret = root.querySelector<HTMLElement>("[data-caret]");

      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { animate } = ctx.conditions as {
            animate: boolean;
            reduce: boolean;
          };

          // ---- reduced motion: final state, no animation ----
          if (!animate) {
            if (ai) ai.textContent = ADDITIONAL_INSURED;
            if (caret) caret.style.display = "none";
            gsap.set("[data-card], [data-chip], [data-stamp]", { opacity: 1 });
            gsap.set("[data-stamp]", { rotate: -11 });
            return;
          }

          if (ai) ai.textContent = "";
          gsap.set("[data-stamp]", { opacity: 0, scale: 1.7, rotate: -2 });
          gsap.set("[data-chip]", { opacity: 0, y: 14 });
          // autoAlpha (visibility) so the CSS blink animation can't override it
          gsap.set(caret, { autoAlpha: 0 });

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // card lifts in with a slight 3D tilt settling flat
          tl.fromTo(
            "[data-card]",
            { opacity: 0, y: 26, rotateX: 7, transformPerspective: 900 },
            { opacity: 1, y: 0, rotateX: 0, duration: 0.75 }
          )
            // form cells cascade
            .from(
              "[data-cell]",
              {
                opacity: 0,
                y: 12,
                duration: 0.45,
                ease: "power2.out",
                stagger: 0.08,
              },
              "-=0.35"
            );

          // typewriter fills the additional-insured wording
          const tw = { i: 0 };
          tl.to(
            tw,
            {
              i: ADDITIONAL_INSURED.length,
              duration: ADDITIONAL_INSURED.length * 0.02,
              ease: "none",
              onStart: () => gsap.set(caret, { autoAlpha: 1 }),
              onUpdate: () => {
                if (ai)
                  ai.textContent = ADDITIONAL_INSURED.slice(
                    0,
                    Math.round(tw.i)
                  );
              },
            },
            "+=0.15"
          );

          // the ISSUED stamp lands
          tl.to(
            "[data-stamp]",
            {
              opacity: 1,
              scale: 1,
              rotate: -11,
              duration: 0.6,
              ease: "back.out(1.7)",
              onStart: () => gsap.set(caret, { autoAlpha: 0 }),
            },
            "+=0.12"
          );

          // metric chip floats up
          tl.to(
            "[data-chip]",
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.25"
          );

          // gentle continuous float once everything has settled
          tl.to(
            "[data-card]",
            {
              y: -8,
              duration: 3.2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            },
            ">"
          );
        }
      );
    },
    { scope }
  );

  return (
    <div className={styles.stage} ref={scope} aria-hidden="true">
      <div className={styles.card} data-card>
        {/* header */}
        <div className={styles.head}>
          <div>
            <div className={styles.docTitle}>Certificate of Liability Insurance</div>
            <div className={styles.docSub}>ACORD 25 · Issued via CertFlow</div>
          </div>
          <div className={styles.statusDot}>
            <span className={styles.dot} />
            Live
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.cell} data-cell>
            <div className="field-label">Insured</div>
            <div className={styles.value}>{INSURED}</div>
          </div>
          <div className={styles.cell} data-cell>
            <div className="field-label">Certificate Holder</div>
            <div className={styles.value}>{HOLDER}</div>
          </div>

          <div className={`${styles.cell} ${styles.span}`} data-cell>
            <div className={styles.coverHead}>
              <span className="field-label">Coverage</span>
              <span className="field-label">Policy No.</span>
              <span className="field-label">Limit</span>
            </div>
            {COVERAGES.map((c) => (
              <div className={styles.coverRow} key={c.policy}>
                <span>{c.type}</span>
                <span className="mono">{c.policy}</span>
                <span className="mono">{c.limit}</span>
              </div>
            ))}
          </div>

          <div className={`${styles.cell} ${styles.span} ${styles.aiCell}`} data-cell>
            <div className="field-label">Description of Operations / Additional Insured</div>
            <div className={styles.aiText}>
              <span data-ai>{ADDITIONAL_INSURED}</span>
              <span className={styles.caret} data-caret />
            </div>
          </div>

          <div className={styles.cell} data-cell>
            <div className="field-label">Issued</div>
            <div className={`${styles.value} mono`}>{ISSUED_DATE}</div>
          </div>
          <div className={styles.cell} data-cell>
            <div className="field-label">Auto-renews</div>
            <div className={`${styles.value} mono`}>{EXP_DATE}</div>
          </div>
        </div>

        {/* ISSUED stamp */}
        <div className={styles.stamp} data-stamp>
          <span className={styles.stampLabel}>Issued</span>
          <span className={styles.stampDate}>{ISSUED_DATE}</span>
        </div>
      </div>

      {/* "seconds, not hours" caption tile floating at corner */}
      <div className={styles.chip} data-chip>
        <span className={styles.chipNum}>9s</span>
        <span className={styles.chipLabel}>
          request → issued
          <br />
          no retyping
        </span>
      </div>
    </div>
  );
}

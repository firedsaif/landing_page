"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./Certificate.module.css";

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

function Cell({
  children,
  order,
  reduce,
  className = "",
}: {
  children: ReactNode;
  order: number;
  reduce: boolean | null;
  className?: string;
}) {
  return (
    <motion.div
      className={`${styles.cell} ${className}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: reduce ? 0 : 0.25 + order * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Certificate() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? ADDITIONAL_INSURED : "");
  const [stamped, setStamped] = useState(reduce ? true : false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduce || startedRef.current) return;
    startedRef.current = true;

    // Typewriter begins after the fields have staggered in (~1.1s).
    const startDelay = 1100;
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setTyped(ADDITIONAL_INSURED.slice(0, i));
        if (i >= ADDITIONAL_INSURED.length) {
          clearInterval(interval);
          // Stamp lands shortly after the wording completes.
          setTimeout(() => setStamped(true), 280);
        }
      }, 22);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [reduce]);

  return (
    <div className={styles.stage} aria-hidden="true">
      <motion.div
        className={styles.card}
        initial={reduce ? false : { opacity: 0, y: 24, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
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
          <Cell reduce={reduce} order={0}>
            <div className="field-label">Insured</div>
            <div className={styles.value}>{INSURED}</div>
          </Cell>
          <Cell reduce={reduce} order={1}>
            <div className="field-label">Certificate Holder</div>
            <div className={styles.value}>{HOLDER}</div>
          </Cell>

          <Cell reduce={reduce} order={2} className={styles.span}>
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
          </Cell>

          <Cell reduce={reduce} order={3} className={`${styles.span} ${styles.aiCell}`}>
            <div className="field-label">Description of Operations / Additional Insured</div>
            <div className={styles.aiText}>
              {typed}
              {!stamped && !reduce && <span className={styles.caret} />}
            </div>
          </Cell>

          <Cell reduce={reduce} order={4}>
            <div className="field-label">Issued</div>
            <div className={`${styles.value} mono`}>{ISSUED_DATE}</div>
          </Cell>
          <Cell reduce={reduce} order={5}>
            <div className="field-label">Auto-renews</div>
            <div className={`${styles.value} mono`}>{EXP_DATE}</div>
          </Cell>
        </div>

        {/* ISSUED stamp */}
        {stamped && (
          <motion.div
            className={styles.stamp}
            initial={reduce ? false : { opacity: 0, scale: 1.7, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: -11 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", mass: 0.7, damping: 11, stiffness: 220 }
            }
          >
            <span className={styles.stampLabel}>Issued</span>
            <span className={styles.stampDate}>{ISSUED_DATE}</span>
          </motion.div>
        )}
      </motion.div>

      {/* "seconds, not hours" caption tile floating at corner */}
      <motion.div
        className={styles.chip}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 1.9, duration: 0.5 }}
      >
        <span className={styles.chipNum}>9s</span>
        <span className={styles.chipLabel}>
          request → issued
          <br />
          no retyping
        </span>
      </motion.div>
    </div>
  );
}

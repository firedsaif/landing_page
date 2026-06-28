"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Single orchestrator for the whole page's motion (GSAP).
 *
 * - Header + hero animate in on load as a staggered intro.
 * - Every [data-reveal] block fades/rises as it scrolls into view (batched so
 *   grid rows stagger together).
 * - [data-stat-num] elements count up the moment the stat band appears.
 * - The hero artwork drifts on a gentle scroll-linked parallax.
 *
 * Initial hidden states live in CSS (under prefers-reduced-motion: no-preference)
 * so there's no flash before hydration; GSAP then writes inline styles that win.
 * Under reduced motion everything is shown immediately with no transforms.
 */
export default function SiteAnimator({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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

          // ---- reduced motion: reveal everything, no movement ----
          if (!animate) {
            gsap.set("[data-reveal], [data-hero] > *, [data-site-header]", {
              opacity: 1,
              y: 0,
              clearProps: "transform",
            });
            gsap.utils.toArray<HTMLElement>("[data-stat-num]").forEach((el) => {
              if (el.dataset.full) el.textContent = el.dataset.full;
            });
            return;
          }

          // ---- header ----
          gsap.set("[data-site-header]", { opacity: 0, y: -18 });
          gsap.to("[data-site-header]", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          });

          // ---- hero intro (staggered) ----
          gsap.set("[data-hero] > *", { opacity: 0, y: 30 });
          gsap.to("[data-hero] > *", {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.15,
          });

          // ---- scroll reveals ----
          gsap.set("[data-reveal]", { opacity: 0, y: 34 });
          ScrollTrigger.batch("[data-reveal]", {
            start: "top 86%",
            once: true,
            onEnter: (els) =>
              gsap.to(els, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.1,
                overwrite: true,
              }),
          });

          // ---- count-up stats ----
          gsap.utils.toArray<HTMLElement>("[data-stat-num]").forEach((el) => {
            const full = el.dataset.full ?? el.textContent ?? "";
            const m = /^(\d[\d,]*)(.*)$/.exec(full.trim());
            if (!m) return;
            const end = parseInt(m[1].replace(/,/g, ""), 10);
            const suffix = m[2];
            const counter = { v: 0 };
            el.textContent = `0${suffix}`;
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              onEnter: () =>
                gsap.to(counter, {
                  v: end,
                  duration: 1.2,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent = `${Math.round(counter.v)}${suffix}`;
                  },
                }),
            });
          });

          // ---- hero artwork parallax ----
          gsap.to("[data-hero-art]", {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero-art]",
              start: "top 30%",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      );
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}

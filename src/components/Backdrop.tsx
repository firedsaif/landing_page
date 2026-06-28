"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Backdrop.module.css";

/**
 * Reactive "ledger grid" backdrop — on-brand with the ACORD form aesthetic.
 *
 * - A faint dot grid sits behind the page.
 * - A spotlight follows the cursor (GSAP-eased), brightening + tinting nearby
 *   dots ledger-blue — so the grid responds as you move/hover.
 * - Scrolling drifts the grid (parallax) and lifts overall brightness in
 *   proportion to scroll velocity, then settles.
 * - Two very soft color washes drift slowly for depth.
 *
 * Sits at z-index -1; opaque sections (how / trust / cta / footer) cover it, so
 * it only shows through the light hero/problem/outcomes areas. Pointer-events
 * none. Honors prefers-reduced-motion with a single static pass.
 */
export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cv: HTMLCanvasElement = el;
    const context = cv.getContext("2d");
    if (!context) return;
    const c: CanvasRenderingContext2D = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = 0;
    let gap = 40;
    let t = 0;

    // smoothed pointer (GSAP eases the rendered position toward the raw one)
    const pt = { x: -1000, y: -1000 };
    const toX = gsap.quickTo(pt, "x", { duration: 0.5, ease: "power3" });
    const toY = gsap.quickTo(pt, "y", { duration: 0.5, ease: "power3" });

    let scrollY = window.scrollY || 0;
    let prevScroll = scrollY;
    let energy = 0; // scroll-velocity glow, 0..1

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 640 ? 46 : 40;
    }

    function wash(cx: number, cy: number, r: number, rgb: string, a: number) {
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      c.fillStyle = g;
      c.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    function draw() {
      c.clearRect(0, 0, w, h);

      // soft drifting color washes (very subtle)
      const par = scrollY * 0.06;
      const big = Math.max(w, h);
      wash(
        w * 0.18 + Math.sin(t * 0.3) * 46,
        h * 0.28 - par + Math.cos(t * 0.24) * 32,
        big * 0.55,
        "24,80,196",
        0.05 + energy * 0.04
      );
      wash(
        w * 0.86 + Math.cos(t * 0.26) * 46,
        h * 0.74 - par * 1.5 + Math.sin(t * 0.3) * 32,
        big * 0.5,
        "26,127,75",
        0.035 + energy * 0.03
      );

      // dot grid + cursor spotlight
      const R = 165;
      const offset = ((scrollY * 0.15) % gap + gap) % gap; // parallax drift
      const baseA = 0.05 + energy * 0.06;
      for (let gx = 0; gx <= w + gap; gx += gap) {
        for (let gy = -gap; gy <= h + gap; gy += gap) {
          const py = gy - offset;
          const dx = gx - pt.x;
          const dy = py - pt.y;
          const d2 = dx * dx + dy * dy;

          let a = baseA;
          let r = 1;
          let col = "14,23,38";
          if (d2 < R * R) {
            const f = 1 - Math.sqrt(d2) / R;
            a = baseA + f * 0.5;
            r = 1 + f * 1.6;
            col = "24,80,196";
          }
          c.fillStyle = `rgba(${col},${a})`;
          c.beginPath();
          c.arc(gx, py, r, 0, Math.PI * 2);
          c.fill();
        }
      }
    }

    function frame() {
      t += 0.016;
      scrollY = window.scrollY || 0;
      const dv = Math.min(1, Math.abs(scrollY - prevScroll) / 45);
      prevScroll = scrollY;
      energy += (dv - energy) * 0.12;
      energy *= 0.95;
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      toX(e.clientX);
      toY(e.clientY);
    }
    function onLeave() {
      toX(-1000);
      toY(-1000);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw();
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}

"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./Backdrop.module.css";

/**
 * Drifting bokeh particle field. Particles float on a gentle ambient current,
 * get pushed by scroll *velocity* (momentum — they overshoot and settle back,
 * they don't just track the scroll position), and part around the cursor.
 * Pre-rendered glow sprites keep it cheap. Static under reduced-motion.
 */

// soft brand-tinted orbs (r,g,b) + spawn weight
const PALETTE: { c: [number, number, number]; w: number }[] = [
  { c: [24, 80, 196], w: 0.5 }, // ledger blue
  { c: [91, 134, 224], w: 0.22 }, // light sky
  { c: [26, 127, 75], w: 0.18 }, // certified green
  { c: [14, 23, 38], w: 0.1 }, // ink (subtle depth)
];

function makeSprite(rgb: [number, number, number]): HTMLCanvasElement {
  const S = 128;
  const cnv = document.createElement("canvas");
  cnv.width = S;
  cnv.height = S;
  const g = cnv.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    const [r, gr, b] = rgb;
    grad.addColorStop(0, `rgba(${r},${gr},${b},0.9)`);
    grad.addColorStop(0.35, `rgba(${r},${gr},${b},0.45)`);
    grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, S, S);
  }
  return cnv;
}

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bvx: number; // ambient baseline velocity
  bvy: number;
  r: number; // render radius
  depth: number; // 0..1, bigger = closer = pushed more
  alpha: number;
  tw: number; // twinkle speed
  phase: number;
  sprite: HTMLCanvasElement;
};

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cv: HTMLCanvasElement = el;
    const context = cv.getContext("2d");
    if (!context) return;
    const c: CanvasRenderingContext2D = context;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const sprites = PALETTE.map((p) => makeSprite(p.c));

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let prevScroll = window.scrollY || 0;
    let scrollImpulse = 0;
    let mx = -9999;
    let my = -9999;
    let particles: P[] = [];

    function pickSprite(): number {
      const r = Math.random();
      let acc = 0;
      for (let i = 0; i < PALETTE.length; i++) {
        acc += PALETTE[i].w;
        if (r <= acc) return i;
      }
      return 0;
    }

    function makeParticle(seed = false): P {
      const depth = Math.random();
      const r = 7 + depth * 26;
      const idx = pickSprite();
      const ang = Math.random() * Math.PI * 2;
      const speed = 0.04 + Math.random() * 0.12;
      return {
        x: Math.random() * w,
        y: seed ? Math.random() * h : Math.random() * h,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        bvx: Math.cos(ang) * speed,
        bvy: Math.sin(ang) * speed,
        r,
        depth,
        alpha: 0.1 + depth * 0.22,
        tw: 0.004 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        sprite: sprites[idx],
      };
    }

    function build() {
      const target = mobile ? 34 : Math.min(96, Math.round((w * h) / 16000));
      particles = [];
      for (let i = 0; i < target; i++) particles.push(makeParticle(true));
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function render(animate: boolean) {
      c.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (animate) {
          // cursor parting
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          const R = 150;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * 0.6 * (0.4 + p.depth);
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }

          // ambient + cursor drift
          p.x += p.vx;
          p.y += p.vy;

          // scroll momentum: a decaying positional shove scaled by depth.
          // nonzero only while/just-after scrolling, so they coast to rest.
          p.y += scrollImpulse * (0.5 + p.depth * 1.4);

          // settle velocity back toward the gentle ambient baseline
          p.vx += (p.bvx - p.vx) * 0.045;
          p.vy += (p.bvy - p.vy) * 0.045;

          // wrap around edges with glow margin
          const m = p.r + 30;
          if (p.x < -m) p.x = w + m;
          else if (p.x > w + m) p.x = -m;
          if (p.y < -m) p.y = h + m;
          else if (p.y > h + m) p.y = -m;

          p.phase += p.tw;
        }

        const tw = 0.78 + Math.sin(p.phase) * 0.22;
        c.globalAlpha = p.alpha * tw;
        c.drawImage(p.sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }

      c.globalAlpha = 1;
    }

    function frame() {
      t++;
      const s = window.scrollY || 0;
      let delta = s - prevScroll;
      prevScroll = s;
      // clamp + feed a decaying impulse → push while scrolling, coast after
      delta = Math.max(-90, Math.min(90, delta));
      scrollImpulse = scrollImpulse * 0.85 + delta * 0.08;

      render(true);
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
    }
    function onLeave() {
      mx = -9999;
      my = -9999;
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      render(false);
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
  }, [reduce]);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}

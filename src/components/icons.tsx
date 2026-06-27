/* Consistent 1.75px stroke icon set (no emoji, no raster). */
import type { SVGProps } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconClock(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconAlert(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l9 16H3z" />
      <path d="M12 10v4" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function IconRenew(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 12a8.5 8.5 0 0114.5-6l2 2" />
      <path d="M20 4v4h-4" />
      <path d="M20.5 12a8.5 8.5 0 01-14.5 6l-2-2" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}

export function IconBolt(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M13 3L5 13h6l-1 8 8-10h-6z" />
    </svg>
  );
}

export function IconUser(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0114 0" />
    </svg>
  );
}

export function IconShield(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l7 3v5c0 4.4-3 8.2-7 9-4-0.8-7-4.6-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconCheck(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function IconArrow(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconLock(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

export function IconSelfServe(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M8.5 10.5l2.5 2.5 4.5-4.5" />
    </svg>
  );
}

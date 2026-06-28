import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** kept for call-site compatibility; sequencing is handled by the animator */
  index?: number;
  delay?: number;
  className?: string;
};

/**
 * Scroll-reveal marker. Renders a plain block tagged with `data-reveal`;
 * SiteAnimator fades/rises it into view (and staggers grouped siblings).
 * Initial hidden state is set in CSS so there's no pre-hydration flash.
 */
export default function Reveal({ children, className }: RevealProps) {
  return (
    <div className={className} data-reveal>
      {children}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { withMotion } from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in milliseconds. Kept as ms for call-site compatibility. */
  delay?: number;
  /** Adds a soft blur-in alongside the fade-and-rise. */
  blur?: boolean;
}

/** Fade-and-rise on scroll into view. Pairs with the `.gs-reveal` CSS. */
export function Reveal({ children, className = "", delay = 0, blur = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 26, ...(blur ? { filter: "blur(6px)" } : null) },
          {
            opacity: 1,
            y: 0,
            ...(blur ? { filter: "blur(0px)" } : null),
            duration: 0.9,
            ease: "siteOut",
            delay: delay / 1000,
            scrollTrigger: {
              trigger: ref.current,
              // Matches the old IntersectionObserver (threshold .15 + -8% margin).
              start: "top 92%",
              // Animate once and settle — scrolling back up must not replay.
              once: true,
            },
          }
        );
      });
    },
    // revertOnUpdate is required: with non-empty dependencies @gsap/react defers
    // cleanup to unmount, so a dep change would stack a second ScrollTrigger on
    // the same element.
    { scope: ref, dependencies: [delay, blur], revertOnUpdate: true }
  );

  return (
    <div ref={ref} className={`gs-reveal ${className}`}>
      {children}
    </div>
  );
}

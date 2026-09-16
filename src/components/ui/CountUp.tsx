"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { withMotion } from "@/lib/motion";

interface Props {
  value: number;
  /** Decimal places. 0 renders a thousands-separated integer. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function format(n: number, decimals: number, prefix: string, suffix: string) {
  const body = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString();
  return `${prefix}${body}${suffix}`;
}

/**
 * Scroll-triggered number count-up.
 *
 * Replaces three copies of a hand-rolled rAF hook that called setState on every
 * animation frame — a full React re-render at 60fps, several times per page.
 * GSAP tweens a plain object and writes textContent, so React renders once.
 *
 * The final value is also the server-rendered text: with JS off, under reduced
 * motion, or for a crawler, the number is already correct and GSAP merely
 * animates up to it. Never let the true value exist only inside a tween.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: value,
          duration,
          ease: "power2.out",
          // snap to the rendered precision so the last frame can't land on
          // 2.169999 and render a value that disagrees with the repo.
          snap: { v: decimals > 0 ? Math.pow(10, -decimals) : 1 },
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = format(counter.v, decimals, prefix, suffix);
          },
          onComplete: () => {
            // Guarantee the exact target, never an eased approximation.
            if (ref.current) ref.current.textContent = format(value, decimals, prefix, suffix);
          },
        });
      });
    },
    { scope: ref, dependencies: [value, decimals, prefix, suffix, duration], revertOnUpdate: true }
  );

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {format(value, decimals, prefix, suffix)}
    </span>
  );
}

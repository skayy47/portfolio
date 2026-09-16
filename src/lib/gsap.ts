"use client";

/**
 * The single place GSAP plugins are registered.
 *
 * Every consumer must import `gsap` / `ScrollTrigger` / `useGSAP` FROM HERE,
 * never from "gsap" or "gsap/ScrollTrigger" directly. A module that imports
 * ScrollTrigger without pulling in this file gets an unregistered plugin:
 * its tweens silently never scroll-trigger, with no error and no warning.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

// registerPlugin is idempotent (gsap keys plugins by name), so re-entry is safe.
gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

/**
 * Mirror the CSS easing tokens so GSAP motion is indistinguishable from the
 * transitions already in globals.css:
 *   --ease     cubic-bezier(0.22, 1, 0.36, 1)
 *   --ease-out cubic-bezier(0.16, 1, 0.3, 1)
 */
if (!CustomEase.get("site")) CustomEase.create("site", "0.22,1,0.36,1");
if (!CustomEase.get("siteOut")) CustomEase.create("siteOut", "0.16,1,0.3,1");

gsap.defaults({ ease: "siteOut", duration: 0.9 });

// The mobile URL bar collapsing counts as a resize and would otherwise force a
// mid-scroll refresh, re-firing reveals and jumping positions.
ScrollTrigger.config({ ignoreMobileResize: true });

// Tell lib/motion-boot.ts's failsafe that the motion layer loaded. This is set
// at module-evaluation time rather than in a React effect on purpose: it fires
// as soon as the chunk parses, well before hydration finishes, so a slow hydrate
// can't race the failsafe into stripping `html.js-motion` and killing the
// animation on a slow connection.
if (typeof window !== "undefined") window.__motionReady = true;

export { gsap, ScrollTrigger, useGSAP };

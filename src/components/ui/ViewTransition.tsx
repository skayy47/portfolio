"use client";

import * as React from "react";

type VTProps = {
  name?: string;
  share?: string | Record<string, string>;
  enter?: string | Record<string, string>;
  exit?: string | Record<string, string>;
  default?: string;
  children: React.ReactNode;
};

/**
 * React's <ViewTransition> ships in the React build Next vendors for the App
 * Router, but it is absent from react@19.2.4's own exports and from
 * @types/react@19 — so importing it directly type-checks fine at author time
 * and fails `next build`. One cast, one place.
 *
 * Returning the children unwrapped when it is missing is deliberate: it is also
 * the graceful path when experimental.viewTransition is off, and when a
 * bundler's aliasing differs from webpack's.
 */
const VT = (React as unknown as { ViewTransition?: React.FC<VTProps> }).ViewTransition;

export function ViewTransition(props: VTProps) {
  if (!VT) return <>{props.children}</>;
  return <VT {...props} />;
}

/** The shared name an act's stage and its case-study hero both answer to. */
export const frameTransitionName = (id: string) => `project-frame-${id}`;

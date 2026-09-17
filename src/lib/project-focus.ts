"use client";

import { useSyncExternalStore } from "react";

/**
 * Which project act is the reader actually looking at.
 *
 * Before this existed each live demo owned a private IntersectionObserver, so
 * all three ran at once — three animation loops competing for attention and for
 * the main thread. This store is the single authority: it decides which act is
 * active, writes the `.is-dim` class on the others, and hands each demo a
 * three-valued play state.
 *
 * Deliberately not React state. The scroll path runs on every ScrollTrigger
 * update, so it may only touch cached numbers and classList — a setState there
 * would re-render the whole section on most scroll frames (the same hazard
 * Nav.tsx documents). Demos subscribe per-id through useSyncExternalStore, so a
 * focus change re-renders exactly the two demo subtrees whose state flipped.
 */

/**
 * `still` is not "paused". A paused demo sitting at step 0 is an empty box —
 * `still` means "jump to the settled frame and never animate", which is what
 * reduced motion needs and what makes headless screenshots deterministic.
 */
export type DemoState = "play" | "pause" | "still";

/**
 * - `focus`   desktop + motion: nearest-to-centre plays, the rest dim and pause.
 * - `visible` touch or narrow: no dimming (the frame is most of the viewport,
 *             so dimming the neighbour peeking in just reads as a bug), demos
 *             play while on screen.
 * - `still`   reduced motion: nothing dims, nothing animates, every demo is
 *             pinned to its settled frame.
 */
export type FocusPolicy = "focus" | "visible" | "still";

/** Which act to scroll back to after a case study. See ProjectAct's CTA. */
export const WORK_RETURN_KEY = "work:return";

interface Entry {
  el: HTMLElement;
  /** Document-space centre, cached on refresh — never measured while scrolling. */
  centre: number;
  visible: boolean;
  state: DemoState;
}

const entries = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();

let activeId: string | null = null;
let policy: FocusPolicy = "visible";

/* ------------------------------------------------------------------ store */

function subscribe(id: string, cb: () => void) {
  let set = listeners.get(id);
  if (!set) {
    set = new Set();
    listeners.set(id, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
    if (set!.size === 0) listeners.delete(id);
  };
}

function stateFor(id: string, e: Entry): DemoState {
  if (policy === "still") return "still";
  if (policy === "focus") return id === activeId ? "play" : "pause";
  return e.visible ? "play" : "pause";
}

/**
 * Push the current decision out to the DOM and to subscribers. Cheap — three
 * entries — and only ever called when something actually changed.
 */
function sync() {
  entries.forEach((e, id) => {
    // The dim class goes on the INACTIVE acts, never the active one. With no JS,
    // a failed hydrate, or the motion-boot failsafe, nothing carries `.is-dim`
    // and every act reads at full strength. No CSS kill-switch required.
    e.el.classList.toggle("is-dim", policy === "focus" && id !== activeId);

    const next = stateFor(id, e);
    if (next !== e.state) {
      e.state = next;
      listeners.get(id)?.forEach((fn) => fn());
    }
  });
}

/* ----------------------------------------------------------------- writes */

export function registerAct(id: string, el: HTMLElement): () => void {
  entries.set(id, { el, centre: 0, visible: false, state: "pause" });
  return () => {
    entries.delete(id);
    if (activeId === id) activeId = null;
  };
}

/** Recache every act's document-space centre. Called on ScrollTrigger refresh only. */
export function measureActs() {
  const y = window.scrollY;
  entries.forEach((e) => {
    const r = e.el.getBoundingClientRect();
    e.centre = r.top + y + r.height / 2;
  });
}

/** Hot path: cached numbers only, and a no-op unless the winner changed. */
export function updateFocus(scrollY: number, vh: number) {
  if (policy !== "focus") return;
  const mid = scrollY + vh / 2;

  let best: string | null = null;
  let bestDist = Infinity;
  entries.forEach((e, id) => {
    const d = Math.abs(e.centre - mid);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  });

  if (best === activeId) return;
  activeId = best;
  sync();
}

export function setVisible(id: string, visible: boolean) {
  const e = entries.get(id);
  if (!e || e.visible === visible) return;
  e.visible = visible;
  sync();
}

export function setPolicy(next: FocusPolicy) {
  if (policy === next) return;
  policy = next;
  if (next !== "focus") activeId = null;
  sync();
}

/**
 * Make an act active regardless of scroll position. Used before a case-study
 * navigation so the shared-element morph never captures a dimmed frame.
 */
export function forceActive(id: string) {
  if (policy !== "focus" || activeId === id) return;
  activeId = id;
  sync();
}

/* ------------------------------------------------------------------ reads */

export function resolvePolicy(): FocusPolicy {
  if (typeof window === "undefined") return "visible";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900) return "visible";
  return "focus";
}

/** Server and first-client snapshot are both "pause", so hydration matches. */
export function useDemoState(id: string): DemoState {
  return useSyncExternalStore(
    (cb) => subscribe(id, cb),
    () => entries.get(id)?.state ?? "pause",
    () => "pause" as DemoState
  );
}

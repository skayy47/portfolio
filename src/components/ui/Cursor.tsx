"use client";

import { useEffect, useRef } from "react";

/**
 * Custom dot + trailing ring cursor, which morphs into a labelled pill over
 * anything carrying data-cursor-label. Disabled on touch / coarse pointers.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let mode: "idle" | "hover" | "label" = "idle";
    let raf = 0;

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor-label], a, button, [data-cursor]"
      );
      const text = t?.dataset.cursorLabel ?? null;
      mode = text ? "label" : t ? "hover" : "idle";

      // Only write when there is text: clearing it would collapse the pill
      // mid-transition and make the label flicker on the way out.
      if (text && label.current && label.current.textContent !== text) {
        label.current.textContent = text;
        // Measure rather than guess — "Open live" and "Étude de cas" are not
        // the same width, and a fixed pill would clip one or pad the other.
        ring.current?.style.setProperty("--cursor-pill-w", `${Math.ceil(label.current.offsetWidth)}px`);
      }
      if (ring.current) ring.current.dataset.mode = mode;
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      const at = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      if (ring.current) {
        // In label mode the pill is already the right size — scaling it would
        // magnify the text with it.
        ring.current.style.transform = mode === "label" ? at : `${at} scale(${mode === "hover" ? 1.9 : 1})`;
        ring.current.style.opacity = mode === "idle" ? "0.55" : "1";
      }
      if (label.current) label.current.style.transform = at;
      raf = requestAnimationFrame(loop);
    };

    document.body.classList.add("has-cursor");
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" data-mode="idle" aria-hidden />
      <span ref={label} className="cursor-label font-mono" aria-hidden />
    </>
  );
}

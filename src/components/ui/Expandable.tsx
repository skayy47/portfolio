"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/providers/LangProvider";

/** Progressive-disclosure "Read more" — animated, accessible, reduced-motion aware. */
export function Expandable({
  children,
  moreLabel,
  lessLabel,
  align = "start",
}: {
  children: React.ReactNode;
  moreLabel?: string;
  lessLabel?: string;
  align?: "start" | "center";
}) {
  const { c } = useLang();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const more = moreLabel ?? c.ui.readMore;
  const less = lessLabel ?? c.ui.readLess;

  return (
    <div className="expandable">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={id}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="expandable-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="expandable-toggle font-mono"
        style={{ alignSelf: align === "center" ? "center" : "flex-start" }}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        data-cursor
      >
        {open ? less : more}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s var(--ease)" }}
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

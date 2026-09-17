"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuraBot } from "./AuraBot";
import type { DemoState } from "@/lib/project-focus";

// AURA: the mascot floating live, with grounded-data chips drifting in.
export function AuraLiveDemo({ tags, caption, state }: { tags: string[]; caption: string; state: DemoState }) {
  // No timers here — the only motion is a one-shot entrance plus the mascot's
  // CSS keyframes. So "play" and "still" both mean "show it"; the difference is
  // that `still` skips the entrance entirely.
  const [on, setOn] = useState(false);
  const instant = state === "still";

  useEffect(() => {
    if (state !== "pause") setOn(true);
  }, [state]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="demo demo-aura">
      <div className="demo-glow" />
      <div className="demo-chips">
        {tags.map((t, i) => (
          <motion.span
            key={t}
            className="demo-chip"
            initial={{ opacity: 0, x: -14 }}
            animate={on ? { opacity: 1, x: 0 } : {}}
            transition={instant ? { duration: 0 } : { delay: 0.35 + i * 0.45, duration: 0.6, ease }}
          >
            <span className="demo-chip-dot" />
            {t}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="demo-bot-wrap"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={on ? { opacity: 1, scale: 1 } : {}}
        transition={instant ? { duration: 0 } : { duration: 0.9, ease }}
      >
        <AuraBot />
      </motion.div>

      <div className="demo-caption font-mono">{caption}</div>
    </div>
  );
}

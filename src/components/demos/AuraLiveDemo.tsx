"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AuraBot } from "./AuraBot";

// AURA: the mascot floating live, with grounded-data chips drifting in.
export function AuraLiveDemo({ tags, caption }: { tags: string[]; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => e.forEach((x) => x.isIntersecting && setOn(true)), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="demo demo-aura">
      <div className="demo-glow" />
      <div className="demo-chips">
        {tags.map((t, i) => (
          <motion.span
            key={t}
            className="demo-chip"
            initial={{ opacity: 0, x: -14 }}
            animate={on ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35 + i * 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuraBot />
      </motion.div>

      <div className="demo-caption font-mono">{caption}</div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MaestroContent {
  missionLabel: string;
  mission: string;
  agentsLabel: string;
  agents: { name: string; role: string }[];
  synth: string;
}

// MAESTRO: an orchestrator dispatching specialist agents live, then synthesizing.
export function MaestroLiveDemo({ content }: { content: MaestroContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [step, setStep] = useState(0); // 0 mission · 1..n agents · n+1 synth · hold

  const total = content.agents.length + 2; // mission + agents + synth

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => e.forEach((x) => setOn(x.isIntersecting)), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    setStep(0);
    let s = 0;
    const id = setInterval(() => {
      s = s >= total ? 0 : s + 1;
      setStep(s);
    }, 1100);
    return () => clearInterval(id);
  }, [on, total]);

  const synthStep = content.agents.length + 1;

  return (
    <div ref={ref} className="demo demo-maestro" data-demo-accent="2">
      <div className="demo-glow" />

      <div className="orch-mission font-mono">
        <span className="orch-label">{content.missionLabel}</span>
        {content.mission}
      </div>

      <div className="orch-core">
        <motion.span
          className="orch-node"
          animate={on ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <span className="orch-pulse" />
      </div>

      <div className="orch-agents">
        {content.agents.map((a, i) => {
          const active = step === i + 1;
          const done = step > i + 1 || step === synthStep || (step === 0 && false);
          return (
            <div key={a.name} className={`orch-agent ${active ? "is-active" : ""} ${done ? "is-done" : ""}`}>
              <span className="orch-agent-led" />
              <span className="orch-agent-name">{a.name}</span>
              <span className="orch-agent-role font-mono">{a.role}</span>
              <span className="orch-agent-state">
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : active ? (
                  <span className="orch-spinner" />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {step >= synthStep && (
          <motion.div className="orch-synth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {content.synth}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DemoState } from "@/lib/project-focus";

export interface MaestroContent {
  missionLabel: string;
  mission: string;
  agentsLabel: string;
  agents: { name: string; role: string }[];
  synth: string;
}

// MAESTRO: an orchestrator dispatching specialist agents live, then synthesizing.
export function MaestroLiveDemo({ content, state }: { content: MaestroContent; state: DemoState }) {
  // The step counter lives in a ref, not the effect closure, so pausing and
  // resuming picks up where it left off instead of restarting the mission.
  const stepRef = useRef(0);
  const [step, setStep] = useState(0); // 0 mission · 1..n agents · n+1 synth · hold

  const total = content.agents.length + 2; // mission + agents + synth
  const synthStep = content.agents.length + 1;

  // A fresh run belongs to a content change (language / lens switch), not to a
  // pause. This is the line that used to sit inside the timer effect.
  useEffect(() => {
    stepRef.current = 0;
    setStep(0);
  }, [content.mission, total]);

  useEffect(() => {
    if (state !== "play") return;
    const id = setInterval(() => {
      stepRef.current = stepRef.current >= total ? 0 : stepRef.current + 1;
      setStep(stepRef.current);
    }, 1100);
    return () => clearInterval(id);
  }, [state, total]);

  // Settled frame: the mission complete, every agent green, the deliverable out.
  useEffect(() => {
    if (state !== "still") return;
    stepRef.current = synthStep;
    setStep(synthStep);
  }, [state, synthStep]);

  const playing = state === "play";

  return (
    <div className="demo demo-maestro" data-demo-accent="2">
      <div className="demo-glow" />

      <div className="orch-mission font-mono">
        <span className="orch-label">{content.missionLabel}</span>
        {content.mission}
      </div>

      <div className="orch-core">
        {/* An Infinity-repeat tween holds rAF open forever, so it is gated on
            `playing` rather than on mere visibility. */}
        <motion.span
          className="orch-node"
          animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={playing ? { duration: 1.1, repeat: Infinity } : { duration: 0 }}
        />
        <span className="orch-pulse" />
      </div>

      <div className="orch-agents">
        {content.agents.map((a, i) => {
          const active = step === i + 1;
          const done = step > i + 1 || step === synthStep;
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
          <motion.div
            className="orch-synth"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={state === "still" ? { duration: 0 } : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {content.synth}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

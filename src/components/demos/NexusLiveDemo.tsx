"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface NexusContent {
  // Scene 0 — Auto-Summary
  uploadLabel: string;
  filename: string;
  analyzingLabel: string;
  oneLiner: string;
  bullets: string[];
  chips: string[];
  // Scene 1 — Source Attribution
  chatLabel: string;
  retrieving: string;
  sources: string[];
  answer: string;
  citation: string;
  // Scene 2 — Contradiction Radar
  contQ: string;
  contDocA: string;
  contDocB: string;
  contReplyA: string;
  contReplyB: string;
  contLabel: string;
  contNote: string;
  contValA: string;
  contValB: string;
  // Scene 3 — Knowledge Gap
  gapQ: string;
  gapSearching: string;
  gapLabel: string;
  gapNote: string;
  // Feature nav
  sceneLabels: string[];
}

const STEP_MS = 1300;
const STEPS_PER_SCENE = 7;
const NUM_SCENES = 4;
const CHAR_DELAY_MS = 20;

const DocIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
    <path d="M4 2h5l3 3v9H4z" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export function NexusLiveDemo({ content }: { content: NexusContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((x) => setOn(x.isIntersecting)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    let sc = 0;
    let st = 0;
    let streamId: ReturnType<typeof setInterval> | null = null;

    setScene(0); setStep(0); setCharCount(0);

    const stopStream = () => {
      if (streamId) { clearInterval(streamId); streamId = null; }
    };

    const startStream = () => {
      stopStream();
      let c = 0;
      setCharCount(0);
      streamId = setInterval(() => {
        c++;
        setCharCount(c);
        if (c >= content.answer.length) stopStream();
      }, CHAR_DELAY_MS);
    };

    const tick = setInterval(() => {
      st++;
      if (st > STEPS_PER_SCENE) {
        stopStream();
        st = 0;
        sc = (sc + 1) % NUM_SCENES;
        setScene(sc);
        setCharCount(0);
      }
      setStep(st);
      if (sc === 1 && st === 4) startStream();
    }, STEP_MS);

    return () => {
      clearInterval(tick);
      stopStream();
    };
  }, [on, content.answer.length]);

  const displayedAnswer = content.answer.slice(0, charCount);
  const answerDone = charCount >= content.answer.length;

  return (
    <div ref={ref} className="demo demo-nexus" data-demo-accent="3">
      <div className="demo-glow" />

      {/* Feature scene navigator */}
      <div className="rag-scene-nav">
        <div className="rag-scene-dots">
          {content.sceneLabels.map((_, i) => (
            <span key={i} className={`rag-scene-dot${scene === i ? " rag-scene-dot--active" : ""}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={scene}
            className="rag-scene-label font-mono"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {content.sceneLabels[scene]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Scene content */}
      <AnimatePresence mode="wait">

        {/* ── Scene 0: Auto-Summary ── */}
        {scene === 0 && (
          <motion.div
            key="scene-summary"
            className="rag-phase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rag-head font-mono">
              <span className="rag-dot" />
              {content.uploadLabel}
            </div>

            {step >= 1 && (
              <motion.div
                className="rag-file-chip font-mono"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <DocIcon />
                {content.filename}
              </motion.div>
            )}

            <div className="rag-progress-track">
              <motion.span
                className="rag-progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: step >= 1 ? "100%" : "0%" }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {step === 2 && (
              <motion.div
                className="rag-retrieve font-mono"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="rag-scanner" />
                {content.analyzingLabel}
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div
                className="rag-summary-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="rag-one-liner">{content.oneLiner}</p>
                <ul className="rag-bullets">
                  {content.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      className="rag-bullet"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                    >
                      {b}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {step >= 5 && (
              <motion.div
                className="rag-qchips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {content.chips.map((c, i) => (
                  <motion.span
                    key={i}
                    className={`rag-qchip font-mono${i === 0 && step >= 6 ? " rag-qchip--active" : ""}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {c}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Scene 1: Source Attribution ── */}
        {scene === 1 && (
          <motion.div
            key="scene-source"
            className="rag-phase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rag-head font-mono">
              <span className="rag-dot" />
              {content.chatLabel}
            </div>

            <div className="rag-chat">
              <motion.div
                className="rag-msg rag-msg-user"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="rag-bubble rag-bubble-user">{content.chips[0]}</div>
              </motion.div>

              {step >= 1 && (
                <motion.div className="rag-ctx" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {step <= 3 && (
                    <motion.span
                      className="rag-retrieve font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="rag-scanner" />
                      {content.retrieving}
                    </motion.span>
                  )}
                  <div className="rag-sources" style={{ marginTop: "0.25rem" }}>
                    {content.sources.map((s, i) => (
                      <motion.span
                        key={s}
                        className="rag-src chip"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12 }}
                      >
                        <DocIcon />
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  className="rag-msg rag-msg-ai"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="rag-typing">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="rag-typing-dot"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {step >= 4 && (
                <motion.div
                  className="rag-msg rag-msg-ai"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="rag-bubble rag-bubble-ai">
                    {displayedAnswer}
                    {!answerDone && <span className="rag-cursor" />}
                  </div>

                  {answerDone && step >= 5 && (
                    <motion.div
                      className="rag-citation-row"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="rag-src chip">
                        <DocIcon />
                        {content.citation}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Scene 2: Contradiction Radar ── */}
        {scene === 2 && (
          <motion.div
            key="scene-contra"
            className="rag-phase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rag-head font-mono">
              <span className="rag-dot" />
              {content.chatLabel}
            </div>

            {/* Corpus — two docs loaded */}
            <motion.div className="rag-sources" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[content.contDocA, content.contDocB].map((doc, i) => (
                <motion.span
                  key={doc}
                  className="rag-src chip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <DocIcon />
                  {doc}
                </motion.span>
              ))}
            </motion.div>

            <div className="rag-chat">
              {step >= 1 && (
                <motion.div
                  className="rag-msg rag-msg-user"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="rag-bubble rag-bubble-user">{content.contQ}</div>
                </motion.div>
              )}

              {step >= 2 && step <= 3 && (
                <motion.span
                  className="rag-retrieve font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="rag-scanner" />
                  {content.retrieving}
                </motion.span>
              )}

              {step >= 3 && (
                <motion.div
                  className="rag-msg rag-msg-ai"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="rag-bubble rag-bubble-ai">
                    {content.contReplyA}
                    {step >= 4 && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {" "}{content.contReplyB}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}

              {step >= 5 && (
                <motion.div
                  className="rag-contra-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rag-contra-header">
                    <span className="rag-contra-icon">⚠</span>
                    <span className="rag-contra-label font-mono">{content.contLabel}</span>
                  </div>
                  <p className="rag-contra-note">{content.contNote}</p>
                  <div className="rag-contra-table">
                    <div className="rag-contra-cell">
                      <span className="rag-contra-doc font-mono">{content.contDocA}</span>
                      <span className="rag-contra-val">{content.contValA}</span>
                    </div>
                    <div className="rag-contra-divider" />
                    <div className="rag-contra-cell">
                      <span className="rag-contra-doc font-mono">{content.contDocB}</span>
                      <span className="rag-contra-val">{content.contValB}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Scene 3: Knowledge Gap ── */}
        {scene === 3 && (
          <motion.div
            key="scene-gap"
            className="rag-phase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rag-head font-mono">
              <span className="rag-dot" />
              {content.chatLabel}
            </div>

            <div className="rag-chat">
              <motion.div
                className="rag-msg rag-msg-user"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="rag-bubble rag-bubble-user">{content.gapQ}</div>
              </motion.div>

              {step >= 1 && (
                <motion.div className="rag-ctx" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {step <= 2 && (
                    <motion.span
                      className="rag-retrieve font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="rag-scanner" />
                      {content.gapSearching}
                    </motion.span>
                  )}
                </motion.div>
              )}

              {step >= 3 && (
                <motion.div
                  className="rag-gap-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rag-gap-header">
                    <span className="rag-gap-icon">
                      <SearchIcon />
                    </span>
                    <span className="rag-gap-label font-mono">{content.gapLabel}</span>
                  </div>
                  <p className="rag-gap-note">{content.gapNote}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

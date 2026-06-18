"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── hooks ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ─── palette ─── */
const C = {
  bg: "#04080F",
  surface: "#0A1020",
  card: "#0E1628",
  border: "#1A2845",
  accent: "#6366F1",
  accentDim: "rgba(99,102,241,0.15)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
  emerald: "#10B981",
  emeraldDim: "rgba(16,185,129,0.12)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.12)",
  textPrimary: "#F1F5F9",
  textSec: "#94A3B8",
  textMuted: "#475569",
};

/* ─── sub-components ─── */
function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string; active: boolean }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 42, fontWeight: 800, color: C.accent, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
        {value}{suffix}
      </div>
      <div style={{ fontSize: 13, color: C.textSec, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}

function StatCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string; active: boolean }) {
  const { ref, visible } = useInView(0.3);
  const val = useCounter(target, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: 42, fontWeight: 800, color: C.accent, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 13, color: C.textSec, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}

function FeatureCard({ num, title, body, icon }: { num: string; title: string; body: string; icon: string }) {
  const { ref, visible } = useInView(0.2);
  return (
    <div
      ref={ref}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "28px 28px 24px",
        transition: "opacity 0.6s, transform 0.6s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: "0.1em" }}>{num}</span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>{body}</div>
    </div>
  );
}

function PipelineStepBox({ label, sublabel, active, delay }: { label: string; sublabel: string; active: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return (
    <div
      style={{
        background: lit ? C.accentDim : C.card,
        border: `1px solid ${lit ? C.accent : C.border}`,
        borderRadius: 10,
        padding: "12px 14px",
        textAlign: "center",
        transition: "all 0.4s ease",
        flex: "1 1 0",
        minWidth: 80,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: lit ? C.accent : C.textSec, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: C.textMuted }}>{sublabel}</div>
    </div>
  );
}

function PipelineArrow({ active, delay }: { active: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return (
    <div style={{ color: lit ? C.accent : C.border, fontSize: 18, transition: "color 0.4s", flexShrink: 0 }}>→</div>
  );
}

function ConfBar({ label, pct, color, active }: { label: string; pct: number; color: string; active: boolean }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [active, pct]);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.textSec }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 4, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

function FormatChip({ label }: { label: string }) {
  return (
    <span style={{
      padding: "5px 12px",
      borderRadius: 6,
      border: `1px solid ${C.border}`,
      background: C.card,
      fontSize: 12,
      fontWeight: 600,
      color: C.textSec,
      fontFamily: "monospace",
    }}>
      .{label}
    </span>
  );
}

/* ─── page ─── */
export default function NexusDemo() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const [pipelineVisible, setPipelineVisible] = useState(false);

  const contRef = useRef<HTMLDivElement>(null);
  const [contVisible, setContVisible] = useState(false);

  const confRef = useRef<HTMLDivElement>(null);
  const [confVisible, setConfVisible] = useState(false);

  useEffect(() => {
    const makeObs = (el: HTMLDivElement | null, setter: (v: boolean) => void) => {
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } }, { threshold: 0.2 });
      obs.observe(el);
      return obs;
    };
    const o1 = makeObs(pipelineRef.current, setPipelineVisible);
    const o2 = makeObs(contRef.current, setContVisible);
    const o3 = makeObs(confRef.current, setConfVisible);
    return () => { o1?.disconnect(); o2?.disconnect(); o3?.disconnect(); };
  }, []);

  const FEATURES = [
    {
      num: "01", icon: "🔀", title: "Hybrid Retrieval + RRF",
      body: "BM25 keyword search fused with pgvector semantic search via Reciprocal Rank Fusion. MATCH_K=8, threshold=0.40. Catches what pure vector search misses — and what pure keyword search can't semantify.",
    },
    {
      num: "02", icon: "⚡", title: "Auto-Summary on Upload",
      body: "The moment a document lands, one LLM call returns a one-liner, 4 insight bullets, and 3 clickable question chips that fire directly into chat. Zero friction from upload to first answer.",
    },
    {
      num: "03", icon: "🔴", title: "Contradiction Radar",
      body: "A structured second LLM call compares retrieved chunks across documents. When policies diverge, it surfaces both statements side-by-side with severity rating and explanation — never silently picks one.",
    },
    {
      num: "04", icon: "🕳️", title: "Knowledge Gap Detection",
      body: "If coverage score falls below 0.45 and the query carries a non-answer signal, nexus declares a knowledge gap instead of hallucinating. The system knows what it doesn't know.",
    },
  ];

  const PIPELINE = [
    { label: "Upload", sublabel: "15 formats", delay: 0 },
    { label: "Chunk", sublabel: "800 tokens", delay: 300 },
    { label: "Embed", sublabel: "all-MiniLM", delay: 600 },
    { label: "BM25+vec", sublabel: "pgvector", delay: 900 },
    { label: "RRF", sublabel: "rerank", delay: 1200 },
    { label: "LLM", sublabel: "Groq", delay: 1500 },
    { label: "Ground", sublabel: "claim-level", delay: 1800 },
  ];

  const FORMATS = ["pdf", "docx", "xlsx", "pptx", "csv", "rtf", "json", "eml", "md", "txt", "html"];

  const TECH = [
    "FastAPI", "Next.js 14", "LangChain LCEL", "pgvector",
    "Groq Llama 3.3 70B", "Supabase", "BM25",
    "all-MiniLM-L6-v2", "TypeScript", "Framer Motion", "Docker",
    "Hugging Face Spaces", "Vercel", "pytest (145 tests)",
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: C.textPrimary }}>

      {/* ── navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 56,
        background: "rgba(4,8,15,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: C.textSec, textDecoration: "none", letterSpacing: "0.06em" }}>
          ← SKAY · PORTFOLIO
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="https://nexussss-two.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "7px 16px", background: C.accent, borderRadius: 8,
              fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none", letterSpacing: "0.02em",
            }}
          >
            Open Live App ↗
          </a>
          <a
            href="https://github.com/skayy47/nexus"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "7px 14px", background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.textSec, textDecoration: "none",
            }}
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* ── hero ── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center", maxWidth: 860, margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* pulsing badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 999,
          background: C.accentDim, border: `1px solid ${C.accent}`,
          marginBottom: 32,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: C.accent,
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em" }}>
            PRODUCTION RAG · HYBRID RETRIEVAL · LIVE
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(56px, 10vw, 100px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px", margin: "0 0 16px" }}>
          nex<span style={{ color: C.accent }}>us</span>
        </h1>

        <div style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 700, color: C.textSec, marginBottom: 32, letterSpacing: "-0.3px" }}>
          Institutional Memory Engine
        </div>

        {/* THE HOOK */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "28px 36px", maxWidth: 640, margin: "0 auto 40px",
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: C.red, letterSpacing: "-2px", lineHeight: 1 }}>42%</div>
          <div style={{ fontSize: 16, color: C.textSec, marginTop: 8, lineHeight: 1.6 }}>
            of company knowledge walks out the door when senior employees leave.
            <span style={{ color: C.textPrimary, fontWeight: 600 }}> nexus doesn't let that happen.</span>
          </div>
        </div>

        <p style={{ fontSize: 16, color: C.textSec, maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.75 }}>
          Upload your documents in any of 15 formats. Get an AI summary instantly. Ask anything — every answer is traceable to a source, contradictions are surfaced automatically, and gaps are declared instead of hallucinated.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://nexussss-two.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "14px 28px", background: C.accent, borderRadius: 10,
              fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none",
            }}
          >
            Try it live ↗
          </a>
          <a
            href="https://github.com/skayy47/nexus"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "14px 24px", background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none",
            }}
          >
            View source
          </a>
        </div>
      </section>

      {/* ── stats ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 2, background: C.border, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden",
        }}>
          {[
            { target: 145, suffix: "", label: "Tests passing" },
            { target: 15, suffix: "", label: "Doc formats" },
            { target: 42, suffix: "%", label: "Knowledge at risk" },
            { target: 8, suffix: "", label: "MATCH_K chunks" },
          ].map((s, i) => (
            <div key={i} style={{ background: C.surface, padding: "36px 20px", textAlign: "center" }}>
              <StatCounter target={s.target} suffix={s.suffix} label={s.label} active={true} />
            </div>
          ))}
        </div>
      </section>

      {/* ── what i built ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", marginBottom: 10 }}>WHAT I BUILT</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
            Four systems. Zero tolerance for hallucination.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.num} {...f} />
          ))}
        </div>
      </section>

      {/* ── pipeline visualization ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", marginBottom: 10 }}>ARCHITECTURE</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: 0 }}>
            The retrieval pipeline, step by step.
          </h2>
        </div>
        <div
          ref={pipelineRef}
          style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "36px 28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {PIPELINE.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PipelineStepBox label={step.label} sublabel={step.sublabel} active={pipelineVisible} delay={step.delay} />
                {i < PIPELINE.length - 1 && <PipelineArrow active={pipelineVisible} delay={step.delay + 150} />}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: C.textMuted }}>
            Every chunk is embedded with all-MiniLM-L6-v2 (CPU, baked into Docker) · BM25 index rebuilt on each upload · RRF(k=60) fuses both scores
          </div>
        </div>
      </section>

      {/* ── contradiction showcase ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: "0.12em", marginBottom: 10 }}>CONTRADICTION RADAR</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 12px" }}>
            When documents disagree, nexus says so.
          </h2>
          <p style={{ fontSize: 15, color: C.textSec, margin: 0 }}>
            A structured second LLM call compares retrieved chunks. Both versions surface — no silent overwrite.
          </p>
        </div>

        <div ref={contRef}>
          {/* query bar */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "14px 20px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
            transition: "opacity 0.6s", opacity: contVisible ? 1 : 0,
          }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>Q:</span>
            <span style={{ fontSize: 14, color: C.textPrimary, fontStyle: "italic" }}>
              "What's the remote-work policy? How many days per week?"
            </span>
          </div>

          {/* two doc panels */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16,
            transition: "opacity 0.6s 0.2s, transform 0.6s 0.2s",
            opacity: contVisible ? 1 : 0,
            transform: contVisible ? "translateY(0)" : "translateY(20px)",
          }}>
            {/* doc A */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontFamily: "monospace" }}>TechCorp_HR_Policy_2023.pdf · p.1</div>
              <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>
                "Employees may work remotely for up to{" "}
                <span style={{ background: "rgba(239,68,68,0.2)", color: C.red, fontWeight: 700, padding: "1px 4px", borderRadius: 3 }}>
                  3 days per week
                </span>
                , subject to manager approval."
              </div>
            </div>
            {/* doc B */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 20px" }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontFamily: "monospace" }}>TechCorp_HR_Policy_2024.pdf · p.1</div>
              <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>
                "The updated remote-work allowance is{" "}
                <span style={{ background: "rgba(239,68,68,0.2)", color: C.red, fontWeight: 700, padding: "1px 4px", borderRadius: 3 }}>
                  2 days per week
                </span>
                , effective January 2024."
              </div>
            </div>
          </div>

          {/* contradiction banner */}
          <div style={{
            background: C.redDim, border: `1px solid ${C.red}`,
            borderRadius: 12, padding: "16px 20px",
            display: "flex", alignItems: "flex-start", gap: 14,
            transition: "opacity 0.6s 0.5s, transform 0.6s 0.5s",
            opacity: contVisible ? 1 : 0,
            transform: contVisible ? "translateY(0)" : "translateY(12px)",
          }}>
            <span style={{
              width: 9, height: 9, borderRadius: "50%", background: C.red,
              marginTop: 5, flexShrink: 0,
              animation: contVisible ? "pulse 1.5s infinite" : "none",
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 4 }}>
                CONTRADICTION DETECTED · medium severity
              </div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>
                The 2023 and 2024 HR policies diverge on remote-work limits. The 2024 version appears more recent and may supersede the 2023 policy — but both are present in your corpus and nexus will not silently pick one.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── confidence scoring ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", marginBottom: 12 }}>CONFIDENCE GATING</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 16px" }}>
              High confidence answers. Low confidence refusals.
            </h2>
            <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7, margin: "0 0 20px" }}>
              Every answer is grounded via dual-path verification: citation-aware fuzzy matching + semantic cosine against embedded chunks. Coverage below 0.45 triggers a knowledge gap declaration. No hallucination by design.
            </p>
            <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "monospace", lineHeight: 1.8 }}>
              MATCH_K=8 · threshold=0.40<br />
              min_words=3 · fuzzy normalize()<br />
              dual-gate: coverage + non-answer signal
            </div>
          </div>

          <div ref={confRef} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confidence scores</div>
            <ConfBar label="Q4 revenue breakdown" pct={94} color={C.emerald} active={confVisible} />
            <ConfBar label="Headcount by department" pct={78} color="#3B82F6" active={confVisible} />
            <ConfBar label="Remote-work policy (2024)" pct={61} color={C.amber} active={confVisible} />
            <ConfBar label="Q1 2025 revenue ← gap" pct={12} color={C.red} active={confVisible} />
            <div style={{ marginTop: 20, padding: "10px 14px", background: C.redDim, border: `1px solid ${C.red}`, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: C.red, fontWeight: 700 }}>Knowledge gap declared</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>No coverage for Q1 2025 — nexus refuses instead of guessing</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 15 formats ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", marginBottom: 12 }}>DOCUMENT SUPPORT</div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 28px" }}>
          15 formats. No preprocessing required.
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {FORMATS.map((f) => <FormatChip key={f} label={f} />)}
          <span style={{
            padding: "5px 12px", borderRadius: 6, background: C.accentDim,
            border: `1px solid ${C.accent}`, fontSize: 12, fontWeight: 600, color: C.accent,
          }}>
            +4 more
          </span>
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 20 }}>
          Powered by pypdf + Unstructured — scanned, structured, and semi-structured all supported
        </div>
      </section>

      {/* ── tech stack ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", marginBottom: 12 }}>TECH STACK</div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 28px" }}>
          Production-grade from day one.
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {TECH.map((t) => (
            <span key={t} style={{
              padding: "6px 14px", borderRadius: 8, background: C.card,
              border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.textSec,
            }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── cta ── */}
      <section style={{
        maxWidth: 700, margin: "0 auto 80px", padding: "60px 36px",
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", marginBottom: 16 }}>
          PRODUCTION RAG ENGINE
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 16px" }}>
          Upload a document.<br />
          <span style={{ color: C.accent }}>Watch it think.</span>
        </h2>
        <p style={{ fontSize: 15, color: C.textSec, margin: "0 auto 32px", maxWidth: 480, lineHeight: 1.7 }}>
          The demo runs against real curated documents with designed contradictions. Hit Try Demo and watch nexus surface them automatically.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://nexussss-two.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "14px 32px", background: C.accent, borderRadius: 10,
              fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none",
            }}
          >
            Open nexus ↗
          </a>
          <a
            href="https://github.com/skayy47/nexus"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "14px 24px", background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none",
            }}
          >
            Source on GitHub
          </a>
        </div>
      </section>

      {/* ── footer ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: "24px",
        textAlign: "center", fontSize: 12, color: C.textMuted,
      }}>
        nexus — built by <a href="/" style={{ color: C.accent, textDecoration: "none" }}>SKAY</a> · Production RAG engine · Deployed on Vercel + Hugging Face Spaces
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}

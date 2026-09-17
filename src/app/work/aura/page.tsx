"use client";

import { CountUp } from "@/components/ui/CountUp";
import { CaseNav } from "@/components/sections/CaseNav";
import { CaseHero } from "@/components/sections/CaseHero";

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

/* ─── palette ─── */
const C = {
  bg: "#06070F",
  surface: "#0C0F22",
  card: "#111528",
  border: "#1E2547",
  accent: "#6366F1",
  accentLight: "#A5B4FC",
  accentDim: "rgba(99,102,241,0.15)",
  accentBorder: "rgba(99,102,241,0.4)",
  teal: "#22D3EE",
  emerald: "#10B981",
  amber: "#F59E0B",
  textPrimary: "#F1F5F9",
  textSec: "#94A3B8",
  textMuted: "#64748B",
};

const LIVE_URL = "https://aura-sooty-five-27.vercel.app";
const CODE_URL = "https://github.com/skayy47/AURA";

/* ─── shared bits ─── */
function StatCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 42, fontWeight: 800, color: C.accentLight, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
        <CountUp value={target} suffix={suffix} />
      </div>
      <div style={{ fontSize: 13, color: C.textSec, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );
}

function FeatureCard({ num, title, body, icon }: { num: string; title: string; body: string; icon: string }) {
  const { ref, visible } = useInView(0.15);
  return (
    <div
      ref={ref}
      style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: "28px 28px 24px",
        transition: "opacity 0.6s, transform 0.6s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 11, color: C.accentLight, fontWeight: 700, letterSpacing: "0.1em" }}>{num}</span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>{body}</div>
    </div>
  );
}

/* One stage of the ingest pipeline, lighting up in sequence. */
function PipelineStage({ num, name, detail, color, active, delay }: {
  num: string; name: string; detail: string; color: string; active: boolean; delay: number;
}) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  return (
    <div style={{
      background: lit ? C.surface : C.card,
      border: `1px solid ${lit ? color : C.border}`,
      borderRadius: 12, padding: "18px 18px 16px",
      transition: "all 0.5s ease",
      opacity: lit ? 1 : 0.45,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: color,
          animation: lit ? "pulse 1.4s infinite" : "none",
          opacity: lit ? 1 : 0.3, transition: "opacity 0.4s",
        }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: lit ? color : C.textMuted, letterSpacing: "0.1em" }}>{num}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: lit ? C.textPrimary : C.textSec, marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.55 }}>{detail}</div>
    </div>
  );
}

/* A column, and what AURA decides it actually is. */
function RoleRow({ col, kind, why, color, active, delay }: {
  col: string; kind: string; why: string; color: string; active: boolean; delay: number;
}) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", gap: 14,
      padding: "13px 16px", borderBottom: `1px solid ${C.border}`,
      opacity: lit ? 1 : 0.3, transition: "opacity 0.5s ease",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "monospace", fontSize: 13.5, color: C.textPrimary }}>{col}</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{why}</div>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap",
        padding: "4px 10px", borderRadius: 6,
        color, background: `${color}1F`, border: `1px solid ${color}55`,
      }}>
        {kind}
      </span>
    </div>
  );
}

/* ─── page ─── */
export default function AuraCaseStudy() {
  const pipeRef = useRef<HTMLDivElement>(null);
  const [pipeVisible, setPipeVisible] = useState(false);

  const rolesRef = useRef<HTMLDivElement>(null);
  const [rolesVisible, setRolesVisible] = useState(false);

  useEffect(() => {
    const makeObs = (el: HTMLDivElement | null, setter: (v: boolean) => void) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    };
    const o1 = makeObs(pipeRef.current, setPipeVisible);
    const o2 = makeObs(rolesRef.current, setRolesVisible);
    return () => { o1?.disconnect(); o2?.disconnect(); };
  }, []);

  const FEATURES = [
    {
      num: "01", icon: "🧬", title: "Semantic Column-Role Inference",
      body: "AURA does not just read dtypes. It decides what each column is FOR — identifier, measure, dimension or temporal — and every downstream step reads that decision. Get this wrong and the rest of the pipeline is confidently wrong too.",
    },
    {
      num: "02", icon: "🔁", title: "Four-Provider AI Cascade",
      body: "Gemini → Groq → OpenAI → Claude, with silent automatic fallback. A rate limit or an outage at one provider does not reach the user as an error; it reaches them as a slightly slower answer.",
    },
    {
      num: "03", icon: "🔒", title: "Grounded Chat, Not Free Association",
      body: "Pre-computed findings are injected into the prompt as AUTHORITATIVE. The model cites exact numbers from the actual dataframe instead of inventing plausible ones — the difference between a demo and a tool.",
    },
    {
      num: "04", icon: "🌍", title: "Bilingual All the Way Down",
      body: "EN/FR is not a UI string swap. The exported PDF follows the locale through its labels, its AI executive summary, its insights, and its number and date formatting.",
    },
  ];

  const TECH = [
    "FastAPI", "Next.js", "TypeScript", "Pandas", "Gemini", "Groq",
    "OpenAI", "Claude API", "Playwright", "Jinja2", "SSE streaming", "Pytest (55/55)",
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: C.textPrimary }}>

      {/* ── navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 56,
        background: "rgba(6,7,15,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: C.textSec, textDecoration: "none", letterSpacing: "0.06em" }}>
          ← SKAY · PORTFOLIO
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding: "7px 16px", background: C.accent, borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
            Open Live App ↗
          </a>
          <a href={CODE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.textSec, textDecoration: "none" }}>
            GitHub
          </a>
        </div>
      </nav>

      {/* ── hero ── */}
      <section style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 999,
          background: C.accentDim, border: `1px solid ${C.accentBorder}`,
          marginBottom: 32,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentLight, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em" }}>
            DATA ENGINE · EN / FR · LIVE
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(60px, 11vw, 110px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-4px", margin: "0 0 20px" }}>
          AU<span style={{ color: C.accentLight }}>RA</span>
        </h1>

        <div style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 700, color: C.textSec, marginBottom: 28, letterSpacing: "-0.3px" }}>
          Universal Data Engine
        </div>

        <p style={{ fontSize: 16, color: C.textSec, maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.8 }}>
          Any file in. A branded, bilingual report out. Five minutes, not five hours.
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.75 }}>
          Drop a CSV, XLSX, JSON or Parquet. AURA infers what each column actually is, cleans it in eight steps, builds an archetype-aware explore, answers grounded questions in EN or FR, and exports a branded PDF.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 28px", background: C.accent, borderRadius: 10, fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
            Drop a file in ↗
          </a>
          <a href={CODE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 24px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none" }}>
            View source
          </a>
        </div>
      </section>

      <div style={{ padding: "0 24px" }}>
        <CaseHero id="aura" poster="/cinematics/aura" video="/cinematics/aura.mp4" alt="AURA — universal data engine" surface={C.surface} border={C.border} />
      </div>

      {/* ── stats ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 2, background: C.border, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden",
        }}>
          {[
            { target: 55, suffix: "/55", label: "Tests green" },
            { target: 4, suffix: "", label: "File formats in" },
            { target: 8, suffix: "", label: "Cleaning steps" },
            { target: 4, suffix: "", label: "AI providers" },
          ].map((s, i) => (
            <div key={i} style={{ background: C.surface, padding: "36px 20px", textAlign: "center" }}>
              <StatCounter target={s.target} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ── what i built ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 10 }}>WHAT I BUILT</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}>
            It reads the data. It doesn&apos;t guess.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => <FeatureCard key={f.num} {...f} />)}
        </div>
      </section>

      {/* ── the pipeline ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 10 }}>THE PIPELINE</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 12px" }}>
            Ingest → Infer → Clean → Explore → Report.
          </h2>
          <p style={{ fontSize: 15, color: C.textSec, margin: 0 }}>Every stage reads the one before it. The inference is the load-bearing step.</p>
        </div>

        <div ref={pipeRef} style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 28px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12,
        }}>
          <PipelineStage num="01" name="Ingest" detail="CSV, XLSX, JSON, Parquet — parsed into one typed frame." color={C.accent} active={pipeVisible} delay={0} />
          <PipelineStage num="02" name="Infer roles" detail="Identifier, measure, dimension, temporal — per column." color={C.accentLight} active={pipeVisible} delay={500} />
          <PipelineStage num="03" name="Clean" detail="Eight steps. Dedup skips identifier columns, so near-duplicates are actually caught." color={C.teal} active={pipeVisible} delay={1000} />
          <PipelineStage num="04" name="Explore" detail="Charts chosen from the archetype, not from the dtype." color={C.emerald} active={pipeVisible} delay={1500} />
          <PipelineStage num="05" name="Report" detail="Playwright + Jinja2, server-side SVG charts, EN or FR." color={C.amber} active={pipeVisible} delay={2000} />
        </div>
      </section>

      {/* ── role inference ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: "0.12em", marginBottom: 12 }}>COLUMN-ROLE INFERENCE</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 16px" }}>
              An ID is not a number.
            </h2>
            <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7, margin: "0 0 20px" }}>
              Most tools see <code style={{ fontFamily: "monospace", color: C.textPrimary }}>customer_id</code> as an integer and cheerfully offer you its mean. AURA classifies each column by what it is for, and every later stage — dedup, charting, the AI summary — reads that classification.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Identifiers excluded from statistics and from dedup keys",
                "Measures get distributions; dimensions get frequencies",
                "Temporal columns unlock trend charts automatically",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: C.emerald, fontWeight: 700, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: C.textSec }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div ref={rolesRef} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, letterSpacing: "0.1em" }}>
              orders_2024.csv · 6 columns
            </div>
            <RoleRow col="order_id" kind="IDENTIFIER" why="High cardinality, no meaningful order" color={C.accentLight} active={rolesVisible} delay={0} />
            <RoleRow col="order_date" kind="TEMPORAL" why="Parses as a date, monotonic-ish" color={C.amber} active={rolesVisible} delay={220} />
            <RoleRow col="region" kind="DIMENSION" why="Low cardinality, repeats" color={C.teal} active={rolesVisible} delay={440} />
            <RoleRow col="revenue" kind="MEASURE" why="Continuous, aggregates meaningfully" color={C.emerald} active={rolesVisible} delay={660} />
            <RoleRow col="units" kind="MEASURE" why="Discrete but additive" color={C.emerald} active={rolesVisible} delay={880} />
            <RoleRow col="customer_id" kind="IDENTIFIER" why="Numeric — and averaging it is nonsense" color={C.accentLight} active={rolesVisible} delay={1100} />
          </div>
        </div>
      </section>

      {/* ── tech stack ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 12 }}>TECH STACK</div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 28px" }}>
          55 tests green. Both languages covered.
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
        background: C.surface, border: `1px solid ${C.accentBorder}`,
        borderRadius: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 16 }}>
          UNIVERSAL DATA ENGINE
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 16px" }}>
          Bring a messy file.<br />
          <span style={{ color: C.accentLight }}>Leave with a report.</span>
        </h2>
        <p style={{ fontSize: 15, color: C.textSec, margin: "0 auto 32px", maxWidth: 460, lineHeight: 1.7 }}>
          Upload any CSV, XLSX, JSON or Parquet and watch the roles get inferred, the cleaning run, and the branded PDF come out the other side — in English or French.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 32px", background: C.accent, borderRadius: 10, fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
            Open AURA ↗
          </a>
          <a href={CODE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 24px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none" }}>
            Source on GitHub
          </a>
        </div>
      </section>

      <CaseNav current="aura" accent={C.accentLight} border={C.border} />

      {/* ── footer ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: "24px",
        textAlign: "center", fontSize: 12, color: C.textMuted,
      }}>
        AURA — built by <Link href="/" style={{ color: C.accent, textDecoration: "none" }}>SKAY</Link> · Universal data engine · Deployed on Vercel
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

"use client";

import { CountUp } from "@/components/ui/CountUp";
import { CaseNav } from "@/components/sections/CaseNav";

/* ─── palette ──────────────────────────────────────────────────────────────── */
const C = {
  bg: "#0B0D17",
  surface: "#131628",
  border: "#252A44",
  accent: "#818CF8",      // indigo — risk / finance
  accentB: "#34D399",     // emerald — calibrated
  accentC: "#FBBF24",     // amber — rejected experiment
  muted: "#6B7280",
  text: "#F8FAFC",
  textSub: "#A1A7C0",
};

const LIVE = "https://credit-risk-prediction-skay.streamlit.app";
const CODE = "https://github.com/skayy47/credit-risk-prediction";

const WHAT = [
  { k: "01", title: "Real data, real scale", body: "307,000 loan applicants and 153 features, 31 of them engineered from the bureau and credit-history tables." },
  { k: "02", title: "Discrimination", body: "LightGBM reaches AUC 0.775 / Gini 0.550 on held-out data — reported with Gini and KS, the metrics a credit team actually reads." },
  { k: "03", title: "Calibration", body: "Isotonic calibration cuts the Brier score from 0.147 to 0.067 without touching ranking — a score you can read as a probability." },
  { k: "04", title: "Explainability", body: "SHAP explains every individual score, so a decision can be justified to a regulator or a customer." },
];

function Stat({ value, label, decimals = 0, suffix = "" }: { value: number; label: string; decimals?: number; suffix?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: C.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div style={{ fontSize: "0.8rem", color: C.textSub, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

function BrierBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
        <span style={{ color: C.text }}>{label}</span>
        <span style={{ fontFamily: "var(--font-jb)", color: C.textSub }}>Brier {value.toFixed(3)}</span>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

export default function CreditRiskCase() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--font-grotesk), system-ui, sans-serif" }}>

      {/* ── back bar ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", rowGap: 8, borderBottom: `1px solid ${C.border}`, background: C.bg + "ee", backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ color: C.textSub, fontSize: "0.8rem", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          ← SKAY · Portfolio
        </a>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={LIVE} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.78rem", padding: "11px 14px", background: C.accent, color: "#000", borderRadius: 6, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
            Open Live App ↗
          </a>
          <a href={CODE} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.78rem", padding: "11px 14px", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
            GitHub
          </a>
        </div>
      </div>

      {/* ── hero ── */}
      <section style={{ paddingTop: "clamp(100px, 14vw, 160px)", paddingBottom: "clamp(60px, 8vw, 100px)", paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, border: `1px solid ${C.accent}33`, borderRadius: 99, padding: "4px 14px" }}>
          <span style={{ width: 6, height: 6, background: C.accent, borderRadius: "50%", animation: "pulse 2s infinite" }} />
          Production ML · Calibrated PD · Live
        </div>

        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          Credit Risk<br />
          <span style={{ color: C.accent }}>Probability of Default</span>
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: C.textSub, lineHeight: 1.7, maxWidth: 620, margin: "0 0 48px" }}>
          A calibrated default-risk scoring engine on 307,000 real loan applications — LightGBM, SHAP explanations per applicant, and an interactive threshold simulator. Not a notebook: a config-driven pipeline with <strong style={{ color: C.accentB }}>19 pytest tests</strong>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, padding: "32px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <Stat value={0.775} label="AUC" decimals={3} />
          <Stat value={0.55} label="Gini" decimals={3} />
          <Stat value={0.067} label="Calibrated Brier" decimals={3} />
          <Stat value={307} label="Applicants" suffix="K" />
        </div>
      </section>

      {/* ── what i built ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 32 }}>What I built</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 20 }}>
          {WHAT.map(({ k, title, body }) => (
            <div key={k} style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: "0.7rem", color: C.accent, fontFamily: "var(--font-jb)", marginBottom: 10, opacity: 0.7 }}>{k}</div>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.95rem" }}>{title}</div>
              <div style={{ fontSize: "0.82rem", color: C.textSub, lineHeight: 1.65 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── calibration ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Calibration</p>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 32, letterSpacing: "-0.02em" }}>
          Same ranking. A probability you can trust.
        </h2>
        <div style={{ padding: 28, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <BrierBar label="Raw LightGBM" value={0.147} max={0.16} color={`linear-gradient(90deg, #4B5563, #6B7280)`} />
          <BrierBar label="Isotonic-calibrated" value={0.067} max={0.16} color={`linear-gradient(90deg, ${C.accentB}, ${C.accent})`} />
          <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
            Lower is better. Calibration changes the probabilities, not the order — AUC stays at 0.775.
          </p>
        </div>
      </section>

      {/* ── rejected experiment ── */}
      <section style={{ padding: "clamp(20px, 4vw, 60px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ padding: 28, background: C.surface, border: `1px solid ${C.accentC}55`, borderRadius: 16 }}>
          <p style={{ fontSize: "0.72rem", color: C.accentC, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>The experiment I didn’t ship</p>
          <p style={{ fontSize: "0.95rem", color: C.textSub, lineHeight: 1.7, margin: 0 }}>
            An Optuna tuning run scored below the baseline. It was documented and rejected rather than shipped — the reported model is the one that actually performed best.
          </p>
        </div>
      </section>

      {/* ── tech stack ── */}
      <section style={{ padding: "clamp(20px, 4vw, 60px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["LightGBM", "SHAP", "scikit-learn", "Isotonic calibration", "Optuna", "Pandas", "Streamlit", "pytest", "Python"].map(t => (
            <span key={t} style={{ fontSize: "0.75rem", padding: "5px 12px", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 6, letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Score an applicant yourself.
        </h2>
        <p style={{ color: C.textSub, marginBottom: 40, fontSize: "1rem" }}>
          Five-tab Streamlit business simulator — move the threshold and watch approvals, defaults and SHAP reasons change.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={LIVE} target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 32px", background: C.accent, color: "#000", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
            Open Streamlit App ↗
          </a>
          <a href={CODE} target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 32px", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>
            View Source
          </a>
        </div>
        <p style={{ marginTop: 48, color: C.muted, fontSize: "0.78rem" }}>
          Built by <a href="/" style={{ color: C.textSub, textDecoration: "none" }}>SKAY · Oussama Skia</a> — AI / ML Engineer · Casablanca
        </p>
      </section>

      <CaseNav current="credit" accent={C.accentB} border={C.border} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

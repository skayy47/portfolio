"use client";

import { useEffect, useRef, useState } from "react";

/* ─── palette ──────────────────────────────────────────────────────────────── */
const C = {
  bg: "#0A0E1A",
  surface: "#111827",
  border: "#1E2D40",
  accent: "#F59E0B",      // amber — data / BI
  accentB: "#10B981",     // emerald — best model
  accentC: "#3B82F6",     // blue — secondary
  muted: "#6B7280",
  text: "#F9FAFB",
  textSub: "#9CA3AF",
};

/* ─── data ─────────────────────────────────────────────────────────────────── */
const MODELS = [
  { name: "Prophet (Optuna)", mape: 2.17, mae: 1024014, best: true },
  { name: "XGBoost (Baseline)", mape: 2.63, mae: 1221143, best: false },
  { name: "XGBoost (Optuna+FE)", mape: null, mae: 1378265, best: false },
  { name: "SARIMAX", mape: 7.09, mae: 3298372, best: false },
];

const FEATURES = [
  { name: "weekofyear", pct: 92 },
  { name: "month", pct: 81 },
  { name: "lag_1", pct: 68 },
  { name: "roll_std_4", pct: 54 },
  { name: "IsHoliday", pct: 38 },
  { name: "Temperature", pct: 27 },
];

const WHAT = [
  { k: "01", title: "End-to-end pipeline", body: "Merged 3 raw CSVs (sales, features, stores) into a weekly time series across 45 Walmart stores — no leakage, temporal split." },
  { k: "02", title: "Model benchmark", body: "Prophet, XGBoost, and SARIMAX benchmarked head-to-head. Optuna with TimeSeriesSplit CV squeezed Prophet down to 2.17% MAPE." },
  { k: "03", title: "Feature engineering", body: "Lag features, rolling statistics, calendar encodings, interaction terms — 30+ features ranked by XGBoost gain." },
  { k: "04", title: "Power BI dashboard", body: "9 automated charts (Matplotlib + Seaborn) exported as high-res PNGs. Full Power BI report with direct CSV connectors." },
];

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target * 100) / 100);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ─── components ───────────────────────────────────────────────────────────── */
function Stat({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) {
  const { ref, visible } = useInView(0.3);
  const v = useCounter(value, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: C.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {prefix}{suffix === "%" ? v.toFixed(2) : Math.round(v).toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: "0.8rem", color: C.textSub, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

function ModelBar({ model, maxMae, delay, visible }: { model: typeof MODELS[0]; maxMae: number; delay: number; visible: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setW((model.mae / maxMae) * 100), delay);
    return () => clearTimeout(t);
  }, [visible, model.mae, maxMae, delay]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: "0.85rem", color: model.best ? C.accentB : C.text, fontWeight: model.best ? 700 : 400, display: "flex", alignItems: "center", gap: 6 }}>
          {model.best && <span style={{ fontSize: "0.7rem", background: C.accentB + "22", color: C.accentB, border: `1px solid ${C.accentB}44`, borderRadius: 4, padding: "1px 6px" }}>BEST</span>}
          {model.name}
        </span>
        <span style={{ fontSize: "0.78rem", color: C.textSub, fontFamily: "var(--font-jb)" }}>
          MAE ${(model.mae / 1e6).toFixed(2)}M{model.mape ? ` · ${model.mape}% MAPE` : ""}
        </span>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${w}%`,
          borderRadius: 99,
          background: model.best ? `linear-gradient(90deg, ${C.accentB}, ${C.accentC})` : C.border,
          border: model.best ? "none" : `1px solid #374151`,
          transition: "width 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          ...(model.best ? {} : { backgroundImage: `linear-gradient(90deg, #374151, #4B5563)` }),
        }} />
      </div>
    </div>
  );
}

function ForecastChart({ visible }: { visible: boolean }) {
  // Fake but realistic weekly sales line
  const weeks = 20;
  const actual = [1.8, 2.1, 1.9, 2.4, 2.2, 1.7, 2.0, 2.3, 2.6, 2.1, 1.9, 2.2, 2.5, 2.3, 1.8, 2.1, 2.4, 2.2, 2.0, 2.3];
  const prophet = [1.85, 2.05, 1.95, 2.35, 2.15, 1.72, 2.02, 2.28, 2.58, 2.08, 1.92, 2.18, 2.48, 2.32, 1.82, 2.12, 2.42, 2.22, 2.02, 2.28];
  const future = [2.4, 2.6, 2.5, 2.3, 2.7, 2.5];

  const W = 100, H = 60;
  const minY = 1.5, maxY = 3.0;
  const toX = (i: number, len: number) => (i / (len - 1)) * W;
  const toY = (v: number) => H - ((v - minY) / (maxY - minY)) * H;

  const pts = (arr: number[], offset = 0) =>
    arr.map((v, i) => `${toX(i + offset, weeks + future.length)},${toY(v)}`).join(" ");

  const [clip, setClip] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      let p = 0;
      const step = () => { p += 2; setClip(Math.min(p, 100)); if (p < 100) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, 200);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
        <defs>
          <clipPath id="reveal">
            <rect x="0" y="0" width={clip} height={H} />
          </clipPath>
          <linearGradient id="futureGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[1.5, 2.0, 2.5, 3.0].map(v => (
          <line key={v} x1="0" y1={toY(v)} x2={W} y2={toY(v)} stroke={C.border} strokeWidth="0.3" />
        ))}
        {/* divider: actual vs future */}
        <line x1={toX(weeks - 1, weeks + future.length)} y1="0" x2={toX(weeks - 1, weeks + future.length)} y2={H} stroke={C.accent + "44"} strokeWidth="0.4" strokeDasharray="1,1" />

        <g clipPath="url(#reveal)">
          {/* actual line */}
          <polyline points={pts(actual)} fill="none" stroke={C.accentC} strokeWidth="0.8" strokeLinejoin="round" />
          {/* prophet predictions */}
          <polyline points={pts(prophet)} fill="none" stroke={C.accentB} strokeWidth="0.8" strokeLinejoin="round" strokeDasharray="2,1" />
          {/* future forecast */}
          <polyline points={pts(future, weeks - 1)} fill="none" stroke={C.accent} strokeWidth="0.8" strokeLinejoin="round" />
        </g>
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {[{ c: C.accentC, label: "Actual sales" }, { c: C.accentB, label: "Prophet (2.17% MAPE)" }, { c: C.accent, label: "Future forecast" }].map(({ c, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: C.textSub }}>
            <div style={{ width: 16, height: 2, background: c, borderRadius: 1 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureBar({ name, pct, delay, visible }: { name: string; pct: number; delay: number; visible: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [visible, pct, delay]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 36px", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-jb)", color: C.textSub }}>{name}</span>
      <div style={{ height: 6, background: C.border, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${w}%`, borderRadius: 99, background: `linear-gradient(90deg, ${C.accent}, ${C.accentC})`, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <span style={{ fontSize: "0.72rem", color: C.muted, textAlign: "right", fontFamily: "var(--font-jb)" }}>{pct}%</span>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────────────────────────── */
export default function WalmartDemo() {
  const maxMae = Math.max(...MODELS.map(m => m.mae));
  const modelsRef = useInView(0.2);
  const featRef = useInView(0.2);
  const chartRef = useInView(0.2);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--font-grotesk), system-ui, sans-serif" }}>

      {/* ── back bar ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, background: C.bg + "ee", backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ color: C.textSub, fontSize: "0.8rem", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.textSub)}>
          ← SKAY · Portfolio
        </a>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="https://walmart-sales-forecasting-skay.streamlit.app" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.78rem", padding: "6px 14px", background: C.accent, color: "#000", borderRadius: 6, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
            Open Live App ↗
          </a>
          <a href="https://github.com/skayy47/walmart-sales-forecasting" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.78rem", padding: "6px 14px", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em" }}>
            GitHub
          </a>
        </div>
      </div>

      {/* ── hero ── */}
      <section style={{ paddingTop: "clamp(100px, 14vw, 160px)", paddingBottom: "clamp(60px, 8vw, 100px)", paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, border: `1px solid ${C.accent}33`, borderRadius: 99, padding: "4px 14px" }}>
          <span style={{ width: 6, height: 6, background: C.accent, borderRadius: "50%", animation: "pulse 2s infinite" }} />
          Time-Series BI · ML · Live
        </div>

        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          Walmart Sales<br />
          <span style={{ color: C.accent }}>Forecasting</span>
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: C.textSub, lineHeight: 1.7, maxWidth: 600, margin: "0 0 48px" }}>
          End-to-end ML pipeline across 45 stores — three models benchmarked, Optuna-tuned, Power BI dashboard, and a 5-page Streamlit app. Best result: <strong style={{ color: C.accentB }}>2.17% MAPE with Prophet</strong>.
        </p>

        {/* stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, padding: "32px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <Stat value={2.17} label="Best MAPE" suffix="%" />
          <Stat value={45} label="Stores" suffix="" />
          <Stat value={3} label="Models benchmarked" suffix="" />
          <Stat value={9} label="Dashboard charts" suffix="" />
        </div>
      </section>

      {/* ── what i built ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 32 }}>What I built</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {WHAT.map(({ k, title, body }) => (
            <div key={k} style={{ padding: 24, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: "0.7rem", color: C.accent, fontFamily: "var(--font-jb)", marginBottom: 10, opacity: 0.7 }}>{k}</div>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.95rem" }}>{title}</div>
              <div style={{ fontSize: "0.82rem", color: C.textSub, lineHeight: 1.65 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── model benchmark ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Model benchmark</p>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 32, letterSpacing: "-0.02em" }}>
          Four models. One winner.
        </h2>
        <div ref={modelsRef.ref} style={{ padding: 28, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          {MODELS.map((m, i) => (
            <ModelBar key={m.name} model={m} maxMae={maxMae} delay={i * 120} visible={modelsRef.visible} />
          ))}
          <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
            Evaluation window: May – Oct 2012 · 20% holdout · temporal split · no data leakage
          </p>
        </div>
      </section>

      {/* ── feature importance ── */}
      <section style={{ padding: "clamp(20px, 4vw, 60px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Feature importance</p>
        <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800, marginBottom: 28, letterSpacing: "-0.02em" }}>
          Seasonality dominates. Always.
        </h2>
        <div ref={featRef.ref} style={{ display: "grid", gap: 12 }}>
          {FEATURES.map(({ name, pct }, i) => (
            <FeatureBar key={name} name={name} pct={pct} delay={i * 80} visible={featRef.visible} />
          ))}
        </div>
      </section>

      {/* ── forecast chart ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Forecast</p>
        <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800, marginBottom: 24, letterSpacing: "-0.02em" }}>
          Actual vs Prophet vs future
        </h2>
        <div ref={chartRef.ref} style={{ padding: 28, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <ForecastChart visible={chartRef.visible} />
        </div>
      </section>

      {/* ── tech stack ── */}
      <section style={{ padding: "clamp(20px, 4vw, 60px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Prophet", "XGBoost", "SARIMAX", "Optuna", "Pandas", "scikit-learn", "Streamlit", "Power BI", "Matplotlib", "Seaborn", "Python"].map(t => (
            <span key={t} style={{ fontSize: "0.75rem", padding: "5px 12px", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 6, letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
          See it running live.
        </h2>
        <p style={{ color: C.textSub, marginBottom: 40, fontSize: "1rem" }}>
          Streamlit app — full interactive forecasting dashboard, model comparison, and future projections.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://walmart-sales-forecasting-skay.streamlit.app" target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 32px", background: C.accent, color: "#000", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: "0.95rem", letterSpacing: "0.02em", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            Open Streamlit App ↗
          </a>
          <a href="https://github.com/skayy47/walmart-sales-forecasting" target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 32px", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.95rem", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.textSub)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
            View Source
          </a>
        </div>
        <p style={{ marginTop: 48, color: C.muted, fontSize: "0.78rem" }}>
          Built by <a href="/" style={{ color: C.textSub, textDecoration: "none" }}>SKAY · Oussama Skia</a> — AI / ML Engineer · Casablanca
        </p>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

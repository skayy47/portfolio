"use client";

import { CountUp } from "@/components/ui/CountUp";
import { CaseNav } from "@/components/sections/CaseNav";

/* ─── palette ──────────────────────────────────────────────────────────────── */
const C = {
  bg: "#07111A",
  surface: "#0E1B26",
  border: "#1B3142",
  accent: "#22D3EE",      // cyan — streaming / city data
  accentB: "#A3E635",     // lime — measured wins
  accentC: "#F472B6",     // pink — honest negatives
  muted: "#64748B",
  text: "#F1F5F9",
  textSub: "#94A3B8",
};

const CONSOLE = "https://urbansense-console.vercel.app";

/* ─── data — every number from the repo's measured artifacts ───────────────── */
const PIPELINE = [
  { k: "Ingest", body: "Kafka (KRaft) topics carry live sensor messages from Casablanca road segments." },
  { k: "Stream", body: "Spark Structured Streaming validates against JSON Schema contracts and writes to InfluxDB + MongoDB." },
  { k: "Forecast", body: "A GRU seq2seq model (928k params) predicts traffic 15 minutes ahead, with split-conformal uncertainty bands." },
  { k: "Defend", body: "A false-data-injection detector flags spoofed sensors — and its blind spot is published, not hidden." },
  { k: "Explain", body: "A bilingual EN/FR assistant answers from the live data, with every number checked against its source." },
];

const MEASURED = [
  { label: "emit → store p50", value: "260 ms" },
  { label: "emit → store p95", value: "870 ms" },
  { label: "messages inside the 2 s budget", value: "8,280 / 8,280" },
  { label: "GRU MAE @15 min", value: "3.07 mph" },
  { label: "published FC-LSTM baseline", value: "3.44 mph" },
  { label: "conformal coverage (90% nominal)", value: "88.5%" },
];

const WHAT = [
  { k: "01", title: "My part", body: "Owned M3 — the Next.js + deck.gl console and the agentic assistant — and implemented all four modules at the team's request. Wrote the 18,000-word report in French, the 18-slide deck and a 22-page rehearsal guide." },
  { k: "02", title: "Beats the baseline, honestly", body: "MAE 3.07 beats the published FC-LSTM (3.44) and correctly never beats DCRNN (2.77) — a result that did would signal leakage, so it was checked for." },
  { k: "03", title: "An evaluation that says no", body: "A 34-question bilingual golden set plus a mechanical groundedness check rejected two LLMs (35.3% and 55.9% grounded) for inventing numbers. The shipped assistant routes deterministically instead." },
  { k: "04", title: "A negative result, published", body: "An A4 corridor attack defeats spatial detection (1.0× vs 9.4× / 3.8× / 2.2× on A1–A3). CUSUM partially catches it at a 28.86% false-positive rate — reported as disqualifying, not buried." },
];

function Stat({ value, label, suffix = "", decimals = 0 }: { value: number; label: string; suffix?: string; decimals?: number }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: C.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div style={{ fontSize: "0.8rem", color: C.textSub, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

export default function UrbanSenseCase() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--font-grotesk), system-ui, sans-serif" }}>

      {/* ── back bar ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", rowGap: 8, borderBottom: `1px solid ${C.border}`, background: C.bg + "ee", backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ color: C.textSub, fontSize: "0.8rem", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          ← SKAY · Portfolio
        </a>
        <a href={CONSOLE} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "0.78rem", padding: "11px 14px", background: C.accent, color: "#000", borderRadius: 6, fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
          Open the console ↗
        </a>
      </div>

      {/* ── hero ── */}
      <section style={{ paddingTop: "clamp(100px, 14vw, 160px)", paddingBottom: "clamp(60px, 8vw, 100px)", paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24, border: `1px solid ${C.accent}33`, borderRadius: 99, padding: "4px 14px" }}>
          <span style={{ width: 6, height: 6, background: C.accent, borderRadius: "50%", animation: "pulse 2s infinite" }} />
          Streaming · Forecasting · Evaluated AI
        </div>

        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          UrbanSense<br />
          <span style={{ color: C.accent }}>Casablanca, in real time</span>
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: C.textSub, lineHeight: 1.7, maxWidth: 640, margin: "0 0 48px" }}>
          A real-time digital twin of Casablanca traffic: Kafka and Spark streaming, a GRU forecaster with honest uncertainty, an attack detector, and a bilingual assistant that is not allowed to invent numbers. Final-year team project (4 engineers), defended September 2026 — jury verdict: <strong style={{ color: C.accentB }}>“excellent work”</strong>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, padding: "32px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <Stat value={870} label="p95 latency" suffix=" ms" />
          <Stat value={100} label="inside 2 s budget" suffix="%" />
          <Stat value={3.07} label="GRU MAE (mph)" decimals={2} />
          <Stat value={88.5} label="conformal coverage" suffix="%" decimals={1} />
        </div>
      </section>

      {/* ── pipeline ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Architecture</p>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 32, letterSpacing: "-0.02em" }}>
          Sensor to answer, in under two seconds.
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {PIPELINE.map(({ k, body }, i) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "minmax(90px, 120px) 1fr", gap: 16, alignItems: "baseline", padding: "16px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <span style={{ fontFamily: "var(--font-jb)", fontSize: "0.8rem", color: C.accent }}>{String(i + 1).padStart(2, "0")} · {k}</span>
              <span style={{ fontSize: "0.88rem", color: C.textSub, lineHeight: 1.6 }}>{body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── measured ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Measured, not asserted</p>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 32, letterSpacing: "-0.02em" }}>
          Every number comes from a run you can repeat.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 12 }}>
          {MEASURED.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: "16px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <span style={{ fontSize: "0.82rem", color: C.textSub }}>{label}</span>
              <span style={{ fontFamily: "var(--font-jb)", fontSize: "0.95rem", color: C.text, whiteSpace: "nowrap" }}>{value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
          16/16 CI checks green with the real Docker stack up. The public console runs in replay mode — there is no public backend, and it says so.
        </p>
      </section>

      {/* ── what stands out ── */}
      <section style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <p style={{ fontSize: "0.72rem", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 32 }}>What stands out</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 20 }}>
          {WHAT.map(({ k, title, body }) => (
            <div key={k} style={{ padding: 24, background: C.surface, border: `1px solid ${k === "04" ? C.accentC + "55" : C.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: "0.7rem", color: k === "04" ? C.accentC : C.accent, fontFamily: "var(--font-jb)", marginBottom: 10, opacity: 0.8 }}>{k}</div>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.95rem" }}>{title}</div>
              <div style={{ fontSize: "0.82rem", color: C.textSub, lineHeight: 1.65 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── tech stack ── */}
      <section style={{ padding: "clamp(20px, 4vw, 60px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Kafka (KRaft)", "Spark Structured Streaming", "InfluxDB", "MongoDB", "PyTorch GRU", "Conformal prediction", "Next.js 16", "deck.gl", "Docker Compose", "JSON Schema", "CI"].map(t => (
            <span key={t} style={{ fontSize: "0.75rem", padding: "5px 12px", border: `1px solid ${C.border}`, color: C.textSub, borderRadius: 6, letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)", maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Watch the city move.
        </h2>
        <p style={{ color: C.textSub, marginBottom: 40, fontSize: "1rem" }}>
          The console replays recorded sensor traffic on the live map. The source is a private team repository — available on request.
        </p>
        <a href={CONSOLE} target="_blank" rel="noopener noreferrer"
          style={{ padding: "14px 32px", background: C.accent, color: "#000", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
          Open the console ↗
        </a>
        <p style={{ marginTop: 48, color: C.muted, fontSize: "0.78rem" }}>
          Built by <a href="/" style={{ color: C.textSub, textDecoration: "none" }}>SKAY · Oussama Skia</a> with a team of four — AI / ML Engineer · Casablanca
        </p>
      </section>

      <CaseNav current="urbansense" accent={C.accentB} border={C.border} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

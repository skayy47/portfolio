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
  bg: "#050810",
  surface: "#0A0F1E",
  card: "#0F1628",
  border: "#1A2545",
  accent: "#7C3AED",
  accentLight: "#A78BFA",
  accentDim: "rgba(124,58,237,0.15)",
  accentBorder: "rgba(124,58,237,0.4)",
  teal: "#0EA5E9",
  tealDim: "rgba(14,165,233,0.12)",
  emerald: "#10B981",
  emeraldDim: "rgba(16,185,129,0.12)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.12)",
  textPrimary: "#EEF2FF",
  textSec: "#8B9EC3",
  textMuted: "#3D4F75",
};

const AGENT_COLORS: Record<string, string> = {
  Research: C.accent,
  Data: C.teal,
  Automation: C.emerald,
};

/* ─── sub-components ─── */
function StatCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const { ref, visible } = useInView(0.3);
  const val = useCounter(target, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: 42, fontWeight: 800, color: C.accentLight, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
        {val}{suffix}
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

function AgentCard({ name, role, output, color, active, delay }: {
  name: string; role: string; output: string; color: string;
  active: boolean; delay: number;
}) {
  const [lit, setLit] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setLit(true), delay);
    const t2 = setTimeout(() => setDone(true), delay + 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active, delay]);

  return (
    <div style={{
      background: lit ? `rgba(${color === C.accent ? "124,58,237" : color === C.teal ? "14,165,233" : "16,185,129"},0.08)` : C.card,
      border: `1px solid ${lit ? color : C.border}`,
      borderRadius: 14, padding: "22px 22px 18px",
      transition: "all 0.5s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 9, height: 9, borderRadius: "50%", background: color,
            animation: lit && !done ? "pulse 1s infinite" : "none",
            opacity: lit ? 1 : 0.3, transition: "opacity 0.4s",
          }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: lit ? color : C.textSec }}>{name} Agent</span>
        </div>
        {done && (
          <span style={{ fontSize: 11, color: color, fontWeight: 700, background: `rgba(${color === C.accent ? "124,58,237" : color === C.teal ? "14,165,233" : "16,185,129"},0.15)`, padding: "3px 8px", borderRadius: 4 }}>
            DONE
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{role}</div>
      <div style={{
        fontSize: 13, color: C.textSec, lineHeight: 1.6,
        opacity: done ? 1 : 0, transition: "opacity 0.6s 0.2s",
        fontFamily: "monospace",
      }}>
        {output}
      </div>
    </div>
  );
}

/* ─── page ─── */
export default function MaestroDemo() {
  const dagRef = useRef<HTMLDivElement>(null);
  const [dagVisible, setDagVisible] = useState(false);

  const agentsRef = useRef<HTMLDivElement>(null);
  const [agentsVisible, setAgentsVisible] = useState(false);

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
    const o1 = makeObs(dagRef.current, setDagVisible);
    const o2 = makeObs(agentsRef.current, setAgentsVisible);
    return () => { o1?.disconnect(); o2?.disconnect(); };
  }, []);

  const FEATURES = [
    {
      num: "01", icon: "🧠", title: "LLM-Planned Agent DAG",
      body: "The orchestrator reads your mission and produces a directed acyclic graph: which agents to run, in what order, with what inputs. No hardcoded pipelines — the plan emerges from the mission.",
    },
    {
      num: "02", icon: "📡", title: "Live SSE Pipeline",
      body: "Every agent step streams in real time via Server-Sent Events. You watch the Research agent fetch URLs, the Data agent compute stats, the Automation agent compile JSON — live, not replayed.",
    },
    {
      num: "03", icon: "🔍", title: "Real Tavily Search",
      body: "The Research agent calls the Tavily API and injects real URLs into the brief. Nothing is invented. Every source in the output was fetched during your session.",
    },
    {
      num: "04", icon: "⚙️", title: "Deterministic n8n Compiler",
      body: "The Automation agent doesn't ask an LLM to write JSON. It uses a typed compiler that assembles valid, importable n8n workflow JSON from a fixed template library. Always importable.",
    },
  ];

  const TECH = [
    "Next.js 14", "TypeScript", "Groq Llama 3.3 70B", "Tavily Search API",
    "Server-Sent Events", "FastAPI", "Vitest (48/48)", "n8n workflow compiler",
    "Framer Motion", "Vercel", "Model fallback chain", "Showcase replay mode",
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: C.textPrimary }}>

      {/* ── navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 56,
        background: "rgba(5,8,16,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: C.textSec, textDecoration: "none", letterSpacing: "0.06em" }}>
          ← SKAY · PORTFOLIO
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="https://maestro-lac-theta.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "7px 16px", background: C.accent, borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none" }}
          >
            Open Live App ↗
          </a>
          <a
            href="https://github.com/skayy47/maestro"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.textSec, textDecoration: "none" }}
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* ── hero ── */}
      <section style={{ paddingTop: 120, textAlign: "center", maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 999,
          background: C.accentDim, border: `1px solid ${C.accentBorder}`,
          marginBottom: 32,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentLight, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em" }}>
            MULTI-AGENT · SSE · LIVE
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(60px, 11vw, 110px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-4px", margin: "0 0 20px" }}>
          MAE<span style={{ color: C.accentLight }}>STRO</span>
        </h1>

        <div style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 700, color: C.textSec, marginBottom: 28, letterSpacing: "-0.3px" }}>
          Multi-Agent Command Center
        </div>

        <p style={{ fontSize: 16, color: C.textSec, maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.8 }}>
          A mission in. A verifiable deliverable out. Orchestrated live.
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.75 }}>
          An LLM reads your mission, plans a DAG of specialist agents, runs them as a live streaming pipeline, and synthesizes one output — sourced market briefs, real CSV data, importable n8n workflows. Nothing invented.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://maestro-lac-theta.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 28px", background: C.accent, borderRadius: 10, fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}
          >
            Watch it orchestrate ↗
          </a>
          <a
            href="https://github.com/skayy47/maestro"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 24px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none" }}
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
            { target: 48, suffix: "/48", label: "Tests green" },
            { target: 3, suffix: "", label: "Specialist agents" },
            { target: 8, suffix: "", label: "Tavily sources" },
            { target: 1, suffix: "", label: "Verifiable deliverable" },
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
            Real orchestration. Not prompt chains.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => <FeatureCard key={f.num} {...f} />)}
        </div>
      </section>

      {/* ── live mission DAG ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 10 }}>ORCHESTRATION FLOW</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: 0 }}>
            Mission → Plan → Execute → Deliver.
          </h2>
        </div>

        <div ref={dagRef} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "40px 32px" }}>

          {/* mission input */}
          <MissionBox active={dagVisible} />

          {/* arrow down */}
          <FlowArrow active={dagVisible} delay={600} />

          {/* orchestrator */}
          <OrchestratorBox active={dagVisible} delay={800} />

          {/* arrow down */}
          <FlowArrow active={dagVisible} delay={1400} />

          {/* three agents */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { name: "Research", color: C.accent, role: "Tavily · 8 live sources", delay: 1600 },
              { name: "Data", color: C.teal, role: "CSV · live stats", delay: 1800 },
              { name: "Automation", color: C.emerald, role: "n8n · compiled workflow", delay: 2000 },
            ].map((a) => (
              <AgentMiniBox key={a.name} name={a.name} color={a.color} role={a.role} active={dagVisible} delay={a.delay} />
            ))}
          </div>

          {/* arrow down */}
          <FlowArrow active={dagVisible} delay={3000} />

          {/* synthesis */}
          <SynthBox active={dagVisible} delay={3200} />
        </div>
      </section>

      {/* ── agents detail ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 10 }}>THE AGENTS</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 12px" }}>
            Three specialists. One mission.
          </h2>
          <p style={{ fontSize: 15, color: C.textSec, margin: 0 }}>Each agent streams its work live. Watch it think.</p>
        </div>

        <div ref={agentsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <AgentCard
            name="Research" role="Tavily Search API · real-time web"
            color={C.accent} active={agentsVisible} delay={0}
            output={'→ "EV market grew 38% YoY in Q1 2025"\n→ 8 sources with verified URLs\n→ Executive brief drafted'}
          />
          <AgentCard
            name="Data" role="CSV generation · live statistics"
            color={C.teal} active={agentsVisible} delay={400}
            output={"→ 12 market data points computed\n→ CSV exported: ev_market_2025.csv\n→ Top 3 OEMs by unit share"}
          />
          <AgentCard
            name="Automation" role="n8n compiler · typed template library"
            color={C.emerald} active={agentsVisible} delay={800}
            output={"→ Workflow compiled: 4 nodes\n→ Trigger → HTTP → Transform → Notify\n→ Valid JSON — ready to import"}
          />
        </div>
      </section>

      {/* ── n8n output showcase ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.emerald, letterSpacing: "0.12em", marginBottom: 12 }}>DETERMINISTIC COMPILER</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 16px" }}>
              Real workflows. Not LLM JSON.
            </h2>
            <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7, margin: "0 0 20px" }}>
              Most agents that "generate n8n workflows" ask an LLM to write JSON and hope it's valid. MAESTRO's Automation agent uses a typed compiler — fixed node templates assembled deterministically. The output always imports.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "✓", label: "Valid JSON — guaranteed importable", color: C.emerald },
                { icon: "✓", label: "Typed node templates, not LLM strings", color: C.emerald },
                { icon: "✓", label: "4-node workflow for the EV outreach mission", color: C.emerald },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: item.color, fontWeight: 700, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: C.textSec }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "#0A0A14", border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "20px 20px", fontFamily: "monospace",
            fontSize: 12, lineHeight: 1.7, color: "#8B9EC3",
            overflowX: "auto",
          }}>
            <div style={{ color: C.textMuted, marginBottom: 10, fontSize: 11 }}>// ev-outreach.workflow.json</div>
            <div><span style={{ color: "#A78BFA" }}>{"{"}</span></div>
            <div style={{ paddingLeft: 16 }}><span style={{ color: "#7DD3FC" }}>"name"</span><span>: </span><span style={{ color: "#86EFAC" }}>"EV Outreach Pipeline"</span><span>,</span></div>
            <div style={{ paddingLeft: 16 }}><span style={{ color: "#7DD3FC" }}>"nodes"</span><span>: [</span></div>
            <div style={{ paddingLeft: 32 }}><span style={{ color: C.textMuted }}>{"{ type: \"n8n-nodes-base.webhook\" },"}</span></div>
            <div style={{ paddingLeft: 32 }}><span style={{ color: C.textMuted }}>{"{ type: \"n8n-nodes-base.httpRequest\" },"}</span></div>
            <div style={{ paddingLeft: 32 }}><span style={{ color: C.textMuted }}>{"{ type: \"n8n-nodes-base.set\" },"}</span></div>
            <div style={{ paddingLeft: 32 }}><span style={{ color: C.textMuted }}>{"{ type: \"n8n-nodes-base.emailSend\" }"}</span></div>
            <div style={{ paddingLeft: 16 }}>],</div>
            <div style={{ paddingLeft: 16 }}><span style={{ color: "#7DD3FC" }}>"active"</span><span>: </span><span style={{ color: "#FB923C" }}>true</span></div>
            <div><span style={{ color: "#A78BFA" }}>{"}"}</span></div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.emerald }}>
              ✓ Validated · Ready to import into n8n
            </div>
          </div>
        </div>
      </section>

      {/* ── tech stack ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accentLight, letterSpacing: "0.12em", marginBottom: 12 }}>TECH STACK</div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 28px" }}>
          48 tests green. Every agent verified.
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
          MULTI-AGENT COMMAND CENTER
        </div>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 16px" }}>
          Give it a mission.<br />
          <span style={{ color: C.accentLight }}>Watch it orchestrate.</span>
        </h2>
        <p style={{ fontSize: 15, color: C.textSec, margin: "0 auto 32px", maxWidth: 460, lineHeight: 1.7 }}>
          Try the EV market mission — watch Research, Data, and Automation agents spin up live, stream their work, and deliver a sourced brief in under 60 seconds.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://maestro-lac-theta.vercel.app"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 32px", background: C.accent, borderRadius: 10, fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}
          >
            Open MAESTRO ↗
          </a>
          <a
            href="https://github.com/skayy47/maestro"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: "14px 24px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none" }}
          >
            Source on GitHub
          </a>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center", fontSize: 12, color: C.textMuted }}>
        MAESTRO — built by <a href="/" style={{ color: C.accentLight, textDecoration: "none" }}>SKAY</a> · Multi-Agent Command Center · Deployed on Vercel
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}

/* ─── DAG flow components ─── */
function MissionBox({ active }: { active: boolean }) {
  return (
    <div style={{
      background: "#0A0F20", border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "16px 20px", textAlign: "center", marginBottom: 0,
      transition: "opacity 0.5s", opacity: active ? 1 : 0.3,
    }}>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, letterSpacing: "0.08em" }}>MISSION INPUT</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, fontStyle: "italic" }}>
        "Scan the EV market and draft an outreach plan."
      </div>
    </div>
  );
}

function FlowArrow({ active, delay }: { active: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return (
    <div style={{ textAlign: "center", padding: "10px 0", color: lit ? C.accentLight : C.border, fontSize: 20, transition: "color 0.4s" }}>↓</div>
  );
}

function OrchestratorBox({ active, delay }: { active: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return (
    <div style={{
      background: lit ? C.accentDim : "#0A0F20",
      border: `1px solid ${lit ? C.accent : C.border}`,
      borderRadius: 12, padding: "16px 20px", textAlign: "center",
      transition: "all 0.5s ease",
    }}>
      <div style={{ fontSize: 11, color: lit ? C.accentLight : C.textMuted, marginBottom: 6, letterSpacing: "0.08em", transition: "color 0.4s" }}>
        LLM ORCHESTRATOR
      </div>
      <div style={{ fontSize: 14, color: lit ? C.textPrimary : C.textSec, transition: "color 0.4s" }}>
        Plans DAG · selects agents · sets execution order
      </div>
    </div>
  );
}

function AgentMiniBox({ name, color, role, active, delay }: { name: string; color: string; role: string; active: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  const rgb = color === C.accent ? "124,58,237" : color === C.teal ? "14,165,233" : "16,185,129";
  return (
    <div style={{
      background: lit ? `rgba(${rgb},0.1)` : "#0A0F20",
      border: `1px solid ${lit ? color : C.border}`,
      borderRadius: 10, padding: "14px 14px",
      transition: "all 0.5s ease", textAlign: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%", background: color,
          animation: lit ? "pulse 1.2s infinite" : "none", opacity: lit ? 1 : 0.3, transition: "opacity 0.4s",
        }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: lit ? color : C.textMuted, transition: "color 0.4s" }}>{name}</span>
      </div>
      <div style={{ fontSize: 11, color: C.textMuted }}>{role}</div>
    </div>
  );
}

function SynthBox({ active, delay }: { active: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return (
    <div style={{
      background: lit ? C.emeraldDim : "#0A0F20",
      border: `1px solid ${lit ? C.emerald : C.border}`,
      borderRadius: 12, padding: "16px 20px", textAlign: "center",
      transition: "all 0.5s ease",
    }}>
      <div style={{ fontSize: 11, color: lit ? C.emerald : C.textMuted, marginBottom: 6, letterSpacing: "0.08em", transition: "color 0.4s" }}>
        SYNTHESIS · DELIVERABLE READY
      </div>
      <div style={{ fontSize: 14, color: lit ? C.textPrimary : C.textSec, transition: "color 0.4s" }}>
        Market brief · ev_market_2025.csv · ev-outreach.workflow.json
      </div>
    </div>
  );
}

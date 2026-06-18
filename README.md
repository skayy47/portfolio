# Oussama Skia — AI Engineer Portfolio

> Production AI systems, live and clickable. Built with Next.js 16 · React 19 · Three.js · GSAP.

[![Live](https://img.shields.io/badge/Live-skay.dev-6366F1?style=flat-square)](https://skay.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## What this is

A portfolio site that doubles as a showcase engine. Every project card contains a live, interactive illustration — not a screenshot. One click opens the real deployed app.

Five standalone demo pages (`/demo/*`) serve as deep-dive breakdowns — built to share directly on LinkedIn as technical showcase posts.

---

## Live demo pages

| Project | URL | Description |
|---------|-----|-------------|
| Walmart Sales Forecasting | `/demo/walmart` | Time-series BI · animated model benchmark · SVG forecast chart |
| nexus RAG Engine | `/demo/nexus` | Production RAG · contradiction showcase · confidence gating |
| MAESTRO Multi-Agent | `/demo/maestro` | Agent DAG visualization · n8n JSON · live SSE pipeline |

---

## Featured projects

### AURA — Universal Data Engine
Full-stack data intelligence platform. Drop any CSV/XLSX/JSON/Parquet → semantic column inference → 8-step cleaning pipeline → grounded AI chat → branded PDF report. Multi-provider AI cascade (Gemini → Groq → OpenAI → Claude). 55/55 tests. Bilingual EN/FR.

### nexus — Production RAG Engine
RAG system supporting 15 document formats. Hybrid BM25 + pgvector retrieval with RRF reranking. Auto-summary on upload. Claim-level answer grounding. Contradiction Radar (structured second LLM call). Knowledge gap detection. 145/145 tests.

### MAESTRO — Multi-Agent Command Center
LLM-planned agent DAG. Real Tavily search — URLs fetched live, never invented. Deterministic n8n workflow compiler (typed templates, not LLM JSON). Live SSE pipeline streams every agent step. 48/48 tests.

---

## Tech stack

```
Framework     Next.js 16 · App Router · React 19
Language      TypeScript 5 — strict mode
3D            React Three Fiber · @react-three/drei · Three.js
Animation     GSAP · @gsap/react · Framer Motion · Lenis
Styling       Tailwind CSS v4
Content       Bilingual EN/FR — all strings in src/lib/content.ts
Themes        5 palettes: aurora · champagne · pearl · sorbet · lagoon
Deploy        Vercel
```

---

## Local development

```bash
# 1. Clone
git clone https://github.com/skayy47/skay-project-.git
cd skay-project-/portfolio

# 2. Install
npm install

# 3. Run dev server
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build
npm run start
```

No environment variables required — the portfolio is fully static.

---

## Project structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Main portfolio (single page)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── demo/
│   │       ├── walmart/page.tsx  ← Walmart BI showcase
│   │       ├── nexus/page.tsx    ← nexus RAG showcase
│   │       └── maestro/page.tsx  ← MAESTRO multi-agent showcase
│   ├── lib/
│   │   └── content.ts            ← All bilingual strings (EN/FR)
│   └── sections/                 ← Hero · Work · Journey · Stack · Contact
│       demos/                    ← Inline demo components per project
│       three/                    ← React Three Fiber scenes
│       ui/                       ← Reusable UI primitives
├── public/
│   └── cinematics/               ← Project poster images + videos
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Design system

**Color themes** — toggle in the UI, stored in CSS custom properties:

| Theme | Accent | Surface |
|-------|--------|---------|
| aurora (default) | `#6366F1` indigo | dark slate |
| champagne | `#D4A853` gold | warm cream |
| pearl | `#E8E0D5` | light neutral |
| sorbet | `#F472B6` pink | dark |
| lagoon | `#0EA5E9` teal | dark |

**Demo pages** use project-specific palettes:
- Walmart → amber `#F59E0B` on `#0A0E1A`
- nexus → indigo `#6366F1` on `#04080F`
- MAESTRO → violet `#7C3AED` on `#050810`

---

## Deploy to Vercel

```bash
# Option 1 — Vercel CLI
npm i -g vercel
cd portfolio
vercel --prod

# Option 2 — Vercel dashboard
# Import repo at vercel.com/new
# Root directory: portfolio
# Framework preset: Next.js
# No env vars needed
```

---

## About

**Oussama Skia** — AI / ML Engineer based in Casablanca, Morocco.

Physics → Medicine in Ukraine (interrupted by war) → Computer Science → AI Engineering.  
Building production AI systems: RAG engines, multi-agent architectures, data pipelines.

- GitHub: [@skayy47](https://github.com/skayy47)
- Email: oussamaiskia@gmail.com
- Portfolio: [skay.dev](https://skay.dev)

---

*Every artifact is verifiable. Every system ships.*

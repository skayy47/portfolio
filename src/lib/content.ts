// Bilingual content layer (EN/FR). Every visible string lives here so the
// language toggle can swap the entire site instantly.

export type Locale = "en" | "fr";
export const LOCALES: Locale[] = ["en", "fr"];
export const DEFAULT_LOCALE: Locale = "en";

export type ProjectId = "aura" | "nexus" | "maestro";

/** Non-localized project facts. */
export interface ProjectBase {
  id: ProjectId;
  index: string;
  tech: string[];
  liveUrl: string;
  codeUrl: string;
  poster: string;
  video: string | null;
  accent: 1 | 2 | 3;
  demo: ProjectId; // which live-demo component to render
}

export const PROJECT_BASE: ProjectBase[] = [
  {
    id: "aura",
    index: "01",
    tech: ["FastAPI", "Next.js", "Pandas", "Gemini", "Playwright", "TypeScript"],
    liveUrl: "https://aura-skayy47s-projects.vercel.app",
    codeUrl: "https://github.com/skayy47/AURA",
    poster: "/cinematics/aura.png",
    video: "/cinematics/aura.mp4",
    accent: 1,
    demo: "aura",
  },
  {
    id: "nexus",
    index: "02",
    tech: ["FastAPI", "Next.js", "LangChain", "pgvector", "Groq", "Supabase"],
    liveUrl: "https://nexussss-two.vercel.app",
    codeUrl: "https://github.com/skayy47/nexus",
    poster: "/cinematics/nexus.png",
    video: null,
    accent: 3,
    demo: "nexus",
  },
  {
    id: "maestro",
    index: "03",
    tech: ["Next.js", "TypeScript", "Groq", "Tavily", "Framer Motion", "Vitest"],
    liveUrl: "https://maestro-lac-theta.vercel.app",
    codeUrl: "https://github.com/skayy47/maestro",
    poster: "/cinematics/maestro.png",
    video: null,
    accent: 2,
    demo: "maestro",
  },
];

export interface JourneyStep {
  year: string;
  title: string;
  place: string;
  note: string;
  kind: "edu" | "pivot" | "now";
}

export interface SiteContent {
  ui: {
    openLive: string;
    source: string;
    live: string;
    liveDemo: string;
    palette: string;
    langName: string;
  };
  nav: { work: string; approach: string; journey: string; stack: string; contact: string; talk: string };
  hero: {
    roles: string[];
    title: { pre1: string; grad1: string; pre2: string; grad2: string };
    lines: string[];
    cta1: string;
    cta2: string;
    location: string;
  };
  approach: {
    eyebrow: string;
    title: { pre: string; grad: string };
    lead: string;
    pillars: { k: string; title: string; body: string }[];
    arcLabel: string;
    arc: string;
  };
  journey: { eyebrow: string; title: { pre: string; grad: string }; lead: string; steps: JourneyStep[] };
  work: { eyebrow: string; title: { pre: string; grad: string }; lead: string };
  projects: Record<ProjectId, { kicker: string; tagline: string; description: string; signature: string[]; metrics: string[] }>;
  demos: {
    aura: { tags: string[]; caption: string };
    nexus: {
      uploadLabel: string;
      filename: string;
      analyzingLabel: string;
      oneLiner: string;
      bullets: string[];
      chips: string[];
      chatLabel: string;
      retrieving: string;
      sources: string[];
      answer: string;
      citation: string;
      sceneLabels: string[];
      contQ: string;
      contDocA: string;
      contDocB: string;
      contReplyA: string;
      contReplyB: string;
      contLabel: string;
      contNote: string;
      contValA: string;
      contValB: string;
      gapQ: string;
      gapSearching: string;
      gapLabel: string;
      gapNote: string;
    };
    maestro: { missionLabel: string; mission: string; agentsLabel: string; agents: { name: string; role: string }[]; synth: string };
  };
  stack: { eyebrow: string; title: { pre: string; grad: string }; lead: string; groups: { group: string; items: string[] }[] };
  moreWork: { eyebrow: string; title: { pre: string; grad: string }; lead: string };
  more: { id: string; name: string; kicker: string; blurb: string; metric: string; tech: string[]; liveUrl: string; codeUrl: string }[];
  stats: { value: string; label: string }[];
  contact: { eyebrow: string; title: { pre: string; grad: string }; lead: string; cta: string };
  footer: { quote: string; built: string };
}

const STACK_GROUPS = (g: string[]) => g; // identity, keeps arrays terse

export const CONTENT: Record<Locale, SiteContent> = {
  /* ------------------------------------------------------------------ EN */
  en: {
    ui: { openLive: "Open live", source: "Source", live: "Live", liveDemo: "Live demo", palette: "Palette", langName: "EN" },
    nav: { work: "Work", approach: "Approach", journey: "Journey", stack: "Stack", contact: "Contact", talk: "Let’s talk" },
    hero: {
      roles: ["AI / ML ENGINEER", "BUILDER OF PRODUCTION AI"],
      title: { pre1: "I build ", grad1: "AI systems", pre2: "that survive ", grad2: "production." },
      lines: [
        "I build systems that survive production.",
        "Multi-agent AI — real orchestration, not prompt chains.",
        "RAG engines with memory, grounding, and honesty.",
        "From raw data to real intelligence.",
      ],
      cta1: "View the work",
      cta2: "Get in touch",
      location: "Casablanca → the world",
    },
    approach: {
      eyebrow: "THE PHILOSOPHY",
      title: { pre: "Models hallucinate. ", grad: "Systems shouldn’t." },
      lead: "The model is the easy part.\n\nI build what runs around it — pipelines that handle corrupted input, retrieval that admits uncertainty, agents that replan when they fail. Every system I ship is designed around what happens when things go wrong, because in production, they always do.",
      pillars: [
        { k: "01", title: "Retrieval, any architecture", body: "Naive RAG to hybrid BM25 + dense with reranking. Contextual compression, HyDE, multi-query, self-RAG, RAGAS evaluation. I pick the right retrieval strategy for the constraint — not the default one." },
        { k: "02", title: "Agents, any pattern", body: "ReAct to Plan-and-Execute to multi-agent with typed contracts. Tool use, memory injection, failure recovery, output validation. From single-step chains to autonomous pipelines." },
        { k: "03", title: "Data, any format", body: "PDF, audio, video, tabular, scanned, semi-structured. OCR, chunking strategies, embedding selection, pipeline monitoring. Raw chaos to clean signal." },
      ],
      arcLabel: "the arc",
      arc: "AURA proved I can wrangle any data format. nexus proved I can build production memory systems. MAESTRO proves I can architect multi-agent AI at depth.",
    },
    journey: {
      eyebrow: "The journey",
      title: { pre: "A path forged ", grad: "through the detour." },
      lead: "Physics, then medicine in a war zone, then a hard pivot into computer science. Each detour added a layer the straight path never could.",
      steps: [
        { year: "2020", title: "Baccalauréat — Physical Sciences", place: "Boujaad, Morocco", note: "Foundation in physics and mathematics.", kind: "edu" },
        { year: "2021", title: "Russian language year", place: "Ukraine", note: "Preparatory year abroad — a new language, a new continent.", kind: "edu" },
        { year: "2021 – 2022", title: "General Medicine (English)", place: "Ukraine", note: "Studied medicine — interrupted and ended by the war.", kind: "pivot" },
        { year: "2022", title: "Return to Morocco — the pivot", place: "Casablanca", note: "Left medicine behind and chose technology. The real start.", kind: "pivot" },
        { year: "2022 – 2025", title: "Licence — Computer Science", place: "Mundiapolis · Cloud Computing & Security", note: "Bachelor’s in CS, specialising in cloud computing and security.", kind: "edu" },
        { year: "2026", title: "Engineering — 4th year", place: "ISGA, Casablanca", note: "Just completed the 4th year of the engineering cycle.", kind: "edu" },
        { year: "2027", title: "Ingénieur d’État — AI & Big Data", place: "Graduating", note: "State engineering degree in Artificial Intelligence & Big Data.", kind: "now" },
      ],
    },
    work: {
      eyebrow: "Selected work",
      title: { pre: "Three production systems. ", grad: "Live, tested, documented." },
      lead: "Each one is deployed and clickable. The visual in every card is a live, working illustration — and one click opens the real app.",
    },
    projects: {
      aura: {
        kicker: "Universal Data Engine",
        tagline: "Ingest any file → clean → explore → AI chat → branded report. Five minutes, not five hours.",
        description:
          "A full-stack data intelligence platform. Drop any CSV, XLSX, JSON or Parquet and AURA infers what each column actually is — identifier, measure, dimension, temporal — runs an 8-step cleaning pipeline, builds an archetype-aware explore, answers grounded questions in EN/FR, and exports a branded PDF report.",
        signature: [
          "Semantic column-role inference — knows an identifier from a measure",
          "Multi-provider AI cascade — Gemini → Groq → OpenAI → Claude, silent auto-fallback",
          "Grounded AI chat — pre-computed findings injected as AUTHORITATIVE, exact numbers cited",
          "Smart deduplication — identifier columns excluded so near-duplicates are actually caught",
          "Branded PDF via Playwright + Jinja2 with server-side SVG charts",
          "Bilingual EN/FR with SSE streaming end-to-end",
        ],
        metrics: ["55/55 tests", "EN / FR", "Live"],
      },
      nexus: {
        kicker: "Production RAG Engine",
        tagline: "Upload any of 15 formats — instant AI summary, then grounded answers with claim-level source verification.",
        description:
          "A production-grade Retrieval-Augmented Generation system supporting 15 document formats — PDF, DOCX, XLSX, PPTX, CSV, and more. On upload, an AI auto-summary fires instantly: a one-liner, 4 insight bullets, and 3 clickable question chips that fire directly into chat. Hybrid BM25 + pgvector retrieval with RRF reranking, claim-level answer grounding, contradiction detection and confidence gating — every fact is traceable to a source, and low-confidence answers refuse instead of hallucinating.",
        signature: [
          "Hybrid retrieval — BM25 + semantic + RRF reranking",
          "Answer grounding — claim-level source verification",
          "Contradiction radar + confidence gating (dual-gate refusal)",
          "Citation injection — every fact traceable to its document",
          "Auto-summary on upload — one-liner, 4 bullets, 3 clickable question chips",
          "15 document formats — PDF, DOCX, XLSX, PPTX, CSV, JSON and more",
        ],
        metrics: ["145 tests", "15 formats", "Live"],
      },
      maestro: {
        kicker: "Multi-Agent Command Center",
        tagline: "A mission in, a verifiable deliverable out — orchestrated live.",
        description:
          "A living neural orchestra. An LLM orchestrator reads a mission, plans a DAG of specialist agents — Research, Data, Automation — runs them as a live SSE pipeline streaming every step, and synthesizes one verifiable deliverable: sourced market briefs, real CSV statistics, importable n8n workflow JSON.",
        signature: [
          "LLM-planned multi-agent DAG — agent selection + execution order",
          "Live SSE pipeline — streams every agent’s thinking in real time",
          "Real Tavily search — URLs injected from the API, never invented",
          "Deterministic n8n compiler — valid importable workflows, not LLM JSON",
          "Model fallback chain + warmed showcase replay for reliability",
        ],
        metrics: ["48/48 tests", "SSE", "Live"],
      },
    },
    demos: {
      aura: { tags: ["Ingest any file", "Clean · 8 steps", "Explore", "Grounded AI"], caption: "any file → insight" },
      nexus: {
        uploadLabel: "Document uploaded",
        filename: "annual-report.pdf",
        analyzingLabel: "Analyzing · Groq 70B",
        oneLiner: "FY2024: revenue up 18%, EBITDA margin at 24%.",
        bullets: [
          "Q4 revenue $4.2M — record quarter",
          "3 new enterprise contracts signed",
          "Headcount grew 42 → 61",
        ],
        chips: ["What drove Q4 revenue?", "Headcount breakdown?", "Key risks?"],
        chatLabel: "nexus · chat",
        retrieving: "Retrieving · hybrid BM25 + vector",
        sources: ["annual-report.pdf §Revenue", "annual-report.pdf §Q4"],
        answer: "Q4 revenue reached $4.2M, driven by three new enterprise contracts signed in October–November. Expansion within existing accounts added a further 8% on top.",
        citation: "annual-report.pdf p.14 ¶2",
        sceneLabels: ["Auto-Summary", "Source Attribution", "Contradiction Radar", "Knowledge Gaps"],
        contQ: "What's the remote-work policy? How many days per week?",
        contDocA: "TechCorp_HR_Policy_2023.pdf",
        contDocB: "TechCorp_HR_Policy_2024.pdf",
        contReplyA: "The 2024 policy allows up to 2 days/week [TechCorp_HR_Policy_2024 · p.1].",
        contReplyB: "The 2023 policy allowed up to 3 days/week [TechCorp_HR_Policy_2023 · p.1].",
        contLabel: "Contradiction detected · medium severity",
        contNote: "These two policies diverge on the remote-work limit. The 2024 version seems more recent and could supersede the 2023 policy.",
        contValA: "up to 3 days / week",
        contValB: "up to 2 days / week",
        gapQ: "What was the Q1 2025 revenue?",
        gapSearching: "Searching corpus · 0 results",
        gapLabel: "Knowledge gap detected",
        gapNote: "No document in your corpus covers Q1 2025 financial data.",
      },
      maestro: {
        missionLabel: "Mission",
        mission: "Scan the EV market and draft an outreach plan.",
        agentsLabel: "Orchestrating agents",
        agents: [
          { name: "Research", role: "Tavily · 8 sources" },
          { name: "Data", role: "CSV · live stats" },
          { name: "Automation", role: "n8n · workflow" },
        ],
        synth: "Executive brief ready",
      },
    },
    stack: {
      eyebrow: "The stack",
      title: { pre: "The tools that ", grad: "ship real systems." },
      lead: "From the AI layer down to cloud, MLOps and data engineering — the stack hiring teams actually look for.",
      groups: [
        { group: "Languages", items: STACK_GROUPS(["Python", "TypeScript", "SQL", "JavaScript", "Bash"]) },
        { group: "AI · LLMs · Agents", items: STACK_GROUPS(["Groq", "Gemini", "Claude API", "OpenAI API", "LangChain", "LlamaIndex", "RAG", "Multi-Agent", "Hugging Face"]) },
        { group: "ML · Data Science", items: STACK_GROUPS(["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "XGBoost", "LightGBM", "SHAP"]) },
        { group: "MLOps · Pipelines", items: STACK_GROUPS(["MLflow", "Airflow", "Weights & Biases", "DVC", "Docker", "Kubernetes"]) },
        { group: "Cloud · DevOps", items: STACK_GROUPS(["AWS", "GCP", "Azure", "Terraform", "GitHub Actions", "Vercel"]) },
        { group: "Data · Vectors", items: STACK_GROUPS(["PostgreSQL", "Spark", "Kafka", "Supabase", "pgvector", "Pinecone", "Redis", "MongoDB"]) },
        { group: "Backend · Frontend", items: STACK_GROUPS(["FastAPI", "Node.js", "Next.js", "React", "Tailwind"]) },
        { group: "Design · UI/UX", items: STACK_GROUPS(["Figma", "UI / UX", "Design Systems", "Framer", "Wireframing", "Accessibility", "Responsive"]) },
      ],
    },
    moreWork: {
      eyebrow: "More projects",
      title: { pre: "Beyond the flagships — ", grad: "data, ML, BI." },
      lead: "Support projects that round out the picture: time-series forecasting, risk modelling and business intelligence.",
    },
    more: [
      {
        id: "walmart",
        name: "Walmart Sales Forecasting",
        kicker: "Time-Series BI + ML",
        blurb:
          "End-to-end weekly-sales forecasting across 45 stores — Prophet, XGBoost and SARIMAX, Optuna-tuned with TimeSeriesSplit CV, a Power BI dashboard and a 5-page Streamlit app.",
        metric: "2.17% MAPE · Prophet",
        tech: ["Prophet", "XGBoost", "Optuna", "Power BI", "Streamlit"],
        liveUrl: "https://walmart-sales-forecasting-skay.streamlit.app",
        codeUrl: "https://github.com/skayy47/walmart-sales-forecasting",
      },
      {
        id: "credit",
        name: "Credit Risk Prediction",
        kicker: "Production ML + Basel III",
        blurb:
          "Default-risk scoring on 307K applicants — LightGBM, SHAP explainability, ROC curve, Gini coefficient, KS statistic, and an interactive threshold simulator. Config-driven CLI pipeline with 8 pytest tests. Not a notebook: a regulatory-grade scoring engine.",
        metric: "0.759 AUC · Gini 0.519 · KS 0.578",
        tech: ["LightGBM", "SHAP", "scikit-learn", "Streamlit", "Plotly"],
        liveUrl: "https://credit-risk-prediction-skay.streamlit.app",
        codeUrl: "https://github.com/skayy47/credit-risk-prediction",
      },
    ],
    stats: [
      { value: "3", label: "production systems, live" },
      { value: "48/48", label: "MAESTRO tests green" },
      { value: "4", label: "provider AI cascade" },
      { value: "EN · FR", label: "bilingual by default" },
    ],
    contact: {
      eyebrow: "Contact",
      title: { pre: "Let’s build something\n", grad: "that actually ships." },
      lead: "Open to AI / ML engineering roles and ambitious collaborations. Based in Casablanca, working globally.",
      cta: "Get in touch",
    },
    footer: { quote: "“Every artifact is verifiable. Every system ships.”", built: "Built with Next.js · React Three Fiber · GSAP" },
  },

  /* ------------------------------------------------------------------ FR */
  fr: {
    ui: { openLive: "Voir en ligne", source: "Code", live: "En ligne", liveDemo: "Démo live", palette: "Palette", langName: "FR" },
    nav: { work: "Projets", approach: "Approche", journey: "Parcours", stack: "Stack", contact: "Contact", talk: "Discutons" },
    hero: {
      roles: ["INGÉNIEUR IA / ML", "BÂTISSEUR D’IA EN PRODUCTION"],
      title: { pre1: "Je conçois des ", grad1: "systèmes d’IA", pre2: "taillés pour la ", grad2: "production." },
      lines: [
        "Je construis des systèmes qui tiennent en production.",
        "IA multi-agents — de la vraie orchestration, pas des chaînes de prompts.",
        "Des moteurs RAG avec mémoire, ancrage et honnêteté.",
        "De la donnée brute à l’intelligence réelle.",
      ],
      cta1: "Voir les projets",
      cta2: "Me contacter",
      location: "Casablanca → le monde",
    },
    approach: {
      eyebrow: "LA PHILOSOPHIE",
      title: { pre: "Les modèles hallucinent. ", grad: "Les systèmes, non." },
      lead: "Le modèle est la partie facile.\n\nJe construis ce qui l’entoure — des pipelines qui gèrent les données corrompues, une récupération qui reconnaît l’incertitude, des agents qui replanifient quand ils échouent. Chaque système que je livre est conçu pour gérer ce qui se passe mal, parce qu’en production, ça arrive toujours.",
      pillars: [
        { k: "01", title: "Récupération, toute architecture", body: "RAG naïf à BM25 + dense hybride avec reranking. Compression contextuelle, HyDE, multi-requête, self-RAG, évaluation RAGAS. Je choisis la bonne stratégie de récupération pour la contrainte — pas celle par défaut." },
        { k: "02", title: "Agents, tout pattern", body: "ReAct à Plan-and-Execute à multi-agent avec contrats typés. Utilisation d’outils, injection mémoire, récupération après défaut, validation de sortie. Des chaînes pas-à-pas aux pipelines autonomes." },
        { k: "03", title: "Données, tout format", body: "PDF, audio, vidéo, tabulaire, scanné, semi-structuré. OCR, stratégies de chunking, sélection d’embeddings, monitoring des pipelines. Du chaos brut au signal propre." },
      ],
      arcLabel: "la trajectoire",
      arc: "AURA a prouvé que je maîtrise n’importe quel format de données. nexus a prouvé que je sais bâtir des systèmes de mémoire en production. MAESTRO prouve que j’architecture de l’IA multi-agents en profondeur.",
    },
    journey: {
      eyebrow: "Le parcours",
      title: { pre: "Une trajectoire forgée ", grad: "par le détour." },
      lead: "La physique, puis la médecine en zone de guerre, puis un virage net vers l’informatique. Chaque détour a ajouté une couche que la ligne droite n’aurait jamais offerte.",
      steps: [
        { year: "2020", title: "Baccalauréat — Sciences Physiques", place: "Boujaad, Maroc", note: "Bases en physique et mathématiques.", kind: "edu" },
        { year: "2021", title: "Année de langue russe", place: "Ukraine", note: "Année préparatoire à l’étranger — une nouvelle langue, un nouveau continent.", kind: "edu" },
        { year: "2021 – 2022", title: "Médecine générale (anglais)", place: "Ukraine", note: "Études de médecine — interrompues et stoppées par la guerre.", kind: "pivot" },
        { year: "2022", title: "Retour au Maroc — le virage", place: "Casablanca", note: "J’ai quitté la médecine pour la technologie. Le vrai départ.", kind: "pivot" },
        { year: "2022 – 2025", title: "Licence — Informatique", place: "Mundiapolis · Cloud Computing & Sécurité", note: "Licence en informatique, option cloud computing et sécurité.", kind: "edu" },
        { year: "2026", title: "Cycle ingénieur — 4ᵉ année", place: "ISGA, Casablanca", note: "Je viens de terminer la 4ᵉ année du cycle ingénieur.", kind: "edu" },
        { year: "2027", title: "Ingénieur d’État — IA & Big Data", place: "Diplomation", note: "Diplôme d’ingénieur d’État en Intelligence Artificielle & Big Data.", kind: "now" },
      ],
    },
    work: {
      eyebrow: "Projets choisis",
      title: { pre: "Trois systèmes en production. ", grad: "En ligne, testés, documentés." },
      lead: "Chacun est déployé et cliquable. Le visuel de chaque carte est une illustration vivante et fonctionnelle — et un clic ouvre la vraie application.",
    },
    projects: {
      aura: {
        kicker: "Moteur de Données Universel",
        tagline: "Importez n’importe quel fichier → nettoyage → exploration → chat IA → rapport de marque. Cinq minutes, pas cinq heures.",
        description:
          "Une plateforme d’intelligence des données full-stack. Déposez un CSV, XLSX, JSON ou Parquet et AURA déduit ce qu’est réellement chaque colonne — identifiant, mesure, dimension, temporel — exécute un pipeline de nettoyage en 8 étapes, construit une exploration adaptée, répond à des questions ancrées en EN/FR et exporte un rapport PDF de marque.",
        signature: [
          "Inférence sémantique des rôles de colonnes — distingue un identifiant d’une mesure",
          "Cascade IA multi-fournisseurs — Gemini → Groq → OpenAI → Claude, bascule silencieuse",
          "Chat IA ancré — résultats pré-calculés injectés comme AUTORITÉ, chiffres exacts cités",
          "Déduplication intelligente — colonnes identifiants exclues pour détecter les vrais doublons",
          "PDF de marque via Playwright + Jinja2 avec graphiques SVG côté serveur",
          "Bilingue EN/FR avec streaming SSE de bout en bout",
        ],
        metrics: ["55/55 tests", "EN / FR", "En ligne"],
      },
      nexus: {
        kicker: "Moteur RAG de Production",
        tagline: "Importez l’un des 15 formats — résumé IA instantané, puis réponses ancrées avec vérification source par affirmation.",
        description:
          "Un système de génération augmentée par récupération de niveau production, supportant 15 formats de documents — PDF, DOCX, XLSX, PPTX, CSV et plus. À l’import, un résumé IA se génère instantanément : une phrase clé, 4 bullets d’analyse et 3 puces de questions cliquables qui s’envoient directement dans le chat. Récupération hybride BM25 + pgvector avec reranking RRF, ancrage des réponses au niveau de chaque affirmation, détection de contradictions et filtrage par confiance — chaque fait est traçable jusqu’à sa source, et les réponses peu fiables sont écartées plutôt qu’inventées.",
        signature: [
          "Récupération hybride — BM25 + sémantique + reranking RRF",
          "Ancrage des réponses — vérification au niveau de chaque affirmation",
          "Radar de contradictions + filtrage par confiance (double refus)",
          "Injection de citations — chaque fait traçable jusqu’à son document",
          "Résumé auto à l’import — phrase clé, 4 bullets, 3 puces de questions cliquables",
          "15 formats de documents — PDF, DOCX, XLSX, PPTX, CSV, JSON et plus",
        ],
        metrics: ["145 tests", "15 formats", "En ligne"],
      },
      maestro: {
        kicker: "Centre de Commande Multi-Agents",
        tagline: "Une mission en entrée, un livrable vérifiable en sortie — orchestré en direct.",
        description:
          "Un orchestre neuronal vivant. Un orchestrateur LLM lit une mission, planifie un DAG d’agents spécialisés — Recherche, Données, Automatisation — les exécute en pipeline SSE en direct, et synthétise un livrable vérifiable : briefs de marché sourcés, vraies statistiques CSV, workflow n8n importable.",
        signature: [
          "DAG multi-agents planifié par LLM — sélection et ordre d’exécution",
          "Pipeline SSE en direct — diffuse le raisonnement de chaque agent en temps réel",
          "Vraie recherche Tavily — URLs injectées depuis l’API, jamais inventées",
          "Compilateur n8n déterministe — workflows valides et importables, pas du JSON LLM",
          "Chaîne de repli des modèles + relecture préchauffée pour la fiabilité",
        ],
        metrics: ["48/48 tests", "SSE", "En ligne"],
      },
    },
    demos: {
      aura: { tags: ["Tout fichier", "Nettoyage · 8 étapes", "Exploration", "IA ancrée"], caption: "tout fichier → insight" },
      nexus: {
        uploadLabel: "Document importé",
        filename: "rapport-annuel.pdf",
        analyzingLabel: "Analyse · Groq 70B",
        oneLiner: "2024 : CA +18 %, marge EBITDA à 24 %.",
        bullets: [
          "T4 : 4,2 M€ — trimestre record",
          "3 nouveaux contrats entreprise signés",
          "Effectif passé de 42 à 61",
        ],
        chips: ["Moteurs du T4 ?", "Répartition effectif ?", "Risques clés ?"],
        chatLabel: "nexus · chat",
        retrieving: "Récupération · BM25 + vectoriel",
        sources: ["rapport-annuel.pdf §CA", "rapport-annuel.pdf §T4"],
        answer: "Le T4 atteint 4,2 M€, porté par trois nouveaux contrats entreprise signés en octobre–novembre. L'expansion sur les comptes existants a contribué 8 % supplémentaires.",
        citation: "rapport-annuel.pdf p.14 ¶2",
        sceneLabels: ["Résumé automatique", "Attribution sources", "Radar contradictions", "Lacunes"],
        contQ: "Quelle est la politique de télétravail ? Combien de jours par semaine ?",
        contDocA: "TechCorp_HR_Policy_2023.pdf",
        contDocB: "TechCorp_HR_Policy_2024.pdf",
        contReplyA: "La politique 2024 autorise jusqu'à 2 jours/semaine [TechCorp_HR_Policy_2024 · p.1].",
        contReplyB: "La version 2023 autorisait jusqu'à 3 jours/semaine [TechCorp_HR_Policy_2023 · p.1].",
        contLabel: "Contradiction détectée · gravité moyenne",
        contNote: "Ces deux politiques divergent sur la limite de télétravail. La version 2024 semble plus récente et pourrait remplacer la politique 2023.",
        contValA: "jusqu'à 3 jours / semaine",
        contValB: "jusqu'à 2 jours / semaine",
        gapQ: "Quel était le CA du T1 2025 ?",
        gapSearching: "Recherche dans le corpus · 0 résultat",
        gapLabel: "Lacune de connaissances",
        gapNote: "Aucun document de votre corpus ne couvre le T1 2025.",
      },
      maestro: {
        missionLabel: "Mission",
        mission: "Analyse le marché des VE et rédige un plan d’approche.",
        agentsLabel: "Agents orchestrés",
        agents: [
          { name: "Recherche", role: "Tavily · 8 sources" },
          { name: "Données", role: "CSV · stats live" },
          { name: "Automatisation", role: "n8n · workflow" },
        ],
        synth: "Brief exécutif prêt",
      },
    },
    stack: {
      eyebrow: "La stack",
      title: { pre: "Les outils qui ", grad: "livrent de vrais systèmes." },
      lead: "De la couche IA jusqu’au cloud, au MLOps et au data engineering — la stack que les recruteurs recherchent vraiment.",
      groups: [
        { group: "Langages", items: STACK_GROUPS(["Python", "TypeScript", "SQL", "JavaScript", "Bash"]) },
        { group: "IA · LLMs · Agents", items: STACK_GROUPS(["Groq", "Gemini", "Claude API", "OpenAI API", "LangChain", "LlamaIndex", "RAG", "Multi-Agent", "Hugging Face"]) },
        { group: "ML · Data Science", items: STACK_GROUPS(["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "XGBoost", "LightGBM", "SHAP"]) },
        { group: "MLOps · Pipelines", items: STACK_GROUPS(["MLflow", "Airflow", "Weights & Biases", "DVC", "Docker", "Kubernetes"]) },
        { group: "Cloud · DevOps", items: STACK_GROUPS(["AWS", "GCP", "Azure", "Terraform", "GitHub Actions", "Vercel"]) },
        { group: "Data · Vecteurs", items: STACK_GROUPS(["PostgreSQL", "Spark", "Kafka", "Supabase", "pgvector", "Pinecone", "Redis", "MongoDB"]) },
        { group: "Backend · Frontend", items: STACK_GROUPS(["FastAPI", "Node.js", "Next.js", "React", "Tailwind"]) },
        { group: "Design · UI/UX", items: STACK_GROUPS(["Figma", "UI / UX", "Design Systems", "Framer", "Maquettage", "Accessibilité", "Responsive"]) },
      ],
    },
    moreWork: {
      eyebrow: "Plus de projets",
      title: { pre: "Au-delà des projets phares — ", grad: "data, ML, BI." },
      lead: "Des projets qui complètent le tableau : prévision de séries temporelles, modélisation du risque et business intelligence.",
    },
    more: [
      {
        id: "walmart",
        name: "Prévision des ventes Walmart",
        kicker: "BI séries temporelles + ML",
        blurb:
          "Prévision hebdomadaire des ventes sur 45 magasins — Prophet, XGBoost et SARIMAX, optimisés avec Optuna (CV TimeSeriesSplit), un tableau de bord Power BI et une app Streamlit de 5 pages.",
        metric: "2,17 % MAPE · Prophet",
        tech: ["Prophet", "XGBoost", "Optuna", "Power BI", "Streamlit"],
        liveUrl: "https://walmart-sales-forecasting-skay.streamlit.app",
        codeUrl: "https://github.com/skayy47/walmart-sales-forecasting",
      },
      {
        id: "credit",
        name: "Prédiction du risque de crédit",
        kicker: "ML de production + Bâle III",
        blurb:
          "Scoring du risque de défaut sur 307K demandes — LightGBM, SHAP, courbe ROC, coefficient de Gini, statistique KS et simulateur de seuil interactif. Pipeline CLI config-driven avec 8 tests pytest. Pas un notebook : un moteur de scoring réglementaire déployé.",
        metric: "0,759 AUC · Gini 0,519 · KS 0,578",
        tech: ["LightGBM", "SHAP", "scikit-learn", "Streamlit", "Plotly"],
        liveUrl: "https://credit-risk-prediction-skay.streamlit.app",
        codeUrl: "https://github.com/skayy47/credit-risk-prediction",
      },
    ],
    stats: [
      { value: "3", label: "systèmes en production" },
      { value: "48/48", label: "tests MAESTRO au vert" },
      { value: "4", label: "fournisseurs IA en cascade" },
      { value: "EN · FR", label: "bilingue par défaut" },
    ],
    contact: {
      eyebrow: "Contact",
      title: { pre: "Construisons quelque chose\n", grad: "qui livre vraiment." },
      lead: "Ouvert aux postes d’ingénierie IA / ML et aux collaborations ambitieuses. Basé à Casablanca, je travaille à l’international.",
      cta: "Me contacter",
    },
    footer: { quote: "« Chaque artefact est vérifiable. Chaque système se déploie. »", built: "Conçu avec Next.js · React Three Fiber · GSAP" },
  },
};

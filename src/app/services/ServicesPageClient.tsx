"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────── palette (SKAY services — vermilion/teal) ───────────────────────────
   Semantic mapping: vermilion/crimson = hallucination heat · teal/mint = grounded trust.
   78161E crimson · EF3E18 vermilion · 94EEE3 mint · 33C6BA teal · 2E5C58 deep teal        */
const C = {
  bg: "#060F0D",
  surface: "#0A1917",
  card: "#0D211E",
  border: "rgba(51,198,186,0.14)",
  borderSoft: "rgba(46,92,88,0.4)",
  teal: "#33C6BA",
  mint: "#94EEE3",
  tealDim: "rgba(51,198,186,0.10)",
  deepTeal: "#2E5C58",
  hot: "#EF3E18",
  hotSoft: "#FF7A55",
  hotDim: "rgba(239,62,24,0.09)",
  crimson: "#78161E",
  crimsonDim: "rgba(120,22,30,0.30)",
  textPrimary: "#EDF7F5",
  textSec: "#9CB8B2",
  textMuted: "#5E7A75",
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const EMAIL = "oussamaiskia@gmail.com";
const MAILTO =
  "mailto:oussamaiskia@gmail.com?subject=Teardown%20request%20%E2%80%94%20services%20page&body=Hi%20Oussama%2C%20I%27d%20like%20to%20book%20a%20free%20teardown%20for%20my%20firm.";

/* ─────────────────────────── hooks ─────────────────────────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

function useInView(threshold = 0.15) {
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

/* ─────────────────────────── ambient living background ─────────────────────────── */
function Ambient() {
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (glowRef.current)
        glowRef.current.style.transform = `translate3d(${e.clientX - 320}px, ${e.clientY - 320}px, 0)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div className="blobA" />
      <div className="blobB" />
      <div className="blobC" />
      <div
        ref={glowRef}
        style={{
          position: "absolute", top: 0, left: 0, width: 640, height: 640, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(51,198,186,0.055), transparent 62%)",
          transform: "translate3d(-999px,-999px,0)", willChange: "transform",
        }}
      />
      <div className="noiseLayer" />
    </div>
  );
}

/* ─────────────────────────── scroll progress ─────────────────────────── */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 120,
        transformOrigin: "0 50%", transform: "scaleX(0)",
        background: `linear-gradient(90deg, ${C.teal}, ${C.mint})`,
      }}
    />
  );
}

/* ─────────────────────────── magnetic wrapper (cursor-reactive) ─────────────────────────── */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`;
    };
    const leave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [reduced]);
  return (
    <div ref={ref} style={{ display: "inline-block", transition: `transform 0.4s ${EASE}`, willChange: "transform" }}>
      {children}
    </div>
  );
}

/* ─────────────────────────── word-by-word cinematic headline ─────────────────────────── */
function Words({ text, gradient = false, base = 0 }: { text: string; gradient?: boolean; base?: number }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="wordWrap">
          <span
            className={`wordRise${gradient ? " gradText" : ""}`}
            style={{ animationDelay: `${base + i * 65}ms` }}
          >
            {w}&nbsp;
          </span>
        </span>
      ))}
    </>
  );
}

/* ─────────────────────────── inline SVG icons ─────────────────────────── */
type IconProps = { size?: number; color?: string };
const Search = ({ size = 18, color = C.teal }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
const FileText = ({ size = 18, color = C.teal }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h6" /></svg>
);
const Shield = ({ size = 18, color = C.mint }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
);
const Clock = ({ size = 18, color = C.teal }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const Check = ({ size = 16, color = C.teal }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);
const XMark = ({ size = 16, color = C.hotSoft }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
const Alert = ({ size = 18, color = C.hotSoft }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
);

/* ─────────────────────────── bilingual copy ─────────────────────────── */
type Locale = "en" | "fr";
const COPY = {
  en: {
    nav: { back: "← SKAY", cta: "Book a teardown" },
    hero: {
      badge: "PRODUCTION AI FOR ACCOUNTING & TAX FIRMS",
      h1a: "Your firm's answers are buried in",
      h1b: "your own files.",
      h1c: "Stop digging.",
      sub: "I build production AI assistants that answer from your firm's documents — accurately, with sources, and without hallucinations.",
      ctaPrimary: "Book a free teardown",
      ctaSecondary: "See it work ↓",
      brand: "Models hallucinate. Systems shouldn't.",
    },
    pain: {
      eyebrow: "THE PROBLEM",
      title: "QuickBooks automates the numbers. Nobody automates the knowledge.",
      lead: "Your team re-answers the same questions, digs through client files and prior-year workpapers, and onboards juniors by hand — while the answers already exist, buried in your own documents.",
      items: [
        { icon: <Search />, t: "Digging, not billing", b: "Staff lose hours hunting through folders for an answer that's already in a file." },
        { icon: <FileText />, t: "Same questions, again", b: "The same client and policy questions get re-answered from scratch, week after week." },
        { icon: <Clock />, t: "Knowledge walks out", b: "When a senior leaves, years of undocumented know-how leaves with them." },
      ],
    },
    demo: {
      eyebrow: "SEE IT WORK",
      title: "Ask your documents. Watch it refuse to lie.",
      lead: "Every answer is traceable to a source. When your files don't cover something, it says so — instead of inventing a number your team would have to catch.",
      disclaimer: "Illustrative example with sample data — not a real client's files.",
      q1: "What's the depreciation rate for office equipment?",
      a1: "20% straight-line, per your firm's fixed-asset policy.",
      cite1: "ClientTaxFile_2024.pdf · p.7",
      q2: "What was the Q1 2025 filing total for Meridian LLC?",
      gapLabel: "No answer — knowledge gap declared",
      gapNote: "No document in the provided files covers Q1 2025. It refuses instead of guessing.",
      contraEyebrow: "CONTRADICTION RADAR",
      contraTitle: "When two documents disagree, it says so.",
      contraQ: "What's the mileage reimbursement rate?",
      docA: "TravelPolicy_2023.pdf · p.3",
      docAval: "0.30 €/km",
      docAtext: "Mileage is reimbursed at 0.30 €/km.",
      docB: "TravelPolicy_2024.pdf · p.3",
      docBval: "0.26 €/km",
      docBtext: "The updated rate is 0.26 €/km, effective January 2024.",
      contraBanner: "CONTRADICTION DETECTED · medium severity",
      contraNote: "The 2023 and 2024 travel policies diverge on the mileage rate. Both are surfaced — it will not silently pick one.",
      splitEyebrow: "WHY IT MATTERS",
      splitTitle: "The difference between a demo and a system.",
      genericLabel: "Generic AI chatbot",
      genericAnswer: "The mileage rate is around 0.25 €/km.",
      genericNote: "Invented. No source. Wrong.",
      groundedLabel: "Your assistant",
      groundedAnswer: "0.26 €/km",
      groundedCite: "TravelPolicy_2024.pdf · p.3",
      groundedNote: "Grounded. Cited. Verifiable.",
    },
    offer: {
      eyebrow: "THE OFFER",
      title: "Production Knowledge Assistant",
      lead: "A custom AI assistant trained on your firm's documents — built, grounded, and deployed for you.",
      stack: [
        "Answers from your own client files, workpapers & policies",
        "Every answer cited to its source document & page",
        "Refuses when your files don't cover it — no hallucinations",
        "Contradiction detection across document versions",
        "Runs on your infrastructure — your data stays yours",
        "3 weeks to live · fixed price · from design-partner rates",
      ],
      guaranteeLabel: "The guarantee",
      guarantee: "Live and working on your documents — or you don't pay the final milestone.",
    },
    how: {
      eyebrow: "HOW IT WORKS",
      title: "Three steps. Three weeks.",
      steps: [
        { n: "01", t: "You hand over the documents", b: "Client files, workpapers, policies — in any of 15 formats. No preprocessing on your side." },
        { n: "02", t: "I build & ground the system", b: "Custom retrieval tuned to your firm, with citation grounding and refusal built in. Production-grade, not a demo." },
        { n: "03", t: "Your team just asks", b: "Instant, source-cited answers from your own knowledge. Onboarding, lookups, and the same-question grind — gone." },
      ],
    },
    proof: {
      eyebrow: "PROOF, NOT PROMISES",
      title: "I don't ship demos that die in production.",
      lead: "Three live, tested systems behind this. Click any of them — they're real and running.",
      systems: [
        { name: "NEXUS", kind: "Production RAG engine", metric: "152 tests · 15 formats", url: "https://nexussss-two.vercel.app" },
        { name: "AURA", kind: "Data intelligence platform", metric: "55/55 tests · EN/FR", url: "https://aura-sooty-five-27.vercel.app" },
        { name: "MAESTRO", kind: "Multi-agent command center", metric: "48/48 tests · live SSE", url: "https://maestro-lac-theta.vercel.app" },
      ],
    },
    story: {
      eyebrow: "WHO BUILDS IT",
      title: "Why I build for production.",
      body: "Physics, then medicine in a war zone, then a hard pivot into AI. I build systems that survive real workloads — because I've had to rebuild everything once already. That's why my systems admit what they don't know instead of guessing.",
      brand: "Models hallucinate. Systems shouldn't.",
    },
    faq: {
      eyebrow: "BEFORE YOU ASK",
      title: "The questions accounting firms actually ask.",
      items: [
        { q: "Is our client data safe?", a: "Yes. The assistant runs on your infrastructure and your documents never train a public model. Your data stays yours." },
        { q: "What if it gives a wrong answer?", a: "Every answer is cited to its source document and page, so your team verifies in one click. When confidence is low, it refuses instead of guessing." },
        { q: "What does it cost?", a: "A fixed-price pilot from design-partner rates — no hourly surprises. You know the number before we start." },
        { q: "How long until it's live?", a: "Three weeks from documents to a working, grounded assistant." },
        { q: "Do we need to prepare the files?", a: "No. It ingests 15 formats as-is — scanned, structured, or messy. You hand them over, I handle the rest." },
      ],
    },
    finalCta: {
      eyebrow: "NEXT STEP",
      title: "Book a free 20-minute teardown.",
      lead: "I'll look at how your firm handles documents today and show you exactly where an AI assistant fits — no pitch, no obligation. I'm taking on a limited number of design-partner firms right now.",
      cta: "Book my teardown",
      note: "Free · 20 minutes · no obligation",
    },
    email: { prefix: "No email app opening? Write to me directly —", copied: "Copied to clipboard ✓" },
    footer: "Built by SKAY · Production AI that survives real workloads",
  },
  fr: {
    nav: { back: "← SKAY", cta: "Réserver un diagnostic" },
    hero: {
      badge: "IA DE PRODUCTION POUR CABINETS COMPTABLES & FISCAUX",
      h1a: "Les réponses de votre cabinet sont enfouies dans",
      h1b: "vos propres dossiers.",
      h1c: "Arrêtez de creuser.",
      sub: "Je conçois des assistants IA de production qui répondent à partir des documents de votre cabinet — avec précision, sources à l'appui, sans hallucination.",
      ctaPrimary: "Réserver un diagnostic gratuit",
      ctaSecondary: "Voir en action ↓",
      brand: "Les modèles hallucinent. Les systèmes, non.",
    },
    pain: {
      eyebrow: "LE PROBLÈME",
      title: "QuickBooks automatise les chiffres. Personne n'automatise le savoir.",
      lead: "Votre équipe répond sans cesse aux mêmes questions, fouille les dossiers clients et les dossiers de travail, forme les juniors à la main — alors que les réponses existent déjà, enfouies dans vos documents.",
      items: [
        { icon: <Search />, t: "Chercher, pas facturer", b: "L'équipe perd des heures à fouiller des dossiers pour une réponse déjà présente dans un fichier." },
        { icon: <FileText />, t: "Les mêmes questions", b: "Les mêmes questions clients et de procédure sont retraitées de zéro, semaine après semaine." },
        { icon: <Clock />, t: "Le savoir s'en va", b: "Quand un senior part, des années de savoir non documenté partent avec lui." },
      ],
    },
    demo: {
      eyebrow: "EN ACTION",
      title: "Interrogez vos documents. Regardez-le refuser de mentir.",
      lead: "Chaque réponse est traçable jusqu'à sa source. Quand vos fichiers ne couvrent pas un sujet, il le dit — au lieu d'inventer un chiffre que votre équipe devrait rattraper.",
      disclaimer: "Exemple illustratif avec des données fictives — pas les dossiers d'un client réel.",
      q1: "Quel est le taux d'amortissement du matériel de bureau ?",
      a1: "20 % linéaire, selon la politique d'immobilisations de votre cabinet.",
      cite1: "DossierFiscalClient_2024.pdf · p.7",
      q2: "Quel était le total de déclaration du T1 2025 pour Meridian SARL ?",
      gapLabel: "Aucune réponse — lacune déclarée",
      gapNote: "Aucun document fourni ne couvre le T1 2025. Il refuse au lieu de deviner.",
      contraEyebrow: "RADAR DE CONTRADICTIONS",
      contraTitle: "Quand deux documents divergent, il le dit.",
      contraQ: "Quel est le taux de remboursement kilométrique ?",
      docA: "PolitiqueVoyage_2023.pdf · p.3",
      docAval: "0,30 €/km",
      docAtext: "Le kilométrage est remboursé à 0,30 €/km.",
      docB: "PolitiqueVoyage_2024.pdf · p.3",
      docBval: "0,26 €/km",
      docBtext: "Le taux mis à jour est de 0,26 €/km, à compter de janvier 2024.",
      contraBanner: "CONTRADICTION DÉTECTÉE · gravité moyenne",
      contraNote: "Les politiques 2023 et 2024 divergent sur le taux kilométrique. Les deux sont présentées — il ne choisit jamais en silence.",
      splitEyebrow: "POURQUOI C'EST DÉCISIF",
      splitTitle: "La différence entre une démo et un système.",
      genericLabel: "Chatbot IA générique",
      genericAnswer: "Le taux kilométrique est d'environ 0,25 €/km.",
      genericNote: "Inventé. Sans source. Faux.",
      groundedLabel: "Votre assistant",
      groundedAnswer: "0,26 €/km",
      groundedCite: "PolitiqueVoyage_2024.pdf · p.3",
      groundedNote: "Ancré. Sourcé. Vérifiable.",
    },
    offer: {
      eyebrow: "L'OFFRE",
      title: "Assistant de Connaissance de Production",
      lead: "Un assistant IA sur mesure, entraîné sur les documents de votre cabinet — conçu, ancré et déployé pour vous.",
      stack: [
        "Répond à partir de vos dossiers clients, dossiers de travail & politiques",
        "Chaque réponse citée jusqu'au document et à la page",
        "Refuse quand vos fichiers ne couvrent pas — sans hallucination",
        "Détection de contradictions entre versions de documents",
        "Fonctionne sur votre infrastructure — vos données restent les vôtres",
        "Opérationnel en 3 semaines · prix fixe · tarif design-partner",
      ],
      guaranteeLabel: "La garantie",
      guarantee: "Opérationnel sur vos documents — ou vous ne payez pas le dernier jalon.",
    },
    how: {
      eyebrow: "COMMENT ÇA MARCHE",
      title: "Trois étapes. Trois semaines.",
      steps: [
        { n: "01", t: "Vous confiez les documents", b: "Dossiers clients, dossiers de travail, politiques — dans l'un des 15 formats. Aucun prétraitement de votre côté." },
        { n: "02", t: "Je construis et j'ancre le système", b: "Récupération sur mesure pour votre cabinet, avec citations et refus intégrés. De production, pas une démo." },
        { n: "03", t: "Votre équipe demande, simplement", b: "Réponses instantanées et sourcées à partir de votre savoir. Onboarding, recherches et questions répétitives — terminés." },
      ],
    },
    proof: {
      eyebrow: "DES PREUVES, PAS DES PROMESSES",
      title: "Je ne livre pas de démos qui meurent en production.",
      lead: "Trois systèmes en ligne et testés derrière tout ça. Cliquez sur l'un d'eux — ils sont réels et fonctionnels.",
      systems: [
        { name: "NEXUS", kind: "Moteur RAG de production", metric: "152 tests · 15 formats", url: "https://nexussss-two.vercel.app" },
        { name: "AURA", kind: "Plateforme d'intelligence data", metric: "55/55 tests · EN/FR", url: "https://aura-sooty-five-27.vercel.app" },
        { name: "MAESTRO", kind: "Centre multi-agents", metric: "48/48 tests · SSE live", url: "https://maestro-lac-theta.vercel.app" },
      ],
    },
    story: {
      eyebrow: "QUI LE CONSTRUIT",
      title: "Pourquoi je construis pour la production.",
      body: "La physique, puis la médecine en zone de guerre, puis un virage net vers l'IA. Je construis des systèmes qui tiennent en conditions réelles — parce que j'ai déjà dû tout reconstruire une fois. C'est pourquoi mes systèmes admettent ce qu'ils ignorent au lieu de deviner.",
      brand: "Les modèles hallucinent. Les systèmes, non.",
    },
    faq: {
      eyebrow: "AVANT DE DEMANDER",
      title: "Les questions que posent vraiment les cabinets.",
      items: [
        { q: "Nos données clients sont-elles protégées ?", a: "Oui. L'assistant fonctionne sur votre infrastructure et vos documents n'entraînent jamais un modèle public. Vos données restent les vôtres." },
        { q: "Et s'il donne une mauvaise réponse ?", a: "Chaque réponse est citée jusqu'au document et à la page — votre équipe vérifie en un clic. En cas de faible confiance, il refuse au lieu de deviner." },
        { q: "Combien ça coûte ?", a: "Un pilote à prix fixe, au tarif design-partner — sans surprise horaire. Vous connaissez le montant avant de commencer." },
        { q: "Quel délai avant la mise en ligne ?", a: "Trois semaines, des documents à un assistant fonctionnel et ancré." },
        { q: "Faut-il préparer les fichiers ?", a: "Non. Il ingère 15 formats tels quels — scannés, structurés ou en désordre. Vous les confiez, je m'occupe du reste." },
      ],
    },
    finalCta: {
      eyebrow: "PROCHAINE ÉTAPE",
      title: "Réservez un diagnostic gratuit de 20 minutes.",
      lead: "J'examine la façon dont votre cabinet gère ses documents aujourd'hui et je vous montre exactement où un assistant IA s'intègre — sans pitch, sans engagement. Je prends actuellement un nombre limité de cabinets partenaires.",
      cta: "Réserver mon diagnostic",
      note: "Gratuit · 20 minutes · sans engagement",
    },
    email: { prefix: "Aucune app mail ne s'ouvre ? Écrivez-moi directement —", copied: "Copié ✓" },
    footer: "Conçu par SKAY · Une IA de production qui tient en conditions réelles",
  },
} as const;

/* ─────────────────────────── shared bits ─────────────────────────── */
function Eyebrow({ children, color = C.teal }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.16em", marginBottom: 12 }}>{children}</div>;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView(0.15);
  const reduced = useReducedMotion();
  const shown = reduced || visible;
  return (
    <div ref={ref} style={{
      transition: reduced ? "none" : `opacity 0.8s ${EASE} ${delay}ms, transform 0.8s ${EASE} ${delay}ms, filter 0.8s ${EASE} ${delay}ms`,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(28px)",
      filter: shown ? "blur(0px)" : "blur(6px)",
    }}>{children}</div>
  );
}

function PrimaryCTA({ label }: { label: string }) {
  return (
    <Magnetic>
      <a href={MAILTO} className="ctaHot" style={{
        display: "inline-flex", alignItems: "center", padding: "14px 30px", borderRadius: 12,
        fontSize: 15, fontWeight: 700, color: "#FFF6F3", textDecoration: "none", minHeight: 44,
      }}>{label}</a>
    </Magnetic>
  );
}

/* mailto silently fails for visitors with no mail app configured (most webmail
   users) — always show the address itself with one-click copy as a safety net. */
function EmailFallback({ prefix, copied }: { prefix: string; copied: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); } catch { /* clipboard blocked — address stays selectable */ }
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <div style={{ fontSize: 13, color: C.textMuted, display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      <span>{prefix}</span>
      <button
        onClick={copy}
        className="ghostBtn"
        aria-label={`Copy ${EMAIL}`}
        style={{ background: "transparent", borderRadius: 8, padding: "6px 12px", fontFamily: "monospace", fontSize: 12.5, fontWeight: 600, color: done ? C.mint : C.textSec, cursor: "pointer", minHeight: 36, display: "inline-flex", alignItems: "center", gap: 7 }}
      >
        {done ? <Check size={13} color={C.mint} /> : null}
        {done ? copied : EMAIL}
      </button>
    </div>
  );
}

const section: React.CSSProperties = { maxWidth: 940, margin: "0 auto", padding: "0 24px 96px" };

/* ─────────────────────────── page ─────────────────────────── */
export default function ServicesPageClient() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = COPY[locale];
  const h1Full = `${t.hero.h1a} ${t.hero.h1b} ${t.hero.h1c}`;

  return (
    <div className="svc-root" style={{ background: C.bg, minHeight: "100dvh", fontFamily: "'Inter','Segoe UI',sans-serif", color: C.textPrimary, position: "relative" }}>
      <ScrollProgress />
      <Ambient />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── nav ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: 60,
          background: "rgba(6,15,13,0.72)", backdropFilter: "blur(18px)",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: C.textSec, textDecoration: "none", letterSpacing: "0.06em" }}>{t.nav.back}</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setLocale(locale === "en" ? "fr" : "en")}
              aria-label="Toggle language"
              className="ghostBtn"
              style={{ padding: "6px 12px", background: "transparent", borderRadius: 10, fontSize: 12, fontWeight: 700, color: C.textSec, cursor: "pointer", minHeight: 44, minWidth: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >{locale === "en" ? "FR" : "EN"}</button>
            <a href={MAILTO} className="ctaHot" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#FFF6F3", textDecoration: "none", minHeight: 44, display: "inline-flex", alignItems: "center" }}>{t.nav.cta}</a>
          </div>
        </nav>

        {/* ── hero ── */}
        <header style={{ maxWidth: 860, margin: "0 auto", padding: "148px 24px 84px", textAlign: "center" }}>
          <div className="heroFade" style={{ animationDelay: "80ms", display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 999, background: C.tealDim, border: `1px solid rgba(51,198,186,0.45)`, marginBottom: 32 }}>
            <span className="pulseDot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.mint, letterSpacing: "0.14em" }}>{t.hero.badge}</span>
          </div>
          <h1 key={locale} aria-label={h1Full} style={{ fontSize: "clamp(34px,6vw,62px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-1.5px", margin: "0 0 24px" }}>
            <span aria-hidden>
              <Words text={t.hero.h1a} base={120} />
              <Words text={t.hero.h1b} gradient base={120 + t.hero.h1a.split(" ").length * 65} />
              <Words text={t.hero.h1c} base={120 + (t.hero.h1a.split(" ").length + t.hero.h1b.split(" ").length) * 65} />
            </span>
          </h1>
          <p className="heroFade" style={{ animationDelay: "620ms", fontSize: 18, color: C.textSec, maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.7 }}>{t.hero.sub}</p>
          <div className="heroFade" style={{ animationDelay: "780ms", display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryCTA label={t.hero.ctaPrimary} />
            <a
              href="#demo"
              className="ghostBtn"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("demo");
                if (!el) return;
                // Lenis owns scrolling site-wide (it re-asserts its own position every
                // frame, so competing native smooth-scroll is unreliable). Route through
                // it — after resize(), since its cached limit can go stale against this
                // page's dynamic layout — and fall back to native only when it's absent.
                const lenis = (window as unknown as {
                  __lenis?: { resize?: () => void; scrollTo: (t: HTMLElement, o?: { offset?: number }) => void };
                }).__lenis;
                if (lenis) {
                  lenis.resize?.();
                  lenis.scrollTo(el, { offset: -76 });
                } else {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              style={{ padding: "14px 26px", background: "transparent", borderRadius: 12, fontSize: 15, fontWeight: 600, color: C.textSec, textDecoration: "none", minHeight: 44, display: "inline-flex", alignItems: "center" }}
            >{t.hero.ctaSecondary}</a>
          </div>
          <div className="heroFade" style={{ animationDelay: "880ms", marginTop: 20 }}>
            <EmailFallback prefix={t.email.prefix} copied={t.email.copied} />
          </div>
          <div className="heroFade" style={{ animationDelay: "940ms", marginTop: 30, fontSize: 14, fontWeight: 600, color: C.textMuted, fontStyle: "italic" }}>{t.hero.brand}</div>
        </header>

        {/* ── pain ── */}
        <section style={section}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 44px" }}>
              <Eyebrow>{t.pain.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 14px" }}>{t.pain.title}</h2>
              <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, margin: 0 }}>{t.pain.lead}</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {t.pain.items.map((it, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="svcCard" style={{ background: C.card, border: `1px solid ${C.borderSoft}`, borderRadius: 18, padding: "28px 26px", height: "100%" }}>
                  <div style={{ marginBottom: 14 }}>{it.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{it.t}</div>
                  <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{it.b}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── demo (the trust bridge) ── */}
        <section id="demo" style={{ ...section, scrollMarginTop: 76 }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}>
              <Eyebrow>{t.demo.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 14px" }}>{t.demo.title}</h2>
              <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, margin: "0 0 10px" }}>{t.demo.lead}</p>
              <p style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic", margin: 0 }}>{t.demo.disclaimer}</p>
            </div>
          </Reveal>

          {/* grounded answer */}
          <Reveal>
            <div className="svcCard" style={{ background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 18, padding: "24px 26px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 10 }}>Q: <span style={{ color: C.textPrimary, fontStyle: "italic" }}>&ldquo;{t.demo.q1}&rdquo;</span></div>
              <div style={{ fontSize: 15, color: C.textPrimary, lineHeight: 1.6, marginBottom: 12 }}>{t.demo.a1}</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 8, background: C.tealDim, border: `1px solid rgba(51,198,186,0.5)`, fontSize: 12, fontWeight: 600, color: C.mint, fontFamily: "monospace" }}>
                <Check size={13} color={C.mint} /> {t.demo.cite1}
              </span>
            </div>
          </Reveal>

          {/* refusal — the money shot */}
          <Reveal delay={90}>
            <div className="svcCard" style={{ background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 18, padding: "24px 26px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>Q: <span style={{ color: C.textPrimary, fontStyle: "italic" }}>&ldquo;{t.demo.q2}&rdquo;</span></div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "15px 17px", background: C.hotDim, border: `1px solid rgba(239,62,24,0.45)`, borderRadius: 13 }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}><Alert /></span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.hotSoft, marginBottom: 4 }}>{t.demo.gapLabel}</div>
                  <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{t.demo.gapNote}</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* contradiction */}
          <Reveal delay={130}>
            <div style={{ marginTop: 28 }}>
              <Eyebrow color={C.hotSoft}>{t.demo.contraEyebrow}</Eyebrow>
              <h3 style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 16px" }}>{t.demo.contraTitle}</h3>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>Q: <span style={{ color: C.textPrimary, fontStyle: "italic" }}>&ldquo;{t.demo.contraQ}&rdquo;</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginBottom: 14 }}>
                {[{ doc: t.demo.docA, val: t.demo.docAval, text: t.demo.docAtext }, { doc: t.demo.docB, val: t.demo.docBval, text: t.demo.docBtext }].map((d, i) => (
                  <div key={i} className="svcCard" style={{ background: C.card, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: "20px 20px" }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontFamily: "monospace" }}>{d.doc}</div>
                    <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>
                      {d.text.split(d.val)[0]}
                      <span style={{ background: "rgba(239,62,24,0.18)", color: "#FF8A6B", fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>{d.val}</span>
                      {d.text.split(d.val)[1]}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "15px 19px", background: C.crimsonDim, border: `1px solid rgba(239,62,24,0.5)`, borderRadius: 13 }}>
                <span className="pulseDot" style={{ width: 9, height: 9, borderRadius: "50%", background: C.hot, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.hotSoft, marginBottom: 4 }}>{t.demo.contraBanner}</div>
                  <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{t.demo.contraNote}</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* split: hallucinate vs grounded */}
          <Reveal delay={90}>
            <div style={{ marginTop: 48 }}>
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <Eyebrow>{t.demo.splitEyebrow}</Eyebrow>
                <h3 style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>{t.demo.splitTitle}</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
                <div className="svcCard" style={{ background: `linear-gradient(160deg, ${C.crimsonDim}, ${C.card} 55%)`, border: `1px solid rgba(239,62,24,0.5)`, borderRadius: 16, padding: "22px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 12, fontWeight: 700, color: C.hotSoft, letterSpacing: "0.06em" }}><XMark /> {t.demo.genericLabel}</div>
                  <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, marginBottom: 10 }}>{t.demo.genericAnswer}</div>
                  <div style={{ fontSize: 12, color: C.hotSoft, fontWeight: 600 }}>{t.demo.genericNote}</div>
                </div>
                <div className="svcCard" style={{ background: `linear-gradient(160deg, rgba(51,198,186,0.10), ${C.card} 55%)`, border: `1px solid rgba(51,198,186,0.55)`, borderRadius: 16, padding: "22px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 12, fontWeight: 700, color: C.mint, letterSpacing: "0.06em" }}><Check color={C.mint} /> {t.demo.groundedLabel}</div>
                  <div style={{ fontSize: 15, color: C.textPrimary, fontWeight: 700, lineHeight: 1.6, marginBottom: 8 }}>{t.demo.groundedAnswer}</div>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, background: C.tealDim, fontSize: 11, fontWeight: 600, color: C.mint, fontFamily: "monospace", marginBottom: 10 }}>{t.demo.groundedCite}</span>
                  <div style={{ fontSize: 12, color: C.mint, fontWeight: 600 }}>{t.demo.groundedNote}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── offer (animated gradient border) ── */}
        <section style={section}>
          <Reveal>
            <div className="shineBorder" style={{ borderRadius: 22, padding: 1 }}>
              <div style={{ background: C.surface, borderRadius: 21, padding: "clamp(28px,5vw,46px)" }}>
                <Eyebrow>{t.offer.eyebrow}</Eyebrow>
                <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 12px" }}>{t.offer.title}</h2>
                <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, margin: "0 0 26px", maxWidth: 620 }}>{t.offer.lead}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "11px 22px", marginBottom: 30 }}>
                  {t.offer.stack.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: C.textPrimary, lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}><Check /></span>{s}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "17px 21px", background: C.tealDim, border: `1px solid rgba(51,198,186,0.5)`, borderRadius: 13, marginBottom: 30 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}><Shield /></span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.mint, letterSpacing: "0.06em", marginBottom: 4 }}>{t.offer.guaranteeLabel.toUpperCase()}</div>
                    <div style={{ fontSize: 15, color: C.textPrimary, fontWeight: 600, lineHeight: 1.5 }}>{t.offer.guarantee}</div>
                  </div>
                </div>
                <PrimaryCTA label={t.finalCta.cta} />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── how it works ── */}
        <section style={section}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <Eyebrow>{t.how.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: 0 }}>{t.how.title}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {t.how.steps.map((s, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="svcCard" style={{ background: C.card, border: `1px solid ${C.borderSoft}`, borderRadius: 18, padding: "28px 26px", height: "100%" }}>
                  <div className="gradText" style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 14, display: "inline-block" }}>{s.n}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.t}</div>
                  <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{s.b}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── proof ── */}
        <section style={section}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
              <Eyebrow>{t.proof.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 14px" }}>{t.proof.title}</h2>
              <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, margin: 0 }}>{t.proof.lead}</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
            {t.proof.systems.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="svcCard" style={{ display: "block", background: C.card, border: `1px solid ${C.borderSoft}`, borderRadius: 16, padding: "24px 24px", textDecoration: "none", height: "100%" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>{s.name} <span style={{ color: C.teal, fontSize: 14 }}>↗</span></div>
                  <div style={{ fontSize: 13, color: C.textSec, marginBottom: 10 }}>{s.kind}</div>
                  <div style={{ fontSize: 12, color: C.mint, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{s.metric}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── story ── */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 96px", textAlign: "center" }}>
          <Reveal>
            <Eyebrow>{t.story.eyebrow}</Eyebrow>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 800, letterSpacing: "-0.6px", margin: "0 0 16px" }}>{t.story.title}</h2>
            <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.8, margin: "0 0 20px" }}>{t.story.body}</p>
            <div className="gradText" style={{ fontSize: 15, fontWeight: 700, fontStyle: "italic", display: "inline-block" }}>{t.story.brand}</div>
          </Reveal>
        </section>

        {/* ── faq ── */}
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 96px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 34 }}>
              <Eyebrow>{t.faq.eyebrow}</Eyebrow>
              <h2 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 800, letterSpacing: "-0.8px", margin: 0 }}>{t.faq.title}</h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {t.faq.items.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="svcCard" style={{ background: C.card, border: `1px solid ${C.borderSoft}`, borderRadius: 15, padding: "21px 23px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{f.q}</div>
                  <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>{f.a}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── final cta ── */}
        <section style={{ maxWidth: 720, margin: "0 auto 96px", padding: "0 24px" }}>
          <Reveal>
            <div className="shineBorder" style={{ borderRadius: 24, padding: 1 }}>
              <div style={{ background: `radial-gradient(120% 140% at 50% 0%, rgba(51,198,186,0.08), ${C.surface} 55%)`, borderRadius: 23, padding: "clamp(44px,6vw,68px) 32px", textAlign: "center" }}>
                <Eyebrow>{t.finalCta.eyebrow}</Eyebrow>
                <h2 style={{ fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 16px" }}>{t.finalCta.title}</h2>
                <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, margin: "0 auto 30px", maxWidth: 500 }}>{t.finalCta.lead}</p>
                <PrimaryCTA label={t.finalCta.cta} />
                <div style={{ marginTop: 18, fontSize: 13, color: C.textMuted }}>{t.finalCta.note}</div>
                <div style={{ marginTop: 14 }}>
                  <EmailFallback prefix={t.email.prefix} copied={t.email.copied} />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── footer ── */}
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: "26px 24px", textAlign: "center", fontSize: 12, color: C.textMuted }}>
          <Link href="/" style={{ color: C.teal, textDecoration: "none" }}>{t.footer}</Link>
        </footer>
      </div>

      <style>{`
        /* ── keyframes ── */
        @keyframes svc-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.8); } }
        @keyframes wordUp { from { transform: translateY(110%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes heroFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradShift { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        @keyframes shineMove { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
        @keyframes driftA { 0% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-6vw, 5vh, 0) scale(1.12); } 100% { transform: translate3d(3vw, -4vh, 0) scale(1); } }
        @keyframes driftB { 0% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(7vw, -6vh, 0) scale(1.15); } 100% { transform: translate3d(-4vw, 3vh, 0) scale(1); } }
        @keyframes driftC { 0% { transform: translate3d(0,0,0); } 50% { transform: translate3d(4vw, 6vh, 0); } 100% { transform: translate3d(-3vw, -3vh, 0); } }

        /* ── ambient background ── */
        /* radial gradients instead of filter:blur — same soft look, no expensive filter pass */
        .blobA, .blobB, .blobC { position: absolute; border-radius: 50%; will-change: transform; }
        .blobA { width: 64vw; height: 64vw; top: -24vw; right: -20vw; background: radial-gradient(circle, rgba(51,198,186,0.13), transparent 65%); animation: driftA 34s ease-in-out infinite alternate; }
        .blobB { width: 58vw; height: 58vw; bottom: -22vw; left: -20vw; background: radial-gradient(circle, rgba(239,62,24,0.09), transparent 65%); animation: driftB 42s ease-in-out infinite alternate; }
        .blobC { width: 40vw; height: 40vw; top: 36%; left: -14vw; background: radial-gradient(circle, rgba(120,22,30,0.12), transparent 65%); animation: driftC 50s ease-in-out infinite alternate; }
        .noiseLayer { position: absolute; inset: 0; opacity: 0.028; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        /* ── cinematic hero ── */
        .wordWrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .wordRise { display: inline-block; transform: translateY(110%); opacity: 0; animation: wordUp 0.75s ${EASE} forwards; }
        .heroFade { opacity: 0; animation: heroFadeUp 0.85s ${EASE} forwards; }
        .gradText {
          background: linear-gradient(100deg, ${C.mint}, ${C.teal} 55%, ${C.mint});
          background-size: 220% 100%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: gradShift 7s ease-in-out infinite alternate;
        }
        /* animation is a single cascade slot — combine both so gradient words still rise in */
        .wordRise.gradText { animation: wordUp 0.75s ${EASE} forwards, gradShift 7s ease-in-out infinite alternate; }

        /* ── living dot ── */
        .pulseDot { animation: svc-pulse 2s infinite; }

        /* ── primary CTA (vermilion, alive) ── */
        .ctaHot {
          background: linear-gradient(135deg, ${C.hot}, #B22509 82%);
          box-shadow: 0 10px 34px rgba(239,62,24,0.32), inset 0 1px 0 rgba(255,255,255,0.14);
          transition: transform 0.28s ${EASE}, box-shadow 0.28s ${EASE}, filter 0.28s ${EASE};
          will-change: transform;
        }
        .ctaHot:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 48px rgba(239,62,24,0.48), inset 0 1px 0 rgba(255,255,255,0.18);
          filter: brightness(1.06);
        }
        .ctaHot:active { transform: translateY(0) scale(0.99); }

        /* ── ghost buttons ── */
        .ghostBtn {
          border: 1px solid rgba(51,198,186,0.28);
          transition: border-color 0.25s ${EASE}, color 0.25s ${EASE}, background 0.25s ${EASE}, transform 0.25s ${EASE};
        }
        .ghostBtn:hover { border-color: rgba(51,198,186,0.7); color: ${C.mint} !important; background: rgba(51,198,186,0.07); transform: translateY(-1px); }

        /* ── living cards ── */
        .svcCard {
          transition: transform 0.32s ${EASE}, border-color 0.32s ${EASE}, box-shadow 0.32s ${EASE};
          will-change: transform;
        }
        .svcCard:hover {
          transform: translateY(-4px);
          border-color: rgba(51,198,186,0.5) !important;
          box-shadow: 0 18px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(51,198,186,0.12);
        }

        /* ── animated gradient border (offer + final CTA) ── */
        .shineBorder {
          background: linear-gradient(115deg, rgba(51,198,186,0.55), rgba(148,238,227,0.25) 30%, rgba(239,62,24,0.30) 55%, rgba(51,198,186,0.55) 80%);
          background-size: 300% 100%;
          animation: shineMove 9s linear infinite;
        }

        /* ── focus & selection ── */
        /* Scoped to .svc-root. This <style> unmounts with the page, so these
           never reached other routes — but unscoped they still overrode the
           site's own --accent focus ring on any shared chrome rendered here. */
        .svc-root a:focus-visible, .svc-root button:focus-visible { outline: 2px solid ${C.mint}; outline-offset: 2px; border-radius: 10px; }
        .svc-root ::selection { background: rgba(51,198,186,0.35); }

        /* ── reduced motion: calm everything ── */
        @media (prefers-reduced-motion: reduce) {
          .pulseDot, .blobA, .blobB, .blobC, .gradText, .shineBorder { animation: none !important; }
          .wordRise { animation: none !important; transform: none !important; opacity: 1 !important; }
          .heroFade { animation: none !important; opacity: 1 !important; }
          .svcCard, .ctaHot, .ghostBtn { transition: none !important; }
        }
      `}</style>
    </div>
  );
}

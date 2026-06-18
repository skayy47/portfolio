"use client";

// AURA mascot — themeable animated SVG. Eyes glow + blink, antenna pulses,
// planet-hands bob, the whole bot floats. Accent colours come from --c / --accent-2.
export function AuraBot() {
  return (
    <svg className="aura-bot" viewBox="0 0 280 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="botHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2750" />
          <stop offset="1" stopColor="#0b1130" />
        </linearGradient>
        <linearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#161f44" />
          <stop offset="1" stopColor="#090e26" />
        </linearGradient>
        <linearGradient id="botLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--c)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>

      {/* ground glow */}
      <ellipse className="bot-shadow" cx="140" cy="342" rx="64" ry="9" fill="var(--c)" />

      <g className="bot-float">
        {/* planet hands */}
        <g className="bot-hand bot-hand-l">
          <circle cx="46" cy="252" r="16" fill="url(#botBody)" stroke="var(--c)" strokeOpacity="0.45" />
          <ellipse cx="46" cy="252" rx="25" ry="6.5" stroke="var(--c)" strokeOpacity="0.5" transform="rotate(-20 46 252)" />
        </g>
        <g className="bot-hand bot-hand-r">
          <circle cx="234" cy="252" r="16" fill="url(#botBody)" stroke="var(--c)" strokeOpacity="0.45" />
          <ellipse cx="234" cy="252" rx="25" ry="6.5" stroke="var(--c)" strokeOpacity="0.5" transform="rotate(20 234 252)" />
        </g>

        {/* body shield */}
        <path
          d="M90 214 q0 -16 16 -16 h68 q16 0 16 16 v64 q0 11 -7 19 l-43 50 -43 -50 q-7 -8 -7 -19 z"
          fill="url(#botBody)"
          stroke="var(--c)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        {/* logo panel */}
        <rect x="110" y="226" width="60" height="60" rx="16" fill="#0b1230" stroke="var(--c)" strokeOpacity="0.5" strokeWidth="1.5" />
        {/* AURA caret */}
        <path className="bot-logo" d="M140 244 L125 275 M140 244 L155 275" stroke="url(#botLogo)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

        {/* antenna */}
        <line x1="140" y1="54" x2="140" y2="32" stroke="var(--c)" strokeWidth="3" strokeLinecap="round" />
        <circle className="bot-antenna" cx="140" cy="25" r="7" fill="var(--accent-2)" />

        {/* head */}
        <ellipse cx="140" cy="122" rx="80" ry="74" fill="url(#botHead)" stroke="var(--c)" strokeOpacity="0.65" strokeWidth="1.5" />
        {/* visor band */}
        <path d="M68 104 a78 70 0 0 1 144 0 a200 200 0 0 1 -144 0 z" fill="#0a1028" opacity="0.5" />
        {/* eyes */}
        <g className="bot-eyes" fill="var(--c)">
          <rect x="98" y="112" width="34" height="20" rx="10" />
          <rect x="148" y="112" width="34" height="20" rx="10" />
        </g>
        {/* mouth */}
        <rect x="127" y="152" width="26" height="6" rx="3" fill="var(--c)" opacity="0.4" />
      </g>
    </svg>
  );
}

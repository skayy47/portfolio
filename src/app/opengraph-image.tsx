import { ImageResponse } from "next/og";

export const alt = "Oussama Skia (SKAY) — AI Engineer. I build AI systems that survive production.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic Open Graph card — aurora-branded, generated at build time. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          background: "#f7f8fc",
          backgroundImage:
            "radial-gradient(720px 720px at 10% 4%, rgba(110,123,255,0.38), transparent 60%), radial-gradient(680px 680px at 92% 96%, rgba(95,224,240,0.32), transparent 62%), radial-gradient(560px 560px at 88% 10%, rgba(178,124,255,0.30), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#5b6cff", marginRight: "16px" }} />
          <div style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "6px", color: "#0b1020" }}>SKAY</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "27px", letterSpacing: "4px", color: "#3f45d6", marginBottom: "22px" }}>
            OUSSAMA SKIA · AI / ML ENGINEER
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: "82px", fontWeight: 800, lineHeight: 1.06 }}>
            <span style={{ color: "#0b1020", marginRight: "22px" }}>I build</span>
            <span style={{ color: "#5b6cff", marginRight: "22px" }}>AI systems</span>
            <span style={{ color: "#0b1020", marginRight: "22px" }}>that survive</span>
            <span style={{ color: "#9b5bff" }}>production.</span>
          </div>
        </div>

        {/* Footline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "27px" }}>
          <div style={{ display: "flex", color: "#46506a" }}>Multi-agent AI · Production RAG · Full-stack data</div>
          <div style={{ display: "flex", color: "#8b93a8" }}>Casablanca → the world</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

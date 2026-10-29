import { ImageResponse } from "next/og";

// Image affichée quand un lien d'AVERO est partagé (LinkedIn, WhatsApp, X, Slack…). Générée au build.
export const alt = "AVERO : statistiques Instagram et TikTok vérifiées pour créateurs et marques";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f5f6fa",
          backgroundColor: "#0f1030",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(124,92,255,0.55), transparent 45%), radial-gradient(circle at 15% 100%, rgba(59,70,241,0.6), transparent 50%), radial-gradient(circle at 70% 95%, rgba(214,51,108,0.35), transparent 40%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
          AVERO
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              backgroundImage: "linear-gradient(135deg, #3b46f1, #7c5cff, #d6336c)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Prouvez votre influence avec des chiffres que personne ne peut retoucher.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "rgba(245,246,250,0.75)" }}>
            <div style={{ display: "flex", padding: "6px 14px", borderRadius: 10, backgroundColor: "#ffd84d", color: "#191934", fontSize: 24, fontWeight: 700 }}>
              Lu à la source
            </div>
            Statistiques Instagram et TikTok vérifiées
          </div>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";
export const alt = "MOUNDWEB | Digital marketing, SEO and creative growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 80% 38%, #622710 0%, #190d09 43%, #070707 79%)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <span style={{ width: 62, height: 62, border: "3px solid #ff803c", borderRadius: 13, color: "#ff803c", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 39, fontWeight: 800 }}>M</span>
        <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: 5 }}>MOUNDWEB</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontWeight: 800, fontSize: 76, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
          <span>Digital growth.</span><span style={{ color: "#ff803c" }}>Clear direction.</span>
        </div>
        <span style={{ color: "#e4d4c8", fontSize: 27 }}>SEO · Social Media · Performance · Brand Strategy</span>
      </div>
      <span style={{ fontSize: 23, letterSpacing: 2, color: "#ffa877" }}>WWW.MOUNDWEB.TECH</span>
    </div>,
    size,
  );
}

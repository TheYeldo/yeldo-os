import { ImageResponse } from "next/og";

export const alt = "YeldoOS browser developer workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#07090d",
        color: "#f2f5f8",
        padding: "68px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#7f8996",
          fontSize: 22,
        }}
      >
        <span>YELDO / FRONTEND DEVELOPER</span>
        <span>ALMATY · KAZAKHSTAN</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 70,
              height: 70,
              border: "2px solid #45d6df",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: "#45d6df",
            }}
          >
            Y
          </div>
          <span
            style={{ fontSize: 96, letterSpacing: "-5px", fontWeight: 650 }}
          >
            YeldoOS
          </span>
        </div>
        <span
          style={{
            maxWidth: 820,
            fontSize: 36,
            lineHeight: 1.25,
            color: "#aeb7c3",
          }}
        >
          An original developer workspace running inside the browser.
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, color: "#45d6df", fontSize: 21 }}>
        <span>PROJECTS</span>
        <span>·</span>
        <span>GITHUB</span>
        <span>·</span>
        <span>TERMINAL</span>
        <span>·</span>
        <span>CODE EXPLORER</span>
      </div>
    </div>,
    size,
  );
}

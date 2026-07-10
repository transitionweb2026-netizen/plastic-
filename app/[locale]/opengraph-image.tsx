import { ImageResponse } from "next/og";

export const alt = "Giant Storage — Integrated Industrial Solutions";
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
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0e4a30 0%, #195838 50%, #246640 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.09) 2.5px, transparent 2.5px)",
            backgroundSize: "38px 38px",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 40 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              color: "#0e4a30",
            }}
          >
            GS
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "#ffffff" }}>
              GIANT STORAGE
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#92d5a6",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              Integrated Solutions
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: 980,
            marginBottom: 26,
          }}
        >
          Leading Egyptian Industrial Plastic Solutions
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 25,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            maxWidth: 860,
            lineHeight: 1.4,
          }}
        >
          Pallets, crates &amp; high-density storage systems engineered for
          warehousing, cold chain, and logistics at scale.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 44,
            padding: "12px 24px",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.14)",
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            alignSelf: "flex-start",
          }}
        >
          Excellence in Cairo, Egypt
        </div>
      </div>
    ),
    { ...size }
  );
}

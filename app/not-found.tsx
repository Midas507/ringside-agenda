"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* 404 */}
      <h1
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(80px, 20vw, 180px)",
          color: "#E8186D",
          lineHeight: 0.9,
          margin: 0,
          textShadow: "0 0 30px rgba(232,24,109,0.5)",
        }}
      >
        404
      </h1>

      <p
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "10px",
          color: "#FFB300",
          letterSpacing: "0.15em",
          marginBottom: "50px",
        }}
      >
        &gt;&gt; K.O. ! PAGE INTROUVABLE &lt;&lt;
      </p>

      {/* Ring + Catcheurs */}
      <div
        style={{
          position: "relative",
          width: "240px",
          height: "160px",
          marginBottom: "50px",
        }}
      >
        {/* Sol du ring */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "220px",
            height: "8px",
            background: "#252525",
            borderTop: "2px solid #E8186D",
          }}
        />
        {/* Poteaux du ring */}
        <div style={{ position: "absolute", bottom: "8px", left: "10px", width: "4px", height: "50px", background: "#E8186D" }} />
        <div style={{ position: "absolute", bottom: "8px", right: "10px", width: "4px", height: "50px", background: "#E8186D" }} />
        {/* Cordes */}
        <div style={{ position: "absolute", bottom: "50px", left: "10px", right: "10px", height: "2px", background: "rgba(255,179,0,0.5)" }} />
        <div style={{ position: "absolute", bottom: "40px", left: "10px", right: "10px", height: "2px", background: "rgba(255,179,0,0.3)" }} />

        {/* Les 2 catcheurs qui font la German Suplex */}
        <div className="suplex-scene">
          {/* Catcheur 1 (celui qui porte) */}
          <div className="wrestler-thrower">
            <PixelWrestler color="#E8186D" />
          </div>
          {/* Catcheur 2 (celui qui est projeté) */}
          <div className="wrestler-victim">
            <PixelWrestler color="#FFB300" flipped />
          </div>
        </div>
      </div>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#E8186D",
          color: "white",
          fontFamily: "Inter, sans-serif",
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 32px",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        ← Retour à l'accueil
      </Link>

      <style>{`
        .suplex-scene {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 100px;
        }

        .wrestler-thrower {
          position: absolute;
          bottom: 0;
          left: 30px;
          animation: throwerBridge 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .wrestler-victim {
          position: absolute;
          bottom: 0;
          left: 30px;
          animation: victimFly 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        @keyframes throwerBridge {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          30% { transform: rotate(0deg) translateY(0); }
          55% { transform: rotate(-20deg) translateY(-4px); }
          70% { transform: rotate(-35deg) translateY(-6px); }
          85% { transform: rotate(0deg) translateY(0); }
        }

        @keyframes victimFly {
          0%, 25% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 1;
          }
          45% {
            transform: rotate(-90deg) translate(-10px, -30px);
            opacity: 1;
          }
          65% {
            transform: rotate(-180deg) translate(-40px, -20px);
            opacity: 1;
          }
          80% {
            transform: rotate(-180deg) translate(-55px, 0);
            opacity: 1;
          }
          85% {
            transform: rotate(-180deg) translate(-55px, 0);
            opacity: 0;
          }
          86% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Catcheur en pixel art (SVG)
function PixelWrestler({ color, flipped }: { color: string; flipped?: boolean }) {
  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 20 30"
      style={{
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(-1)" : "none",
      }}
      shapeRendering="crispEdges"
    >
      {/* Tête */}
      <rect x="7" y="1" width="6" height="6" fill="#F5C9A0" />
      {/* Cheveux */}
      <rect x="7" y="1" width="6" height="2" fill="#3a2a1a" />
      {/* Corps / maillot */}
      <rect x="6" y="7" width="8" height="9" fill={color} />
      {/* Bras gauche */}
      <rect x="3" y="8" width="3" height="7" fill="#F5C9A0" />
      {/* Bras droit */}
      <rect x="14" y="8" width="3" height="7" fill="#F5C9A0" />
      {/* Jambe gauche */}
      <rect x="6" y="16" width="3" height="8" fill="#1a1a2a" />
      {/* Jambe droite */}
      <rect x="11" y="16" width="3" height="8" fill="#1a1a2a" />
      {/* Bottes */}
      <rect x="6" y="24" width="3" height="3" fill={color} />
      <rect x="11" y="24" width="3" height="3" fill={color} />
    </svg>
  );
}

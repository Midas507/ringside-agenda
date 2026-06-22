"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";

type Federation = {
  id: number;
  nom: string;
  logo_url: string | null;
  pays: string | null;
  description: string | null;
  shows_count?: number;
};

const paysFlags: Record<string, string> = {
  FR: "🇫🇷",
  BE: "🇧🇪",
  CH: "🇨🇭",
};

export default function FederationsClient() {
  const [federations, setFederations] = useState<Federation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [fedsRes, showsRes] = await Promise.all([
        supabase.from("federations").select("*").order("nom", { ascending: true }),
        supabase.from("shows").select("federation").gte("date", today),
      ]);

      const counts: Record<string, number> = {};
      if (showsRes.data) {
        showsRes.data.forEach((s) => {
          const key = s.federation.toLowerCase();
          counts[key] = (counts[key] || 0) + 1;
        });
      }

      if (fedsRes.data) {
        setFederations(
          fedsRes.data.map((f) => ({
            ...f,
            shows_count: counts[f.nom.toLowerCase()] || 0,
          }))
        );
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "64px",
              lineHeight: 1,
              color: "white",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            FÉDÉRATIONS <span style={{ color: "#E8186D" }}>FRANCOPHONES</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {federations.length} FÉDÉRATION{federations.length > 1 ? "S" : ""} RÉPERTORIÉE{federations.length > 1 ? "S" : ""}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "10px",
                color: "#E8186D",
              }}
            >
              CHARGEMENT...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {federations.map((fed) => (
              <a
                key={fed.id}
                href={`/federations/${fed.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#161616",
                  border: "1px solid #252525",
                  borderRadius: "6px",
                  overflow: "hidden",
                  textDecoration: "none",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#FFB300";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#252525";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1/1",
                    background: "#0D0D0D",
                    overflow: "hidden",
                  }}
                >
                  {fed.logo_url ? (
                    <>
                      <img
                        src={fed.logo_url}
                        alt=""
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "blur(20px) brightness(0.5)",
                          transform: "scale(1.2)",
                        }}
                      />
                      <img
                        src={fed.logo_url}
                        alt={fed.nom}
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "20px",
                          zIndex: 1,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(ellipse at center, transparent 50%, rgba(13,13,13,0.6) 100%)",
                          pointerEvents: "none",
                          zIndex: 2,
                        }}
                      />
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-bebas)",
                          fontSize: "32px",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        {fed.nom.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ padding: "12px", borderTop: "1px solid #252525" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "18px",
                      color: "white",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {fed.nom}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>
                      {paysFlags[fed.pays || ""] || ""}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-pixel)",
                        fontSize: "6px",
                        color: "#E8186D",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {fed.shows_count} SHOW{(fed.shows_count || 0) > 1 ? "S" : ""}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Calendar, MapPin, ArrowRight, ArrowLeft, Globe, Instagram } from "lucide-react";
import FollowFederationButton from "./FollowFederationButton";

type Federation = {
  id: number;
  nom: string;
  logo_url: string | null;
  pays: string | null;
  description: string | null;
  site_web: string | null;
  instagram: string | null;
  annee_creation: number | null;
};

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  image_url: string | null;
  gratuit: boolean;
};

const paysFull: Record<string, string> = {
  FR: "France",
  BE: "Belgique",
  CH: "Suisse",
};

const paysFlags: Record<string, string> = {
  FR: "🇫🇷",
  BE: "🇧🇪",
  CH: "🇨🇭",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export default function FederationDetailClient({ federationId }: { federationId: string }) {
  const [federation, setFederation] = useState<Federation | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const fedRes = await supabase.from("federations").select("*").eq("id", federationId).single();
      if (fedRes.data) {
        setFederation(fedRes.data);
        // Tracking : incrémenter la vue
        await supabase.rpc("increment_federation_view", { p_federation_id: parseInt(federationId) });

        const today = new Date().toISOString().split("T")[0];
        const showsRes = await supabase
          .from("shows")
          .select("*")
          .ilike("federation", fedRes.data.nom)
          .gte("date", today)
          .order("date", { ascending: true });

        if (showsRes.data) setShows(showsRes.data);
      }
      setLoading(false);
    }
    fetchData();
  }, [federationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "#E8186D" }}>
          CHARGEMENT...
        </span>
      </div>
    );
  }

  if (!federation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", color: "white" }}>
          FÉDÉRATION INTROUVABLE
        </h1>
        <a href="/federations" style={{ color: "#FFB300", textDecoration: "none" }}>
          ← Retour aux promotions
        </a>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <a
          href="/federations"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#FFB300",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={14} /> Retour aux promotions
        </a>

        {/* Header de la fédération */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
            marginBottom: "32px",
            padding: "24px",
            background: "#161616",
            border: "1px solid #E8186D",
            borderRadius: "8px",
          }}
          className="flex-col md:flex-row"
        >
          {federation.logo_url && (
            <div
              style={{
                width: "180px",
                height: "180px",
                minWidth: "180px",
                background: "#0D0D0D",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={federation.logo_url}
                alt={federation.nom}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "56px",
                lineHeight: 1,
                color: "white",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {federation.nom}
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {federation.pays && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                  }}
                >
                  {paysFlags[federation.pays]} {paysFull[federation.pays]}
                </span>
              )}
              {federation.annee_creation && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                  }}
                >
                  Fondée en {federation.annee_creation}
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  color: "#E8186D",
                  letterSpacing: "0.1em",
                  alignSelf: "center",
                }}
              >
                {shows.length} SHOW{shows.length > 1 ? "S" : ""} À VENIR
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> 
              <FollowFederationButton federationId={federation.id} />
              {federation.site_web && (
                <a
                  href={federation.site_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#FFB300",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    padding: "8px 14px",
                    border: "1px solid #FFB300",
                    borderRadius: "3px",
                  }}
                >
                  <Globe size={13} /> Site web
                </a>
              )}
              {federation.instagram && (
                <a
                  href={federation.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#E8186D",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    padding: "8px 14px",
                    border: "1px solid #E8186D",
                    borderRadius: "3px",
                  }}
                >
                  <Instagram size={13} /> Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {federation.description && (
          <div
            style={{
              padding: "24px",
              background: "#161616",
              border: "1px solid #252525",
              borderRadius: "6px",
              marginBottom: "32px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "#E8186D",
                textTransform: "uppercase",
                marginBottom: "12px",
                letterSpacing: "0.05em",
              }}
            >
              À propos
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {federation.description}
            </p>
          </div>
        )}

        {/* Shows à venir */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "32px",
              color: "white",
              textTransform: "uppercase",
              marginBottom: "16px",
              letterSpacing: "0.04em",
            }}
          >
            Shows <span style={{ color: "#E8186D" }}>à venir</span>
          </h2>

          {shows.length === 0 ? (
            <div
              style={{
                padding: "40px",
                background: "#161616",
                border: "1px solid #252525",
                borderRadius: "6px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                AUCUN SHOW PROGRAMMÉ POUR LE MOMENT
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shows.map((show) => (
                <a
                  key={show.id}
                  href={`/show/${show.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#161616",
                    border: "1px solid #E8186D",
                    borderRadius: "6px",
                    overflow: "hidden",
                    textDecoration: "none",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#FFB300";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E8186D";
                  }}
                >
                  {show.image_url && (
                    <div style={{ width: "100%", height: "140px", overflow: "hidden", background: "#111" }}>
                      <img
                        src={show.image_url}
                        alt={show.titre}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ padding: "12px" }}>
                    {show.gratuit && (
                      <span
                        style={{
                          display: "inline-block",
                          background: "#10B981",
                          color: "white",
                          fontFamily: "var(--font-pixel)",
                          fontSize: "6px",
                          letterSpacing: "0.1em",
                          padding: "3px 8px",
                          borderRadius: "2px",
                          marginBottom: "8px",
                        }}
                      >
                        GRATUIT
                      </span>
                    )}
                    <h3
                      style={{
                        fontFamily: "var(--font-bebas)",
                        fontSize: "22px",
                        color: "white",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        marginBottom: "8px",
                      }}
                    >
                      {show.titre}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                        <Calendar size={11} style={{ color: "#E8186D" }} />
                        {formatDate(show.date)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                        <MapPin size={11} style={{ color: "#E8186D" }} />
                        {show.ville}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

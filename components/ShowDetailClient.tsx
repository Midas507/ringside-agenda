"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import FavoriteShowButton from "./FavoriteShowButton";
import ShareButtons from "./ShareButtons";
import Countdown from "./Countdown";
import ShowRating from "./ShowRating";
import ShowComments from "./ShowComments";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  pays: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  description: string | null;
  lien_billetterie: string | null;
  fed_logo?: string | null;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export default function ShowDetailClient({ showId }: { showId: string }) {
  const [show, setShow] = useState<Show | null>(null);
  const [suggestions, setSuggestions] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Tracking : incrémenter la vue
      await supabase.rpc("increment_show_view", { p_show_id: parseInt(showId) });

      const today = new Date().toISOString().split("T")[0];

      const [showRes, suggsRes, fedsRes] = await Promise.all([
        supabase.from("shows").select("*").eq("id", showId).single(),
        supabase
          .from("shows")
          .select("*")
          .gte("date", today)
          .neq("id", showId)
          .order("date", { ascending: true })
          .limit(6),
        supabase.from("federations").select("nom, logo_url"),
      ]);

      const fedsMap: Record<string, string | null> = {};
      if (fedsRes.data) {
        fedsRes.data.forEach((f) => {
          fedsMap[f.nom.toLowerCase()] = f.logo_url;
        });
      }

      if (showRes.data) {
        setShow({
          ...showRes.data,
          fed_logo: fedsMap[showRes.data.federation.toLowerCase()] || null,
        });
      }

      if (suggsRes.data) {
        setSuggestions(
          suggsRes.data.map((s) => ({
            ...s,
            fed_logo: fedsMap[s.federation.toLowerCase()] || null,
          }))
        );
      }

      setLoading(false);
    }
    fetchData();
  }, [showId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "#E8186D" }}>
          CHARGEMENT...
        </span>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", color: "white" }}>
          SHOW INTROUVABLE
        </h1>
        <a href="/" style={{ color: "#FFB300", textDecoration: "none" }}>
          ← Retour à l'accueil
        </a>
      </div>
    );
  }

  const heroImage = show.image_url || show.fed_logo || null;
  const today = new Date().toISOString().split("T")[0];
  const isUpcoming = show.date >= today;
  const isPast = show.date < today;

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <a
          href="/"
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
          <ArrowLeft size={14} /> Retour
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {heroImage && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/10",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #E8186D",
                  background: "#111",
                  marginBottom: "24px",
                }}
              >
                {!show.image_url && show.fed_logo && (
                  <img
                    src={show.fed_logo}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "blur(20px) brightness(0.3)",
                      transform: "scale(1.2)",
                    }}
                  />
                )}
                <img
                  src={heroImage}
                  alt={show.titre}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    objectFit: show.image_url ? "cover" : "contain",
                    padding: show.image_url ? "0" : "40px",
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "#E8186D",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: "3px",
                  }}
                >
                  {show.federation}
                </span>
                {isPast && (
                  <span style={{
                    display: "inline-block",
                    background: "#252525",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    padding: "4px 10px",
                    borderRadius: "3px",
                  }}>
                    SHOW PASSÉ
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "56px",
                  lineHeight: 1,
                  color: "white",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {show.titre}
              </h1>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)" }}>
                  <Calendar size={16} style={{ color: "#E8186D" }} />
                  <span style={{ fontSize: "14px" }}>
                    {formatDate(show.date)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)" }}>
                  <MapPin size={16} style={{ color: "#E8186D" }} />
                  <span style={{ fontSize: "14px" }}>{show.ville}</span>
                </div>
              </div>

              {isUpcoming && (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {show.lien_billetterie && (
                    <a
                      href={show.lien_billetterie}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        supabase.rpc("increment_ticket_click", { p_show_id: show.id });
                      }}
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
                        padding: "14px 24px",
                        borderRadius: "3px",
                        textDecoration: "none",
                        transition: "background 0.2s",
                      }}
                    >
                      <ExternalLink size={14} /> Réserver ma place
                    </a>
                  )}
                  <FavoriteShowButton showId={show.id} />
                </div>
              )}
            </div>

            {/* Compte à rebours uniquement si show à venir */}
            {isUpcoming && <Countdown date={show.date} />}

            {/* Notation uniquement si show passé */}
            {isPast && <ShowRating showId={show.id} />}

            {show.description && (
              <div
                style={{
                  padding: "20px 24px",
                  background: "#161616",
                  border: "1px solid #252525",
                  borderRadius: "6px",
                  marginTop: "16px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "20px",
                    color: "#E8186D",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    letterSpacing: "0.05em",
                  }}
                >
                  À propos du show
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    whiteSpace: "pre-line",
                  }}
                >
                  {show.description}
                </p>
              </div>
            )}
          <ShowComments showId={show.id} />
            <ShareButtons title={`${show.titre} - ${show.federation}`} />
          </div>

          <div>
            <h3
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "white",
                textTransform: "uppercase",
                marginBottom: "16px",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#FFB300" }}>★</span> Prochains Shows
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {suggestions.map((s) => {
                const sImg = s.image_url || s.fed_logo || null;
                return (
                  <a
                    key={s.id}
                    href={`/show/${s.id}`}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "10px",
                      background: "#161616",
                      border: "1px solid #252525",
                      borderRadius: "6px",
                      textDecoration: "none",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {sImg && (
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          background: "#111",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={sImg}
                          alt={s.titre}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: s.image_url ? "cover" : "contain",
                            padding: s.image_url ? "0" : "6px",
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "9px",
                          color: "#E8186D",
                          fontWeight: "700",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {s.federation}
                      </span>
                      <h4
                        style={{
                          fontFamily: "var(--font-bebas)",
                          fontSize: "16px",
                          color: "white",
                          textTransform: "uppercase",
                          lineHeight: 1.1,
                          margin: "2px 0 4px 0",
                        }}
                      >
                        {s.titre}
                      </h4>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {formatDateShort(s.date)} · {s.ville}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

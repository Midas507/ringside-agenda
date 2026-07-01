"use client";
import "./FeaturedShows.css";
import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  date_fin: string | null;
  ville: string;
  image_url: string | null;
  gratuit: boolean;
  fed_logo?: string | null;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  }).toUpperCase();
}

function formatDateRange(dateStr: string, dateFin: string | null) {
  if (!dateFin || dateFin === dateStr) {
    return formatDate(dateStr);
  }
  const d1 = new Date(dateStr);
  const d2 = new Date(dateFin);
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    const mois = d2.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
    return `${d1.getDate()}-${d2.getDate()} ${mois}`;
  }
  return `${formatDate(dateStr)} - ${formatDate(dateFin)}`;
}

export default function FeaturedShows() {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [showsRes, fedsRes] = await Promise.all([
        supabase
          .from("shows")
          .select("*")
          .eq("featured", true)
          .gte("date", today)
          .or(`featured_until.gte.${today},featured_until.is.null`)
          .order("date", { ascending: true })
          .limit(4),
        supabase.from("federations").select("nom, logo_url"),
      ]);

      const fedsMap: Record<string, string | null> = {};
      if (fedsRes.data) {
        fedsRes.data.forEach((f) => {
          fedsMap[f.nom.toLowerCase()] = f.logo_url;
        });
      }

      if (showsRes.data) {
        setShows(
          showsRes.data.map((s) => ({
            ...s,
            fed_logo: fedsMap[s.federation.toLowerCase()] || null,
          }))
        );
      }
    }
    fetchData();
  }, []);

  if (shows.length === 0) return null;

  return (
    <div
      className="hidden lg:flex"
      style={{
        position: "absolute",
        top: "90px",
        left: "1180px",
        zIndex: 20,
        gap: "16px",
        flexDirection: "row",
      }}
    >
      {shows.map((show) => {
        const img = show.image_url || show.fed_logo || null;
        return (
          <a
            key={show.id}
            href={`/show/${show.id}`}
            className="featured-card"
            style={{
              width: "260px",
              background: "rgba(22,22,22,0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: "8px",
              overflow: "hidden",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              transition: "transform 0.2s",
              position: "relative",
              display: "block",
              padding: "2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FFB300";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E8186D";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Ruban "FEATURED" en diagonal */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "-32px",
                background: "linear-gradient(135deg, #FFB300 0%, #E8186D 100%)",
                color: "white",
                fontFamily: "var(--font-pixel)",
                fontSize: "8px",
                padding: "5px 40px",
                letterSpacing: "0.15em",
                fontWeight: 700,
                zIndex: 3,
                transform: "rotate(-35deg)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                textAlign: "center",
              }}
            >
              ⭐ FEATURED ⭐
            </div>

            {/* Image */}
            {img && (
              <div
                style={{
                  width: "100%",
                  height: "360px",
                  background: "#0D0D0D",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img}
                  alt={show.titre}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: show.image_url ? "cover" : "contain",
                    padding: show.image_url ? "0" : "20px",
                  }}
                />
              </div>
            )}

            {/* Contenu */}
            <div style={{ padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "#E8186D",
                    color: "white",
                    fontSize: "8px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "2px 7px",
                    borderRadius: "2px",
                  }}
                >
                  {show.federation}
                </span>
                {show.gratuit && (
                  <span
                    style={{
                      background: "#10B981",
                      color: "white",
                      fontFamily: "var(--font-pixel)",
                      fontSize: "5px",
                      letterSpacing: "0.1em",
                      padding: "2px 6px",
                      borderRadius: "2px",
                    }}
                  >
                    GRATUIT
                  </span>
                )}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "20px",
                  color: "white",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {show.titre}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={10} style={{ color: "#FFB300" }} /> {formatDateRange(show.date, show.date_fin)}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={10} style={{ color: "#FFB300" }} /> {show.ville.split(" - ")[0]}
                </span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

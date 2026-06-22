"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  pays: string;
  image_url: string | null;
  gratuit: boolean;
  fed_logo?: string | null;
};

const monthNames = [
  "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
  "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE",
];

function formatDay(dateStr: string) {
  return new Date(dateStr).getDate();
}

function formatWeekday(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "short" }).toUpperCase();
}

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  return `${monthNames[parseInt(month)]} ${year}`;
}

export default function CalendrierClient() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [showsRes, fedsRes] = await Promise.all([
        supabase
          .from("shows")
          .select("*")
          .gte("date", today)
          .order("date", { ascending: true }),
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
      setLoading(false);
    }
    fetchData();
  }, []);

  // Group shows by month
  const grouped: Record<string, Show[]> = {};
  shows.forEach((show) => {
    const key = getMonthKey(show.date);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(show);
  });

  const monthKeys = Object.keys(grouped).sort();

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Titre */}
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
            CALENDRIER <span style={{ color: "#E8186D" }}>DES SHOWS</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {shows.length} SHOW{shows.length > 1 ? "S" : ""} À VENIR
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
          <div className="space-y-12">
            {monthKeys.map((monthKey) => (
              <div key={monthKey}>
                {/* En-tête du mois */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "20px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #252525",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "36px",
                      color: "#E8186D",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {getMonthLabel(monthKey)}
                  </h2>
                  <span
                    style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {grouped[monthKey].length} SHOW
                    {grouped[monthKey].length > 1 ? "S" : ""}
                  </span>
                </div>

                {/* Liste des shows du mois */}
                <div className="space-y-3">
                  {grouped[monthKey].map((show) => {
                    const img = show.image_url || show.fed_logo || null;
                    return (
                      <a
                        key={show.id}
                        href={`/show/${show.id}`}
                        style={{
                          display: "flex",
                          alignItems: "stretch",
                          gap: "16px",
                          padding: "12px",
                          background: "#161616",
                          border: "1px solid #252525",
                          borderRadius: "6px",
                          textDecoration: "none",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#FFB300";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#252525";
                        }}
                      >
                        {/* Date */}
                        <div
                          style={{
                            width: "70px",
                            minWidth: "70px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#0D0D0D",
                            border: "1px solid #E8186D",
                            borderRadius: "4px",
                            padding: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-pixel)",
                              fontSize: "7px",
                              color: "rgba(255,255,255,0.5)",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {formatWeekday(show.date)}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-bebas)",
                              fontSize: "32px",
                              color: "#E8186D",
                              lineHeight: 1,
                            }}
                          >
                            {formatDay(show.date)}
                          </span>
                        </div>

                        {/* Image */}
                        {img && (
                          <div
                            style={{
                              width: "90px",
                              minWidth: "90px",
                              height: "90px",
                              borderRadius: "4px",
                              overflow: "hidden",
                              background: "#111",
                            }}
                          >
                            <img
                              src={img}
                              alt={show.titre}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: show.image_url ? "cover" : "contain",
                                padding: show.image_url ? "0" : "8px",
                              }}
                            />
                          </div>
                        )}

                        {/* Infos */}
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                background: "#E8186D",
                                color: "white",
                                fontSize: "9px",
                                fontWeight: "700",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "2px 8px",
                                borderRadius: "2px",
                              }}
                            >
                              {show.federation}
                            </span>
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
                                }}
                              >
                                GRATUIT
                              </span>
                            )}
                          </div>
                          <h3
                            style={{
                              fontFamily: "var(--font-bebas)",
                              fontSize: "26px",
                              color: "white",
                              textTransform: "uppercase",
                              lineHeight: 1,
                            }}
                          >
                            {show.titre}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "rgba(255,255,255,0.5)",
                              fontSize: "12px",
                            }}
                          >
                            <MapPin size={12} style={{ color: "#E8186D" }} />
                            {show.ville}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#E8186D",
                          }}
                        >
                          <ArrowRight size={20} />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

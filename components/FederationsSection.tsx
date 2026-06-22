"use client";
import { useEffect, useState } from "react";
import { Zap, Star, ArrowRight, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Federation = {
  id: number;
  nom: string;
  logo_url: string | null;
  pays: string | null;
  shows_count?: number;
};

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  image_url: string | null;
  gratuit: boolean;
  fed_logo?: string | null;
  created_at?: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

export default function FederationsSection() {
  const [federations, setFederations] = useState<Federation[]>([]);
  const [recentShows, setRecentShows] = useState<Show[]>([]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [fedsRes, showsCountRes, recentRes, allFedsRes] = await Promise.all([
        supabase.from("federations").select("*").not("logo_url", "is", null).order("nom").limit(6),
        supabase.from("shows").select("federation").gte("date", today),
        supabase.from("shows").select("*").gte("date", today).order("created_at", { ascending: false }).limit(4),
        supabase.from("federations").select("nom, logo_url"),
      ]);

      const counts: Record<string, number> = {};
      if (showsCountRes.data) {
        showsCountRes.data.forEach((s) => {
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

      const fedsMap: Record<string, string | null> = {};
      if (allFedsRes.data) {
        allFedsRes.data.forEach((f) => {
          fedsMap[f.nom.toLowerCase()] = f.logo_url;
        });
      }

      if (recentRes.data) {
        setRecentShows(
          recentRes.data.map((s) => ({
            ...s,
            fed_logo: fedsMap[s.federation.toLowerCase()] || null,
          }))
        );
      }
    }
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col xl:flex-row gap-12">

        {/* Fédérations à Suivre */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FFB300] fill-[#FFB300]" />
              <span
                className="text-2xl uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Fédérations à Suivre
              </span>
            </h2>
            <a
              href="/federations"
              className="flex items-center gap-1.5 text-[#E8186D] hover:text-[#FFB300] hover:gap-3 transition-all cursor-pointer no-underline"
              style={{ fontFamily: "var(--font-pixel)", fontSize: "8px" }}
            >
              VOIR TOUT <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {federations.map((fed) => (
              <a
                key={fed.id}
                href={`/federations/${fed.id}`}
                className="rounded border border-[#252525] hover:border-[#FFB300] cursor-pointer transition-colors overflow-hidden block no-underline"
                style={{ background: "#161616" }}
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
                  {fed.logo_url && (
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
                          padding: "12px",
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
                  )}
                </div>
                <div className="p-2 border-t border-[#252525]">
                  <div
                    className="leading-none truncate"
                    style={{
                      fontFamily: "var(--font-bebas)",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    {fed.nom}
                  </div>
                  <div
                    className="text-[9px] mt-1"
                    style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "6px",
                      color: "#E8186D",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {fed.shows_count} SHOW{(fed.shows_count || 0) > 1 ? "S" : ""}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Derniers Ajouts */}
        <div className="xl:w-[44%]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFB300] fill-[#FFB300]" />
              <span
                className="text-2xl uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Derniers Ajouts
              </span>
            </h2>
            <a
              href="/calendrier"
              className="flex items-center gap-1.5 text-[#E8186D] hover:text-[#FFB300] hover:gap-3 transition-all cursor-pointer no-underline"
              style={{ fontFamily: "var(--font-pixel)", fontSize: "8px" }}
            >
              VOIR TOUTES <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recentShows.map((show) => {
              const img = show.image_url || show.fed_logo || null;
              return (
                <a
                  key={show.id}
                  href={`/show/${show.id}`}
                  className="rounded border border-[#E8186D] hover:border-[#FFB300] cursor-pointer transition-colors overflow-hidden block no-underline"
                  style={{ background: "#161616", position: "relative" }}
                >
                  {img && (
                    <div className="absolute inset-0">
                      <img
                        src={img}
                        alt={show.titre}
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, #161616 40%, transparent 100%)",
                        }}
                      />
                    </div>
                  )}
                  <div className="relative p-3">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span
                        className="inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
                        style={{ backgroundColor: "#E8186D", color: "white" }}
                      >
                        {show.federation}
                      </span>
                      {show.gratuit && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-sm"
                          style={{
                            backgroundColor: "#10B981",
                            color: "white",
                            fontFamily: "var(--font-pixel)",
                            fontSize: "6px",
                            letterSpacing: "0.1em",
                          }}
                        >
                          GRATUIT
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-base leading-none text-white mb-2"
                      style={{ fontFamily: "var(--font-bebas)", fontSize: "18px" }}
                    >
                      {show.titre}
                    </h3>
                    <div className="text-[10px] text-white/35 leading-relaxed flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3" /> {show.ville.split(" - ")[0]}
                    </div>
                    <div className="text-[10px] text-white/35 leading-relaxed flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(show.date)}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

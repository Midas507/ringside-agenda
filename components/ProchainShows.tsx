"use client";
import { useEffect, useState } from "react";
import { Star, Calendar, MapPin, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  pays: string;
  image_url: string | null;
  gratuit: boolean;
};

type Federation = {
  nom: string;
  logo_url: string | null;
  couleur: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export default function ProchainShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [federations, setFederations] = useState<Record<string, Federation>>({});

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [showsRes, fedsRes] = await Promise.all([
        supabase
          .from("shows")
          .select("*")
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(4),
        supabase
          .from("federations")
          .select("nom, logo_url, couleur"),
      ]);

      if (showsRes.data) setShows(showsRes.data);

      if (fedsRes.data) {
        const fedsMap: Record<string, Federation> = {};
        fedsRes.data.forEach((f) => {
          fedsMap[f.nom.toLowerCase()] = f;
        });
        setFederations(fedsMap);
      }
    }
    fetchData();
  }, []);

  const placeholders = Array(Math.max(0, 4 - shows.length)).fill(null);

  return (
    <section className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2">
          <Star className="w-5 h-5 text-[#FFB300] fill-[#FFB300]" />
          <span
            className="text-xl uppercase tracking-wider text-white"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Prochains Shows
          </span>
        </h2>
       <a href="/calendrier"
          className="flex items-center gap-1.5 text-[#E8186D] hover:text-[#FFB300] hover:gap-3 transition-all cursor-pointer no-underline"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "8px" }}
        >
          VOIR TOUS LES ÉVÉNEMENTS <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {shows.map((show) => {
          const fed = federations[show.federation.toLowerCase()];
          const fedColor = fed?.couleur || "#E8186D";
          const logoUrl = show.image_url || fed?.logo_url || null;
          const titleWords = show.titre.split(" ");
          const mid = Math.ceil(titleWords.length / 2);
          const titleLine1 = titleWords.slice(0, mid).join(" ");
          const titleLine2 = titleWords.slice(mid).join(" ");

          return (
            <a
              key={show.id}
              href={`/show/${show.id}`}
              className="relative bg-[#161616] border border-[#E8186D] rounded overflow-hidden cursor-pointer hover:border-[#FFB300] transition-colors block no-underline"
            >
              {logoUrl && (
                <div className="absolute inset-0">
                  <img
                    src={logoUrl}
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

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 80% 100%, ${fedColor}22, transparent 70%)`,
                }}
              />

              <div className="relative p-3 h-[130px] flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
                      style={{ backgroundColor: fedColor, color: "white" }}
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
                    className="text-2xl leading-none uppercase text-white"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {titleLine1}
                    <br />
                    <span style={{ color: fedColor }}>{titleLine2}</span>
                  </h3>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 text-white/40 text-[9px] mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(show.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {show.ville}
                    </span>
                  </div>
                  <span className="text-[#E8186D] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                    INFOS <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          );
        })}

        {placeholders.map((_, i) => (
          <div
            key={`empty-${i}`}
            className="relative bg-[#161616] border border-[#252525] rounded overflow-hidden h-[130px] flex items-center justify-center"
          >
            <span
              className="text-white/20 uppercase"
              style={{ fontFamily: "var(--font-pixel)", fontSize: "7px" }}
            >
              Bientôt...
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

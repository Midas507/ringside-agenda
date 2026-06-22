"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogoMark } from "./Logo";
import { Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  pays: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  description: string | null;
  lien_billetterie: string | null;
  fed_logo?: string | null;
};

type Federation = {
  nom: string;
  logo_url: string | null;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export default function CarteClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selected, setSelected] = useState<Show | null>(null);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];
      const [showsRes, fedsRes] = await Promise.all([
        supabase
          .from("shows")
          .select("*")
          .gte("date", today)
          .not("latitude", "is", null)
          .order("date", { ascending: true }),
        supabase.from("federations").select("nom, logo_url"),
      ]);
      if (showsRes.data && fedsRes.data) {
        const fedsMap: Record<string, string | null> = {};
        fedsRes.data.forEach((f: Federation) => {
          fedsMap[f.nom.toLowerCase()] = f.logo_url;
        });
        const enrichedShows = showsRes.data.map((s) => ({
          ...s,
          fed_logo: fedsMap[s.federation.toLowerCase()] || null,
        }));
        setShows(enrichedShows);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;
    const L = require("leaflet");
    require("leaflet/dist/leaflet.css");
    const map = L.map(mapRef.current, {
      center: [46.5, 3],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 20, subdomains: "abcd" }
    ).addTo(map);
    fetch("/geodata/countries.geojson")
      .then((r) => r.json())
      .then((data) => {
        L.geoJSON(data, {
          style: { color: "#E8186D", weight: 1.5, fill: false, opacity: 0.9 },
        }).addTo(map);
      });
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || shows.length === 0) return;
    const L = require("leaflet");
    const map = mapInstanceRef.current;
    shows.forEach((show) => {
      const cityLabel = show.ville.split(" - ")[0].toUpperCase();
      const pinIcon = L.divIcon({
        className: "",
        html:
          '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;">' +
          '<div style="width:14px;height:14px;background:#E8186D;border:2px solid white;border-radius:50%;box-shadow:0 0 10px rgba(232,24,109,1);"></div>' +
          '<div style="font-family:Inter,sans-serif;font-size:9px;font-weight:700;color:white;letter-spacing:0.5px;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,1);background:rgba(13,13,13,0.8);padding:2px 5px;border-radius:3px;border:1px solid rgba(232,24,109,0.4);">' +
          cityLabel +
          "</div></div>",
        iconAnchor: [7, 7],
      });
      const marker = L.marker([show.latitude, show.longitude], {
        icon: pinIcon,
      });
      marker.on("click", () => setSelected(show));
      marker.addTo(map);
    });
  }, [shows]);

  const imageUrl = selected?.image_url || selected?.fed_logo || null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0D0D0D",
      }}
    >
      {/* Header DESKTOP */}
      <div
        className="hidden md:flex"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#0D0D0D",
          borderBottom: "1px solid #252525",
          zIndex: 1000,
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <LogoMark size={36} />
        </a>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "28px",
            color: "white",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Carte des <span style={{ color: "#E8186D" }}>Shows</span>
        </h1>
        <a
          href="/"
          style={{
            color: "#FFB300",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          ← Retour à l'accueil
        </a>
      </div>

      {/* Header MOBILE - 2 lignes */}
      <div
        className="flex md:hidden"
        style={{
          flexDirection: "column",
          background: "#0D0D0D",
          borderBottom: "1px solid #252525",
          zIndex: 1000,
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
        }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <LogoMark size={30} />
          </a>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "#FFB300",
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={12} /> Accueil
          </a>
        </div>
        <div style={{
          padding: "8px 16px 12px",
          borderTop: "1px solid #1a1a1a",
        }}>
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "white",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Carte des <span style={{ color: "#E8186D" }}>Shows</span>
          </h1>
        </div>
      </div>

      {/* Map + Panel */}
      <div style={{ flex: 1, display: "flex", position: "relative" }}>
        <div ref={mapRef} style={{ flex: 1, height: "100%" }} />

        {/* Selected show panel */}
        {selected && (
          <div
            className="show-panel"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "#161616",
              border: "1px solid #E8186D",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 1000,
              boxShadow: "0 0 30px rgba(232,24,109,0.2)",
              maxHeight: "calc(100% - 32px)",
              overflowY: "auto",
            }}
          >
            {imageUrl && (
              <div
                style={{
                  position: "relative",
                  height: "160px",
                  overflow: "hidden",
                  background: "#111",
                }}
              >
                <img
                  src={imageUrl}
                  alt={selected.titre}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: selected.image_url ? "none" : "brightness(0.6)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, #161616 0%, transparent 60%)",
                  }}
                />
              </div>
            )}

            <div style={{ padding: "16px" }}>
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
                  marginBottom: "8px",
                }}
              >
                {selected.federation}
              </span>

              <h2
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "28px",
                  lineHeight: 1,
                  color: "white",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                {selected.titre}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "12px",
                  }}
                >
                  <Calendar size={13} style={{ color: "#E8186D" }} />
                  {formatDate(selected.date)}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "12px",
                  }}
                >
                  <MapPin size={13} style={{ color: "#E8186D" }} />
                  {selected.ville}
                </div>
              </div>

              {selected.description && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "11px",
                    lineHeight: 1.7,
                    marginBottom: "16px",
                  }}
                >
                  {selected.description.substring(0, 200)}...
                </p>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={`/show/${selected.id}`}
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "#E8186D",
                    color: "white",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "700",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "10px",
                    borderRadius: "2px",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={12} /> Voir le show
                </a>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    padding: "10px 14px",
                    background: "transparent",
                    border: "1px solid #252525",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "10px",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            background: "rgba(13,13,13,0.9)",
            border: "1px solid #252525",
            borderRadius: "6px",
            padding: "8px 14px",
            zIndex: 1000,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "#E8186D",
              letterSpacing: "0.1em",
            }}
          >
            {shows.length} SHOW{shows.length > 1 ? "S" : ""} À VENIR
          </span>
        </div>
      </div>

      <style>{`
        .show-panel {
          width: 320px;
        }
        @media (max-width: 640px) {
          .show-panel {
            width: calc(100% - 32px);
            left: 16px;
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}

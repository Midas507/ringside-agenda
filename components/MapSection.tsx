"use client";
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

const staticCities = [
  { name: "NANTES",     lat: 47.22, lng: -1.55 },
  { name: "BORDEAUX",   lat: 44.84, lng: -0.58 },
  { name: "LILLE",      lat: 50.63, lng: 3.06  },
  { name: "BRUXELLES",  lat: 50.85, lng: 4.35  },
  { name: "NANCY",      lat: 48.69, lng: 6.18  },
  { name: "STRASBOURG", lat: 48.57, lng: 7.75  },
  { name: "LYON",       lat: 45.75, lng: 4.83  },
  { name: "GENÈVE",     lat: 46.2,  lng: 6.14  },
  { name: "MARSEILLE",  lat: 43.3,  lng: 5.37  },
  { name: "PARIS",      lat: 48.85, lng: 2.35  },
  { name: "RENNES",     lat: 48.11, lng: -1.68 },
  { name: "BREST",      lat: 48.39, lng: -4.49 },
  { name: "CAEN",       lat: 49.18, lng: -0.37 },
];

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    const L = require("leaflet");
    require("leaflet/dist/leaflet.css");

    const map = L.map(mapRef.current, {
      center: [47.5, 6],
      zoom: 5,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
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
          style: {
            color: "#E8186D",
            weight: 1.5,
            fill: false,
            opacity: 0.9,
          },
        }).addTo(map);
      })
      .catch((e) => console.error("GeoJSON error:", e));

    const pinIcon = (name: string) =>
      L.divIcon({
        className: "",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
            <div style="
              width:10px;height:10px;
              background:#E8186D;
              border:2px solid white;
              border-radius:50%;
              box-shadow:0 0 8px rgba(232,24,109,0.9);
            "></div>
            <div style="
              font-family:Inter,sans-serif;
              font-size:8px;
              font-weight:700;
              color:white;
              letter-spacing:0.5px;
              white-space:nowrap;
              text-shadow:0 0 4px rgba(0,0,0,0.8);
            ">${name}</div>
          </div>
        `,
        iconAnchor: [5, 5],
      });

    staticCities.forEach((city) => {
      L.marker([city.lat, city.lng], { icon: pinIcon(city.name) }).addTo(map);
    });
  }, []);

  return (
    <section style={{ background: "#0a0a0a", padding: "0 0 16px" }}>
      <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          border: "1px solid #E8186D",
          borderRadius: "6px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          minHeight: "300px",
        }}>

          {/* Texte gauche */}
          <div style={{
            width: "320px",
            minWidth: "320px",
            padding: "28px 20px",
            background: "#0a0a0a",
            zIndex: 2,
          }}>
            <h2 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "34px",
              lineHeight: 0.95,
              textTransform: "uppercase",
              color: "white",
              marginBottom: "14px",
            }}>
              TROUVE UN SHOW<br />
              <span style={{ color: "#E8186D" }}>PRÈS DE CHEZ TOI</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 2.2,
              marginBottom: "24px",
            }}>
              Explore la carte<br />
              et découvre les<br />
              événements autour<br />
              de toi.
            </p>

      
        <a href="/carte"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "2px solid #FFB300",
                color: "#FFB300",
                background: "transparent",
                fontFamily: "Inter, sans-serif",
                fontWeight: "700",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "11px 16px",
                borderRadius: "2px",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector(".map-icon") as HTMLElement;
                if (icon) icon.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector(".map-icon") as HTMLElement;
                if (icon) icon.style.transform = "translateY(0px)";
              }}
            >
              <span
                className="map-icon"
                style={{ display: "inline-flex", transition: "transform 0.2s" }}
              >
                <MapPin size={13} />
              </span>
              OUVRIR LA CARTE
            </a>
          </div>

          {/* Carte Leaflet */}
          <div style={{ flex: 1, position: "relative", minHeight: "300px" }}>
            <div
              ref={mapRef}
              style={{ width: "100%", height: "100%", minHeight: "300px" }}
            />
            {/* Fading gauche */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0,
              width: "120px",
              background: "linear-gradient(to right, #0a0a0a 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 400,
            }} />
          </div>

        </div>
      </div>
    </section>
  );
}
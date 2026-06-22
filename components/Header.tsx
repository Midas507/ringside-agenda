"use client";
import { useEffect, useState } from "react";
import { Search, User, X, Calendar, MapPin, Star, Menu } from "lucide-react";
import { LogoMark } from "./Logo";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "ACCUEIL", href: "/" },
  { label: "CALENDRIER", href: "/calendrier" },
  { label: "CARTE", href: "/carte" },
  { label: "FÉDÉRATIONS", href: "/federations" },
  { label: "À PROPOS", href: "/a-propos" },
];

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
};

type Federation = {
  id: number;
  nom: string;
  pays: string | null;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shows, setShows] = useState<Show[]>([]);
  const [federations, setFederations] = useState<Federation[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];
      const [showsRes, fedsRes] = await Promise.all([
        supabase.from("shows").select("id, titre, federation, date, ville").gte("date", today).order("date"),
        supabase.from("federations").select("id, nom, pays").order("nom"),
      ]);
      if (showsRes.data) setShows(showsRes.data);
      if (fedsRes.data) setFederations(fedsRes.data);
    }
    fetchData();
  }, [searchOpen]);

  // Empêche le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const q = query.toLowerCase().trim();
  const filteredShows = q
    ? shows.filter(s =>
        s.titre.toLowerCase().includes(q) ||
        s.federation.toLowerCase().includes(q) ||
        s.ville.toLowerCase().includes(q)
      ).slice(0, 8)
    : [];
  const filteredFeds = q
    ? federations.filter(f => f.nom.toLowerCase().includes(q)).slice(0, 6)
    : [];

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <a href="/" className="no-underline">
            <LogoMark />
          </a>

          {/* Menu desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-bold text-[13px] tracking-widest transition-colors cursor-pointer text-white hover:text-[#E8186D] no-underline"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="bg-transparent border-none cursor-pointer p-0"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            </button>
            <a
              href={loggedIn ? "/mon-compte" : "/connexion"}
              className="bg-transparent border-none cursor-pointer p-0 no-underline"
              aria-label="Mon compte"
            >
              <User className={`w-5 h-5 transition-colors ${loggedIn ? "text-[#E8186D] hover:text-[#FFB300]" : "text-white/60 hover:text-white"}`} />
            </a>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden bg-transparent border-none cursor-pointer p-0"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header du menu mobile */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #252525",
          }}>
            <LogoMark />
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "4px",
              }}
              aria-label="Fermer"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation */}
          <nav style={{
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            gap: "4px",
            flex: 1,
          }}>
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "32px",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  padding: "16px 12px",
                  borderBottom: "1px solid #1a1a1a",
                  transition: "color 0.2s, padding-left 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#E8186D";
                  e.currentTarget.style.paddingLeft = "20px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.paddingLeft = "12px";
                }}
              >
                {label}
              </a>
            ))}

            {/* Lien Mon compte/Connexion en bas */}
            <a
              href={loggedIn ? "/mon-compte" : "/connexion"}
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: "24px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: loggedIn ? "#E8186D" : "transparent",
                color: loggedIn ? "white" : "#E8186D",
                border: "2px solid #E8186D",
                padding: "16px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <User size={16} /> {loggedIn ? "Mon Compte" : "Se Connecter"}
            </a>
          </nav>

          {/* Footer du menu mobile */}
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid #252525",
            textAlign: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
            }}>
              &gt;&gt; RINGSIDE AGENDA &lt;&lt;
            </span>
          </div>
        </div>
      )}

      {/* Popup Recherche */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "80px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "640px",
              background: "#161616",
              border: "1px solid #E8186D",
              borderRadius: "8px",
              padding: "0",
              margin: "0 20px",
              maxHeight: "75vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #252525" }}>
              <Search size={18} style={{ color: "#E8186D", marginRight: "12px", flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un show, une fédération, une ville..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {!q && (
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <p style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                  }}>
                    &gt;&gt; COMMENCE À TAPER POUR RECHERCHER &lt;&lt;
                  </p>
                </div>
              )}

              {q && filteredFeds.length === 0 && filteredShows.length === 0 && (
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <p style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                  }}>
                    &gt;&gt; AUCUN RÉSULTAT POUR "{query}" &lt;&lt;
                  </p>
                </div>
              )}

              {filteredFeds.length > 0 && (
                <div style={{ padding: "12px 0" }}>
                  <h3 style={{
                    padding: "0 20px",
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}>
                    FÉDÉRATIONS ({filteredFeds.length})
                  </h3>
                  {filteredFeds.map((fed) => (
                    <a
                      key={`fed-${fed.id}`}
                      href={`/federations/${fed.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 20px",
                        textDecoration: "none",
                        color: "white",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#1f1f1f"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <Star size={14} style={{ color: "#FFB300" }} />
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: "18px" }}>{fed.nom}</span>
                      <span style={{ marginLeft: "auto", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{fed.pays}</span>
                    </a>
                  ))}
                </div>
              )}

              {filteredShows.length > 0 && (
                <div style={{ padding: "12px 0", borderTop: filteredFeds.length > 0 ? "1px solid #252525" : "none" }}>
                  <h3 style={{
                    padding: "0 20px",
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}>
                    SHOWS ({filteredShows.length})
                  </h3>
                  {filteredShows.map((show) => (
                    <a
                      key={`show-${show.id}`}
                      href={`/show/${show.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 20px",
                        textDecoration: "none",
                        color: "white",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#1f1f1f"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                          <span style={{
                            fontSize: "9px",
                            color: "#E8186D",
                            fontWeight: "700",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}>
                            {show.federation}
                          </span>
                        </div>
                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", lineHeight: 1 }}>
                          {show.titre}
                        </div>
                        <div style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "3px",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.5)",
                        }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            <Calendar size={10} /> {formatDate(show.date)}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            <MapPin size={10} /> {show.ville}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

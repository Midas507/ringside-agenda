"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, Star, Calendar, MapPin, ArrowRight } from "lucide-react";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  image_url: string | null;
  gratuit: boolean;
};

type Federation = {
  id: number;
  nom: string;
  logo_url: string | null;
  pays: string | null;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

export default function MyFavorites() {
  const [followedFeds, setFollowedFeds] = useState<Federation[]>([]);
  const [favoriteShows, setFavoriteShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const today = new Date().toISOString().split("T")[0];

      const [followsRes, favsRes] = await Promise.all([
        supabase
          .from("user_followed_federations")
          .select("federation_id, federations(*)")
          .eq("user_id", session.user.id),
        supabase
          .from("user_favorite_shows")
          .select("show_id, shows(*)")
          .eq("user_id", session.user.id),
      ]);

      if (followsRes.data) {
        setFollowedFeds(followsRes.data.map((f: any) => f.federations).filter(Boolean));
      }
      if (favsRes.data) {
        const shows = favsRes.data
          .map((f: any) => f.shows)
          .filter(Boolean)
          .filter((s: Show) => s.date >= today)
          .sort((a: Show, b: Show) => a.date.localeCompare(b.date));
        setFavoriteShows(shows);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
        Chargement de tes favoris...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Shows favoris */}
      <div style={{
        padding: "24px",
        background: "#161616",
        border: "1px solid #252525",
        borderRadius: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Star size={18} style={{ color: "#FFB300" }} fill="#FFB300" />
          <h3 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            Mes shows sauvegardés ({favoriteShows.length})
          </h3>
        </div>

        {favoriteShows.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontStyle: "italic" }}>
            Aucun show sauvegardé pour le moment. Clique sur ⭐ sur un show pour le retrouver ici !
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {favoriteShows.map((show) => (
              <a
                key={show.id}
                href={`/show/${show.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  background: "#0D0D0D",
                  border: "1px solid #252525",
                  borderRadius: "4px",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FFB300"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#252525"; }}
              >
                {show.image_url && (
                  <div style={{ width: "60px", height: "60px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                    <img src={show.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "9px", color: "#E8186D", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
                    {show.federation}
                  </div>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "white", lineHeight: 1, marginBottom: "4px" }}>
                    {show.titre}
                  </div>
                  <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <Calendar size={10} /> {formatDate(show.date)}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <MapPin size={10} /> {show.ville.split(" - ")[0]}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: "#FFB300", flexShrink: 0 }} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Promotions suivies */}
      <div style={{
        padding: "24px",
        background: "#161616",
        border: "1px solid #252525",
        borderRadius: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Heart size={18} style={{ color: "#E8186D" }} fill="#E8186D" />
          <h3 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            Promotions suivies ({followedFeds.length})
          </h3>
        </div>

        {followedFeds.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontStyle: "italic" }}>
            Tu ne suis aucune fédération. Clique sur ❤️ sur la page d'une fédération pour la suivre !
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
            {followedFeds.map((fed) => (
              <a
                key={fed.id}
                href={`/federations/${fed.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "12px",
                  background: "#0D0D0D",
                  border: "1px solid #252525",
                  borderRadius: "4px",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E8186D"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#252525"; }}
              >
                {fed.logo_url && (
                  <div style={{ width: "60px", height: "60px", marginBottom: "8px" }}>
                    <img src={fed.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                )}
                <div style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "14px",
                  color: "white",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}>
                  {fed.nom}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

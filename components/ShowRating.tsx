"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

export default function ShowRating({ showId }: { showId: number }) {
  const [userRating, setUserRating] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [showId]);

  async function loadData() {
    // Récupérer toutes les notes pour calculer la moyenne
    const { data: allRatings } = await supabase
      .from("show_ratings")
      .select("rating")
      .eq("show_id", showId);

    if (allRatings && allRatings.length > 0) {
      const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
      setAvgRating(total / allRatings.length);
      setTotalRatings(allRatings.length);
    } else {
      setAvgRating(0);
      setTotalRatings(0);
    }

    // Vérifier si l'utilisateur est connecté et a noté
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setLoggedIn(true);
      const { data: myRating } = await supabase
        .from("show_ratings")
        .select("rating")
        .eq("show_id", showId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (myRating) setUserRating(myRating.rating);
    }
    setLoading(false);
  }

  async function rate(stars: number) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }

    // Si on clique sur la note actuelle, on la retire
    if (stars === userRating) {
      await supabase
        .from("show_ratings")
        .delete()
        .eq("show_id", showId)
        .eq("user_id", session.user.id);
      setUserRating(0);
    } else {
      await supabase
        .from("show_ratings")
        .upsert({
          show_id: showId,
          user_id: session.user.id,
          rating: stars,
        }, { onConflict: "show_id,user_id" });
      setUserRating(stars);
    }

    loadData();
  }

  if (loading) return null;

  const displayValue = hoveredStar || userRating;

  return (
    <div style={{
      padding: "20px 24px",
      background: "#161616",
      border: "1px solid #FFB300",
      borderRadius: "8px",
      marginTop: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        {/* Moyenne globale */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.1em",
            marginBottom: "8px",
          }}>
            NOTE MOYENNE
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "42px",
              color: "white",
              lineHeight: 1,
            }}>
              {totalRatings > 0 ? avgRating.toFixed(1) : "—"}
              <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.4)" }}>/5</span>
            </div>
            <div>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    style={{
                      color: s <= Math.round(avgRating) ? "#FFB300" : "#252525",
                      fill: s <= Math.round(avgRating) ? "#FFB300" : "transparent",
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
                {totalRatings} vote{totalRatings > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Ma note */}
        <div>
          <h4 style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.1em",
            marginBottom: "8px",
            textAlign: "right",
          }}>
            {loggedIn ? "MA NOTE" : "CONNECTE-TOI POUR NOTER"}
          </h4>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => rate(s)}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  transition: "transform 0.15s",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.85)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <Star
                  size={28}
                  style={{
                    color: s <= displayValue ? "#FFB300" : "rgba(255,255,255,0.2)",
                    fill: s <= displayValue ? "#FFB300" : "transparent",
                    transition: "all 0.15s",
                  }}
                />
              </button>
            ))}
          </div>
          {loggedIn && userRating > 0 && (
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px", textAlign: "right" }}>
              Clique sur ta note pour la retirer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

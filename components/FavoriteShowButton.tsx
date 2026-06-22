"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

export default function FavoriteShowButton({ showId }: { showId: number }) {
  const [favorite, setFavorite] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }
      setLoggedIn(true);

      const { data } = await supabase
        .from("user_favorite_shows")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("show_id", showId)
        .maybeSingle();

      setFavorite(!!data);
      setLoading(false);
    }
    check();
  }, [showId]);

  async function toggle() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }

    if (favorite) {
      await supabase
        .from("user_favorite_shows")
        .delete()
        .eq("user_id", session.user.id)
        .eq("show_id", showId);
      setFavorite(false);
    } else {
      await supabase
        .from("user_favorite_shows")
        .insert({ user_id: session.user.id, show_id: showId });
      setFavorite(true);
    }
  }

  if (loading) return null;

  return (
    <button
      onClick={toggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: favorite ? "#FFB300" : "transparent",
        color: favorite ? "black" : "#FFB300",
        border: "1px solid #FFB300",
        padding: "8px 14px",
        borderRadius: "3px",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <Star size={13} fill={favorite ? "black" : "none"} />
      {!loggedIn ? "Se connecter pour sauvegarder" : favorite ? "Sauvegardé" : "Sauvegarder"}
    </button>
  );
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, HeartOff } from "lucide-react";

export default function FollowFederationButton({ federationId }: { federationId: number }) {
  const [following, setFollowing] = useState(false);
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
        .from("user_followed_federations")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("federation_id", federationId)
        .maybeSingle();

      setFollowing(!!data);
      setLoading(false);
    }
    check();
  }, [federationId]);

  async function toggle() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }

    if (following) {
      await supabase
        .from("user_followed_federations")
        .delete()
        .eq("user_id", session.user.id)
        .eq("federation_id", federationId);
      setFollowing(false);
    } else {
      await supabase
        .from("user_followed_federations")
        .insert({ user_id: session.user.id, federation_id: federationId });
      setFollowing(true);
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
        background: following ? "#E8186D" : "transparent",
        color: following ? "white" : "#E8186D",
        border: "1px solid #E8186D",
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
      <Heart size={13} fill={following ? "white" : "none"} />
      {!loggedIn ? "Se connecter pour suivre" : following ? "Suivi" : "Suivre"}
    </button>
  );
}

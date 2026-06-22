"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { User, LogOut, Heart, Megaphone, Settings, Crown, Bell, Check } from "lucide-react";
import MyFavorites from "./MyFavorites";

type Profile = {
  id: string;
  email: string;
  pseudo: string | null;
  role: "fan" | "promotion" | "admin";
  promotion_validated: boolean;
  federation_id: number | null;
  email_notifications: boolean;
};

export default function MonCompte() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/connexion");
      return;
    }

    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  }

  async function toggleNewsletter() {
    if (!profile || updating) return;
    setUpdating(true);
    const newValue = !profile.email_notifications;

    const { error } = await supabase
      .from("user_profiles")
      .update({ email_notifications: newValue })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, email_notifications: newValue });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setUpdating(false);
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "#E8186D" }}>CHARGEMENT...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) return null;

  const roleLabels = {
    fan: { label: "FAN", icon: <Heart size={14} />, color: "#E8186D" },
    promotion: { label: "PROMOTION", icon: <Megaphone size={14} />, color: "#FFB300" },
    admin: { label: "ADMIN", icon: <Crown size={14} />, color: "#10B981" },
  };

  const r = roleLabels[profile.role];

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
        {/* En-tête profil */}
        <div style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #E8186D",
          borderRadius: "8px",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(232,24,109,0.15)",
              border: "2px solid #E8186D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <User size={32} style={{ color: "#E8186D" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: `${r.color}22`, border: `1px solid ${r.color}`, borderRadius: "3px", marginBottom: "8px" }}>
                {r.icon}
                <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: r.color, letterSpacing: "0.1em" }}>
                  {r.label}
                </span>
              </div>
              <h1 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "42px",
                color: "white",
                textTransform: "uppercase",
                lineHeight: 1,
              }}>
                {profile.pseudo || "Sans pseudo"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Statut Promotion */}
        {profile.role === "promotion" && !profile.promotion_validated && (
          <div style={{
            padding: "20px 24px",
            background: "rgba(255,179,0,0.08)",
            border: "1px solid #FFB300",
            borderRadius: "8px",
            marginBottom: "20px",
          }}>
            <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#FFB300", textTransform: "uppercase", marginBottom: "6px" }}>
              ⏳ Validation en cours
            </h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", lineHeight: 1.6 }}>
              Ton compte Promotion est en attente de validation manuelle. Nous t'enverrons un email dès qu'il sera validé (sous 24-48h en général).
            </p>
          </div>
        )}

        {/* Liens admin pour les admins */}
        {profile.role === "admin" && (
          <div style={{
            padding: "20px 24px",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid #10B981",
            borderRadius: "8px",
            marginBottom: "20px",
          }}>
            <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#10B981", textTransform: "uppercase", marginBottom: "10px" }}>
              👑 Espace Admin
            </h3>
            <a href="/admin" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "#10B981",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              <Settings size={12} /> Accéder au panneau admin
            </a>
          </div>
        )}

        {/* Lien promoteur pour les promotions validées */}
        {profile.role === "promotion" && profile.promotion_validated && (
          <div style={{
            padding: "20px 24px",
            background: "rgba(255,179,0,0.08)",
            border: "1px solid #FFB300",
            borderRadius: "8px",
            marginBottom: "20px",
          }}>
            <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#FFB300", textTransform: "uppercase", marginBottom: "10px" }}>
              📣 Espace Promoteur
            </h3>
            <a href="/promoteur/dashboard" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "#FFB300",
              color: "black",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              📊 Accéder à mon dashboard
            </a>
          </div>
        )}

        {/* Préférences de notification */}
        <div style={{
          padding: "20px 24px",
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Bell size={18} style={{ color: "#FFB300" }} />
            <h3 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              Notifications par email
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>
                Newsletter mensuelle
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                Reçois les actus du catch francophone et les shows du mois directement par mail.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {saved && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  color: "#10B981",
                  fontWeight: "700",
                }}>
                  <Check size={12} /> Enregistré
                </span>
              )}
              <button
                onClick={toggleNewsletter}
                disabled={updating}
                style={{
                  position: "relative",
                  width: "52px",
                  height: "28px",
                  borderRadius: "14px",
                  background: profile.email_notifications ? "#E8186D" : "#252525",
                  border: "none",
                  cursor: updating ? "wait" : "pointer",
                  transition: "background 0.2s",
                  padding: 0,
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "3px",
                  left: profile.email_notifications ? "27px" : "3px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Favoris pour les fans et admins */}
        {(profile.role === "fan" || profile.role === "admin") && (
          <MyFavorites />
        )}

        {/* Bouton déconnexion */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              color: "#E8186D",
              border: "1px solid #E8186D",
              padding: "12px 24px",
              borderRadius: "4px",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

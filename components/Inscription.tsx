"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Mail, Lock, AtSign, AlertCircle, CheckCircle, Megaphone, Heart, Bell } from "lucide-react";

export default function Inscription() {
  const router = useRouter();
  const [role, setRole] = useState<"fan" | "promotion">("fan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères");
      setLoading(false);
      return;
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Mettre à jour le pseudo et les préférences newsletter
    if (data.user) {
      await supabase
        .from("user_profiles")
        .update({
          pseudo: pseudo || null,
          email_notifications: newsletter,
        })
        .eq("id", data.user.id);
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/mon-compte");
    }, 2000);
  }

  if (success) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <CheckCircle size={64} style={{ color: "#10B981", margin: "0 auto 16px" }} />
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "36px", color: "white", textTransform: "uppercase", marginBottom: "8px" }}>
              Inscription <span style={{ color: "#10B981" }}>réussie</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              Bienvenue sur Ringside Agenda !
            </p>
            <p style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
              REDIRECTION EN COURS...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 40px" }}>
        <div style={{
          width: "100%",
          maxWidth: "480px",
          background: "#161616",
          border: "1px solid #E8186D",
          borderRadius: "8px",
          padding: "40px 32px",
        }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "42px",
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "6px",
            }}>
              INSCRIPTION
            </h1>
            <p style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
            }}>
              &gt;&gt; REJOINS LA COMMUNAUTÉ &lt;&lt;
            </p>
          </div>

          {/* Choix Fan / Promotion */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
            <button
              type="button"
              onClick={() => setRole("fan")}
              style={{
                padding: "16px 12px",
                background: role === "fan" ? "rgba(232,24,109,0.15)" : "#0D0D0D",
                border: `1px solid ${role === "fan" ? "#E8186D" : "#252525"}`,
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <Heart size={20} style={{ color: role === "fan" ? "#E8186D" : "rgba(255,255,255,0.4)", margin: "0 auto 6px", display: "block" }} />
              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "16px",
                color: role === "fan" ? "white" : "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                Je suis Fan
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                Suivre les shows
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("promotion")}
              style={{
                padding: "16px 12px",
                background: role === "promotion" ? "rgba(255,179,0,0.15)" : "#0D0D0D",
                border: `1px solid ${role === "promotion" ? "#FFB300" : "#252525"}`,
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <Megaphone size={20} style={{ color: role === "promotion" ? "#FFB300" : "rgba(255,255,255,0.4)", margin: "0 auto 6px", display: "block" }} />
              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "16px",
                color: role === "promotion" ? "white" : "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                Je suis Promo
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                Gérer ma fédération
              </div>
            </button>
          </div>

          {role === "promotion" && (
            <div style={{
              padding: "10px 12px",
              background: "rgba(255,179,0,0.08)",
              border: "1px solid #FFB300",
              borderRadius: "4px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "20px",
              lineHeight: 1.5,
            }}>
              💡 Ton compte Promotion sera validé manuellement par notre équipe sous 24-48h. Tu pourras ensuite gérer tes shows.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <Label icon={<AtSign size={11} />}>Pseudo</Label>
              <input
                type="text"
                required
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                style={inputStyle}
                placeholder="MonPseudo"
              />
            </div>

            <div>
              <Label icon={<Mail size={11} />}>Email</Label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="email@exemple.com"
              />
            </div>

            <div>
              <Label icon={<Lock size={11} />}>Mot de passe (6 caractères min)</Label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>

            {/* Newsletter */}
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px 14px",
              background: newsletter ? "rgba(232,24,109,0.05)" : "#0D0D0D",
              border: `1px solid ${newsletter ? "#E8186D" : "#252525"}`,
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                style={{ marginTop: "2px", cursor: "pointer" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <Bell size={12} style={{ color: "#FFB300" }} />
                  <span style={{ fontSize: "13px", color: "white", fontWeight: "600" }}>
                    Recevoir les actus du catch francophone
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  Newsletter mensuelle avec les shows du mois, les nouveautés et les annonces des fédérations.
                </p>
              </div>
            </label>

            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                borderRadius: "4px",
                color: "#E8186D",
                fontSize: "12px",
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#888" : "#E8186D",
                color: "white",
                fontFamily: "Inter, sans-serif",
                fontWeight: "700",
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "14px",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "4px",
              }}
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Déjà un compte ?{" "}
            <a href="/connexion" style={{ color: "#FFB300", textDecoration: "none", fontWeight: "700" }}>
              Connexion
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Label({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-pixel)",
      fontSize: "7px",
      color: "rgba(255,255,255,0.5)",
      letterSpacing: "0.1em",
      marginBottom: "8px",
      textTransform: "uppercase",
    }}>
      {icon} {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0D0D0D",
  border: "1px solid #252525",
  color: "white",
  fontSize: "14px",
  padding: "12px 14px",
  borderRadius: "4px",
  outline: "none",
};

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function Connexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/mon-compte");
  }

  return (
    <>
      <Header />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 40px" }}>
        <div style={{
          width: "100%",
          maxWidth: "400px",
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
              CONNEXION
            </h1>
            <p style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
            }}>
              &gt;&gt; CONTENT DE TE REVOIR &lt;&lt;
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>
                <Mail size={11} /> EMAIL
              </label>
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
              <label style={labelStyle}>
                <Lock size={11} /> MOT DE PASSE
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>

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
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Pas encore de compte ?{" "}
            <a href="/inscription" style={{ color: "#FFB300", textDecoration: "none", fontWeight: "700" }}>
              Créer un compte
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-pixel)",
  fontSize: "7px",
  color: "rgba(255,255,255,0.5)",
  letterSpacing: "0.1em",
  marginBottom: "8px",
};

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

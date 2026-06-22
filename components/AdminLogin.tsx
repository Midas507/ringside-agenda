"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogoMark } from "./Logo";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#161616",
        border: "1px solid #E8186D",
        borderRadius: "8px",
        padding: "40px 32px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <LogoMark size={48} />
          </div>
          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "36px",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "8px",
          }}>
            ADMIN <span style={{ color: "#E8186D" }}>ACCESS</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
          }}>
            &gt;&gt; CONNEXION REQUISE &lt;&lt;
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}>
              <Mail size={11} /> EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                background: "#0D0D0D",
                border: "1px solid #252525",
                color: "white",
                fontSize: "14px",
                padding: "12px 14px",
                borderRadius: "4px",
                outline: "none",
              }}
              placeholder="email@exemple.com"
            />
          </div>

          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}>
              <Lock size={11} /> MOT DE PASSE
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                background: "#0D0D0D",
                border: "1px solid #252525",
                color: "white",
                fontSize: "14px",
                padding: "12px 14px",
                borderRadius: "4px",
                outline: "none",
              }}
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
              marginTop: "8px",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a href="/" style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "12px",
            textDecoration: "none",
          }}>
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}

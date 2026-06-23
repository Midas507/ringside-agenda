"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Lightbulb, Bug, MessageSquare, FileText, Mail, AlertCircle, CheckCircle } from "lucide-react";

export default function Suggestion() {
  const [type, setType] = useState<"idee" | "bug" | "autre">("idee");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase
      .from("feature_suggestions")
      .insert({
        type,
        titre,
        description,
        email_contact: emailContact || null,
      });

    if (insertError) {
      setError("Erreur : " + insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ textAlign: "center", maxWidth: "500px" }}>
            <CheckCircle size={64} style={{ color: "#10B981", margin: "0 auto 16px" }} />
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "42px", color: "white", textTransform: "uppercase", marginBottom: "12px" }}>
              Merci pour ton <span style={{ color: "#10B981" }}>retour</span> !
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", lineHeight: 1.6 }}>
              Ta suggestion a bien été enregistrée. On lit chaque message attentivement et on revient vers toi si nécessaire !
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/" style={{
                background: "#E8186D",
                color: "white",
                padding: "12px 20px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                Retour à l'accueil
              </a>
              <button onClick={() => {
                setSuccess(false);
                setTitre(""); setDescription(""); setEmailContact("");
              }} style={{
                background: "transparent",
                color: "#FFB300",
                border: "1px solid #FFB300",
                padding: "12px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                Envoyer une autre suggestion
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const types = [
    { value: "idee", label: "IDÉE", icon: <Lightbulb size={18} />, color: "#FFB300", desc: "Une fonctionnalité à ajouter" },
    { value: "bug", label: "BUG", icon: <Bug size={18} />, color: "#E8186D", desc: "Un problème à corriger" },
    { value: "autre", label: "AUTRE", icon: <MessageSquare size={18} />, color: "#10B981", desc: "Question, retour, autre" },
  ];

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-8 pt-24">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            background: "rgba(255,179,0,0.15)",
            border: "1px solid #FFB300",
            borderRadius: "3px",
            marginBottom: "16px",
          }}>
            <Lightbulb size={12} style={{ color: "#FFB300" }} />
            <span style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "#FFB300",
              letterSpacing: "0.1em",
            }}>
              TON AVIS COMPTE
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "56px",
            color: "white",
            textTransform: "uppercase",
            lineHeight: 0.95,
            marginBottom: "12px",
          }}>
            Une <span style={{ color: "#FFB300" }}>idée</span> ?
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.6,
            maxWidth: "500px",
            margin: "0 auto",
          }}>
            Tu as une suggestion pour améliorer Ringside Agenda ? Une nouvelle fonctionnalité que tu aimerais voir ? Un bug à signaler ? Partage ton avis !
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          {/* Type de suggestion */}
          <div>
            <p style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}>
              TYPE DE SUGGESTION
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as any)}
                  style={{
                    padding: "16px 8px",
                    background: type === t.value ? `${t.color}22` : "#0D0D0D",
                    border: `1px solid ${type === t.value ? t.color : "#252525"}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ color: type === t.value ? t.color : "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                    {t.icon}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "16px",
                    color: type === t.value ? "white" : "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label icon={<FileText size={11} />}>Titre court *</Label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              style={inputStyle}
              placeholder="Ex: Ajouter un filtre par mois sur le calendrier"
            />
          </div>

          <div>
            <Label icon={<MessageSquare size={11} />}>Description détaillée *</Label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
              placeholder="Explique en détail ton idée, le bug que tu rencontres, ou ta question..."
            />
          </div>

          <div>
            <Label icon={<Mail size={11} />}>Ton email (optionnel)</Label>
            <input
              type="email"
              value={emailContact}
              onChange={(e) => setEmailContact(e.target.value)}
              style={inputStyle}
              placeholder="ton@email.com"
            />
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "6px", fontStyle: "italic" }}>
              Si tu veux qu'on revienne vers toi pour des précisions ou pour te tenir informé.
            </p>
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
              background: loading ? "#888" : "#FFB300",
              color: "black",
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
            {loading ? "Envoi..." : "Envoyer ma suggestion"}
          </button>
        </form>
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

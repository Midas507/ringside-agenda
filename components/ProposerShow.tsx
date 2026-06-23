"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { Calendar, MapPin, Link as LinkIcon, Mail, AlertCircle, CheckCircle, Megaphone, FileText } from "lucide-react";

export default function ProposerShow() {
  const [titre, setTitre] = useState("");
  const [federation, setFederation] = useState("");
  const [dateShow, setDateShow] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("FR");
  const [lienBilletterie, setLienBilletterie] = useState("");
  const [lienSource, setLienSource] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase
      .from("show_suggestions")
      .insert({
        titre,
        federation: federation || null,
        date_show: dateShow || null,
        ville: ville || null,
        pays,
        lien_billetterie: lienBilletterie || null,
        lien_source: lienSource || null,
        email_contact: emailContact || null,
        notes: notes || null,
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
              Merci <span style={{ color: "#10B981" }}>beaucoup</span> !
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "24px", lineHeight: 1.6 }}>
              Ton suggestion a bien été enregistrée. Notre équipe va la vérifier et l'ajouter au calendrier sous 24-48h !
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
                setTitre(""); setFederation(""); setDateShow(""); setVille(""); 
                setLienBilletterie(""); setLienSource(""); setEmailContact(""); setNotes("");
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
                Proposer un autre show
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
            background: "rgba(232,24,109,0.15)",
            border: "1px solid #E8186D",
            borderRadius: "3px",
            marginBottom: "16px",
          }}>
            <Megaphone size={12} style={{ color: "#E8186D" }} />
            <span style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "#E8186D",
              letterSpacing: "0.1em",
            }}>
              CROWD-SOURCING
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
            Proposer un <span style={{ color: "#E8186D" }}>show</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.6,
            maxWidth: "500px",
            margin: "0 auto",
          }}>
            Tu connais un show de catch qui n'est pas listé ? Aide-nous à compléter le calendrier ! Pas besoin d'avoir toutes les infos, on s'occupera de chercher le reste.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}>
          <div>
            <Label icon={<FileText size={11} />}>Titre du show *</Label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              style={inputStyle}
              placeholder="Ex: Triumph in Paris"
            />
          </div>

          <div>
            <Label icon={<Megaphone size={11} />}>Promotion / Fédération</Label>
            <input
              type="text"
              value={federation}
              onChange={(e) => setFederation(e.target.value)}
              style={inputStyle}
              placeholder="Ex: APC"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Label icon={<Calendar size={11} />}>Date</Label>
              <input
                type="date"
                value={dateShow}
                onChange={(e) => setDateShow(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <Label icon={<MapPin size={11} />}>Pays</Label>
              <select value={pays} onChange={(e) => setPays(e.target.value)} style={inputStyle}>
                <option value="FR">🇫🇷 France</option>
                <option value="BE">🇧🇪 Belgique</option>
                <option value="CH">🇨🇭 Suisse</option>
              </select>
            </div>
          </div>

          <div>
            <Label icon={<MapPin size={11} />}>Ville / Lieu</Label>
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              style={inputStyle}
              placeholder="Ex: Paris - Palais des Sports"
            />
          </div>

          <div>
            <Label icon={<LinkIcon size={11} />}>Lien de billetterie</Label>
            <input
              type="url"
              value={lienBilletterie}
              onChange={(e) => setLienBilletterie(e.target.value)}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label icon={<LinkIcon size={11} />}>Lien de la source (Instagram, Facebook, site...)</Label>
            <input
              type="url"
              value={lienSource}
              onChange={(e) => setLienSource(e.target.value)}
              style={inputStyle}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <Label icon={<FileText size={11} />}>Notes / Infos complémentaires</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
              placeholder="Toute info utile : participants, ambiance, etc."
            />
          </div>

          <div>
            <Label icon={<Mail size={11} />}>Ton email (optionnel, pour qu'on te remercie)</Label>
            <input
              type="email"
              value={emailContact}
              onChange={(e) => setEmailContact(e.target.value)}
              style={inputStyle}
              placeholder="ton@email.com"
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
            {loading ? "Envoi..." : "Envoyer la proposition"}
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

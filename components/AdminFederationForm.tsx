"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Upload } from "lucide-react";

type Federation = {
  id: number;
  nom: string;
  logo_url: string | null;
  pays: string | null;
  description?: string | null;
  site_web?: string | null;
  instagram?: string | null;
  annee_creation?: number | null;
};

export default function AdminFederationForm({
  federation,
  onClose,
  onSuccess,
}: {
  federation: Federation | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nom, setNom] = useState(federation?.nom || "");
  const [pays, setPays] = useState(federation?.pays || "FR");
  const [description, setDescription] = useState(federation?.description || "");
  const [siteWeb, setSiteWeb] = useState(federation?.site_web || "");
  const [instagram, setInstagram] = useState(federation?.instagram || "");
  const [annee, setAnnee] = useState(federation?.annee_creation?.toString() || "");
  const [logoUrl, setLogoUrl] = useState(federation?.logo_url || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { error } = await supabase.storage
      .from("federations-logos")
      .upload(file.name, file, { upsert: true });

    if (error) {
      alert("Erreur upload : " + error.message);
    } else {
      const { data } = supabase.storage.from("federations-logos").getPublicUrl(file.name);
      setLogoUrl(data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nom,
      pays,
      description: description || null,
      site_web: siteWeb || null,
      instagram: instagram || null,
      annee_creation: annee ? parseInt(annee) : null,
      logo_url: logoUrl || null,
    };

    const { error } = federation
      ? await supabase.from("federations").update(payload).eq("id", federation.id)
      : await supabase.from("federations").insert(payload);

    if (error) alert("Erreur : " + error.message);
    else onSuccess();

    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#161616",
        border: "1px solid #E8186D",
        borderRadius: "8px",
        padding: "32px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "white", textTransform: "uppercase" }}>
            {federation ? "Modifier la fédération" : "Nouvelle fédération"}
          </h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <Label>Nom de la fédération</Label>
            <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Label>Pays</Label>
              <select value={pays} onChange={(e) => setPays(e.target.value)} style={inputStyle}>
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
              </select>
            </div>
            <div>
              <Label>Année de création</Label>
              <input type="number" value={annee} onChange={(e) => setAnnee(e.target.value)} placeholder="2010" style={inputStyle} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
            />
          </div>

          <div>
            <Label>Site web</Label>
            <input type="text" value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} placeholder="https://..." style={inputStyle} />
          </div>

          <div>
            <Label>Instagram</Label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." style={inputStyle} />
          </div>

          <div>
            <Label>Logo</Label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="URL du logo"
                style={{ ...inputStyle, flex: 1 }}
              />
              <label style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#252525",
                color: "white",
                padding: "10px 14px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}>
                <Upload size={12} /> {uploading ? "Upload..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              </label>
            </div>
            {logoUrl && (
              <img src={logoUrl} alt="" style={{ marginTop: "8px", maxHeight: "100px", borderRadius: "4px" }} />
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                background: "transparent",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid #252525",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                background: "#E8186D",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              {loading ? "Enregistrement..." : federation ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{
    display: "block",
    fontFamily: "var(--font-pixel)",
    fontSize: "7px",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.1em",
    marginBottom: "6px",
    textTransform: "uppercase",
  }}>{children}</label>;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0D0D0D",
  border: "1px solid #252525",
  color: "white",
  fontSize: "13px",
  padding: "10px 12px",
  borderRadius: "4px",
  outline: "none",
};

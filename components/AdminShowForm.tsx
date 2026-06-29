"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Upload, Star, Users } from "lucide-react";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  pays: string;
  latitude?: number | null;
  longitude?: number | null;
  image_url: string | null;
  description?: string | null;
  lien_billetterie?: string | null;
  gratuit: boolean;
  featured?: boolean;
  featured_until?: string | null;
  carte?: string | null;
};

type Federation = {
  id: number;
  nom: string;
};

export default function AdminShowForm({
  show,
  federations,
  onClose,
  onSuccess,
}: {
  show: Show | null;
  federations: Federation[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [titre, setTitre] = useState(show?.titre || "");
  const [federation, setFederation] = useState(show?.federation || "");
  const [date, setDate] = useState(show?.date || "");
  const [ville, setVille] = useState(show?.ville || "");
  const [pays, setPays] = useState(show?.pays || "FR");
  const [latitude, setLatitude] = useState(show?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(show?.longitude?.toString() || "");
  const [description, setDescription] = useState(show?.description || "");
  const [lienBilletterie, setLienBilletterie] = useState(show?.lien_billetterie || "");
  const [imageUrl, setImageUrl] = useState(show?.image_url || "");
  const [gratuit, setGratuit] = useState(show?.gratuit || false);
  const [featured, setFeatured] = useState(show?.featured || false);
  const [featuredUntil, setFeaturedUntil] = useState(show?.featured_until || "");
  const [carte, setCarte] = useState(show?.carte || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = file.name;
    const { error } = await supabase.storage
      .from("shows-images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("Erreur upload : " + error.message);
    } else {
      const { data } = supabase.storage.from("shows-images").getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      titre,
      federation,
      date,
      ville,
      pays,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      description: description || null,
      lien_billetterie: lienBilletterie || null,
      image_url: imageUrl || null,
      gratuit,
      featured,
      featured_until: featuredUntil || null,
      carte: carte || null,
    };

    const { error } = show
      ? await supabase.from("shows").update(payload).eq("id", show.id)
      : await supabase.from("shows").insert(payload);

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
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "28px",
            color: "white",
            textTransform: "uppercase",
          }}>
            {show ? "Modifier le show" : "Nouveau show"}
          </h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Field label="Titre" value={titre} onChange={setTitre} required />

          <div>
            <Label>Promotion</Label>
            <select
              required
              value={federation}
              onChange={(e) => setFederation(e.target.value)}
              style={selectStyle}
            >
              <option value="">-- Choisir --</option>
              {federations.map((f) => (
                <option key={f.id} value={f.nom}>{f.nom}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <Label>Date</Label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <Label>Pays</Label>
              <select value={pays} onChange={(e) => setPays(e.target.value)} style={selectStyle}>
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
              </select>
            </div>
          </div>

          <Field label="Ville (lieu)" value={ville} onChange={setVille} required />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Latitude" value={latitude} onChange={setLatitude} placeholder="48.8566" />
            <Field label="Longitude" value={longitude} onChange={setLongitude} placeholder="2.3522" />
          </div>

          <div>
            <Label>Description (optionnelle)</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
            />
          </div>

          {/* Carte du show */}
          <div style={{
            padding: "14px",
            background: "rgba(255,179,0,0.05)",
            border: "1px solid rgba(255,179,0,0.3)",
            borderRadius: "4px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Users size={14} style={{ color: "#FFB300" }} />
              <Label>Carte du show — catcheurs/euses présent(e)s (optionnel)</Label>
            </div>
            <textarea
              value={carte}
              onChange={(e) => setCarte(e.target.value)}
              rows={3}
              placeholder="Ex: John Doe, Jane Smith, El Luchador, The Destroyer..."
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
            />
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "6px" }}>
              Sépare les noms par des virgules. Sera affiché sur la page du show.
            </p>
          </div>

          <Field label="Lien billetterie (optionnel)" value={lienBilletterie} onChange={setLienBilletterie} placeholder="https://..." />

          <div>
            <Label>Affiche du show</Label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de l'image"
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
            {imageUrl && (
              <img src={imageUrl} alt="" style={{ marginTop: "8px", maxHeight: "120px", borderRadius: "4px" }} />
            )}
          </div>

          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            background: "#0D0D0D",
            border: "1px solid #252525",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
            <input type="checkbox" checked={gratuit} onChange={(e) => setGratuit(e.target.checked)} />
            <span style={{ color: "white", fontSize: "13px" }}>Ce show est gratuit</span>
          </label>

          {/* Mise en avant */}
          <div style={{
            padding: "12px",
            background: "rgba(232,24,109,0.05)",
            border: "1px solid #E8186D",
            borderRadius: "4px",
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              marginBottom: featured ? "12px" : "0",
            }}>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <Star size={14} style={{ color: "#FFB300" }} />
              <span style={{ color: "#E8186D", fontSize: "13px", fontWeight: "700" }}>Mise en avant sur l'accueil</span>
            </label>
            {featured && (
              <div>
                <Label>Mise en avant jusqu'au (optionnel)</Label>
                <input
                  type="date"
                  value={featuredUntil}
                  onChange={(e) => setFeaturedUntil(e.target.value)}
                  style={inputStyle}
                />
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                  Si vide, le show reste mis en avant jusqu'à sa date d'événement.
                </p>
              </div>
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
              {loading ? "Enregistrement..." : show ? "Modifier" : "Créer"}
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

function Field({ label, value, onChange, required, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
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

const selectStyle: React.CSSProperties = { ...inputStyle };

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import AdminShowForm from "./AdminShowForm";
import { Plus, Pencil, Trash2, Eye, MousePointerClick, Calendar as CalIcon, Archive, AlertCircle, LogOut } from "lucide-react";

type Show = {
  id: number;
  titre: string;
  federation: string;
  date: string;
  ville: string;
  pays: string;
  image_url: string | null;
  gratuit: boolean;
  featured?: boolean;
};

type Federation = {
  id: number;
  nom: string;
  logo_url: string | null;
  pays: string | null;
};

type Profile = {
  id: string;
  email: string;
  pseudo: string | null;
  role: "fan" | "promotion" | "admin";
  promotion_validated: boolean;
  federation_id: number | null;
};

type ShowStats = {
  show_id: number;
  views: number;
  ticket_clicks: number;
};

export default function PromoteurDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [federation, setFederation] = useState<Federation | null>(null);
  const [allShows, setAllShows] = useState<Show[]>([]);
  const [allFederations, setAllFederations] = useState<Federation[]>([]);
  const [showStats, setShowStats] = useState<Record<number, ShowStats>>({});
  const [fedViews, setFedViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/connexion");
      return;
    }

    const { data: prof } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!prof) {
      router.push("/mon-compte");
      return;
    }

    setProfile(prof);

    // Si pas validé, on stop ici
    if (prof.role !== "admin" && (prof.role !== "promotion" || !prof.promotion_validated)) {
      setLoading(false);
      return;
    }

    await fetchData(prof);
  }

  async function fetchData(prof: Profile) {
    let fedNom: string | null = null;
    let fedId: number | null = prof.federation_id;

    // Si admin, récupérer toutes les feds
    const allFedsRes = await supabase.from("federations").select("*").order("nom");
    if (allFedsRes.data) setAllFederations(allFedsRes.data);

    if (prof.role === "promotion" && fedId) {
      const fedRes = await supabase.from("federations").select("*").eq("id", fedId).single();
      if (fedRes.data) {
        setFederation(fedRes.data);
        fedNom = fedRes.data.nom;
      }
    }

    // Récupérer les shows : pour admin = tous, pour promotion = ceux de sa fed
    let showsQuery = supabase.from("shows").select("*").order("date", { ascending: true });
    if (prof.role === "promotion" && fedNom) {
      showsQuery = showsQuery.ilike("federation", fedNom);
    }
    const showsRes = await showsQuery;
    if (showsRes.data) setAllShows(showsRes.data);

    // Stats des shows
    const statsRes = await supabase.from("show_stats").select("*");
    const sMap: Record<number, ShowStats> = {};
    if (statsRes.data) statsRes.data.forEach(s => { sMap[s.show_id] = s; });
    setShowStats(sMap);

    // Stats de la fédération
    if (fedId) {
      const fedStatsRes = await supabase.from("federation_stats").select("*").eq("federation_id", fedId).maybeSingle();
      if (fedStatsRes.data) setFedViews(fedStatsRes.data.views);
    }

    setLoading(false);
  }

  async function deleteShow(id: number) {
    if (!confirm("Supprimer ce show ?")) return;
    const { error } = await supabase.from("shows").delete().eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else if (profile) await fetchData(profile);
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

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
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

  // Pas un promoteur ou admin
  if (profile.role !== "admin" && profile.role !== "promotion") {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-8 pt-24" style={{ textAlign: "center" }}>
          <AlertCircle size={48} style={{ color: "#E8186D", margin: "0 auto 16px" }} />
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "42px", color: "white", textTransform: "uppercase", marginBottom: "12px" }}>
            Accès <span style={{ color: "#E8186D" }}>refusé</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
            Cette page est réservée aux comptes Promotion.
          </p>
          <a href="/mon-compte" style={{ color: "#FFB300", textDecoration: "none", fontWeight: "700" }}>
            ← Retour à mon compte
          </a>
        </div>
        <Footer />
      </>
    );
  }

  // Promoteur pas encore validé
  if (profile.role === "promotion" && !profile.promotion_validated) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-8 pt-24" style={{ textAlign: "center" }}>
          <AlertCircle size={48} style={{ color: "#FFB300", margin: "0 auto 16px" }} />
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "42px", color: "white", textTransform: "uppercase", marginBottom: "12px" }}>
            Validation <span style={{ color: "#FFB300" }}>en cours</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "20px", lineHeight: 1.6 }}>
            Ton compte Promotion est en attente de validation par notre équipe.<br />
            Tu recevras un email dès qu'il sera validé (sous 24-48h).
          </p>
          <a href="/mon-compte" style={{ color: "#FFB300", textDecoration: "none", fontWeight: "700" }}>
            ← Retour à mon compte
          </a>
        </div>
        <Footer />
      </>
    );
  }

  // Promoteur validé sans fédération assignée
  if (profile.role === "promotion" && !profile.federation_id) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-8 pt-24" style={{ textAlign: "center" }}>
          <AlertCircle size={48} style={{ color: "#FFB300", margin: "0 auto 16px" }} />
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "42px", color: "white", textTransform: "uppercase", marginBottom: "12px" }}>
            Aucune fédération <span style={{ color: "#E8186D" }}>assignée</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "20px", lineHeight: 1.6 }}>
            Ton compte n'est rattaché à aucune fédération.<br />
            Contacte-nous pour résoudre ce problème : <a href="mailto:ringsideagenda@gmail.com" style={{ color: "#FFB300" }}>ringsideagenda@gmail.com</a>
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const upcomingShows = allShows.filter(s => s.date >= today);
  const pastShows = allShows.filter(s => s.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const displayedShows = tab === "upcoming" ? upcomingShows : pastShows;

  // Stats totales
  const totalViews = upcomingShows.reduce((sum, s) => sum + (showStats[s.id]?.views || 0), 0) +
                      pastShows.reduce((sum, s) => sum + (showStats[s.id]?.views || 0), 0);
  const totalClicks = upcomingShows.reduce((sum, s) => sum + (showStats[s.id]?.ticket_clicks || 0), 0) +
                       pastShows.reduce((sum, s) => sum + (showStats[s.id]?.ticket_clicks || 0), 0);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* En-tête */}
        <div style={{
          padding: "24px 32px",
          background: "#161616",
          border: "1px solid #FFB300",
          borderRadius: "8px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}>
          {federation?.logo_url && (
            <div style={{
              width: "70px",
              height: "70px",
              background: "#0D0D0D",
              borderRadius: "8px",
              padding: "8px",
              flexShrink: 0,
            }}>
              <img src={federation.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "#FFB300",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}>
              &gt;&gt; ESPACE PROMOTEUR &lt;&lt;
            </p>
            <h1 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "42px",
              color: "white",
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              {federation?.nom || "Espace Promoteur"}
            </h1>
          </div>
          <button onClick={handleLogout} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            color: "#E8186D",
            border: "1px solid #E8186D",
            padding: "8px 14px",
            borderRadius: "3px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}>
            <LogOut size={12} /> Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          <StatCard icon={<Eye size={18} />} label="Vues de la fédération" value={fedViews} color="#10B981" />
          <StatCard icon={<Eye size={18} />} label="Vues totales (shows)" value={totalViews} color="#E8186D" />
          <StatCard icon={<MousePointerClick size={18} />} label="Clics billetterie" value={totalClicks} color="#FFB300" />
        </div>

        {/* Onglets */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #252525" }}>
          <TabButton active={tab === "upcoming"} onClick={() => setTab("upcoming")} icon={<CalIcon size={14} />} label={`À venir (${upcomingShows.length})`} />
          <TabButton active={tab === "past"} onClick={() => setTab("past")} icon={<Archive size={14} />} label={`Passés (${pastShows.length})`} />
        </div>

        {/* Bouton nouveau show */}
        {tab === "upcoming" && (
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => { setEditingShow(null); setShowForm(true); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#E8186D",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> Nouveau show
            </button>
          </div>
        )}

        {/* Liste shows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {displayedShows.map((show) => {
            const stats = showStats[show.id];
            return (
              <div
                key={show.id}
                style={{
                  padding: "12px 16px",
                  background: "#161616",
                  border: "1px solid #252525",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  opacity: tab === "past" ? 0.6 : 1,
                }}
              >
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "#0D0D0D",
                  borderRadius: "4px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}>
                  {show.image_url && <img src={show.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                    {show.gratuit && (
                      <span style={{ background: "#10B981", color: "white", fontSize: "8px", padding: "1px 6px", borderRadius: "2px", letterSpacing: "0.1em" }}>
                        GRATUIT
                      </span>
                    )}
                    {show.featured && (
                      <span style={{ background: "#FFB300", color: "black", fontSize: "8px", padding: "1px 6px", borderRadius: "2px", letterSpacing: "0.1em" }}>
                        ⭐ À LA UNE
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "white", lineHeight: 1 }}>{show.titre}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                    {formatDate(show.date)} · {show.ville}
                  </div>
                </div>
                <div style={statPill}>
                  <Eye size={11} style={{ color: "#E8186D" }} />
                  <span>{stats?.views || 0}</span>
                </div>
                <div style={statPill}>
                  <MousePointerClick size={11} style={{ color: "#FFB300" }} />
                  <span>{stats?.ticket_clicks || 0}</span>
                </div>
                <button onClick={() => { setEditingShow(show); setShowForm(true); }} style={btnEdit}>
                  <Pencil size={12} />
                </button>
                <button onClick={() => deleteShow(show.id)} style={btnDelete}>
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}

          {displayedShows.length === 0 && (
            <div style={{
              padding: "40px",
              background: "#161616",
              border: "1px solid #252525",
              borderRadius: "4px",
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              letterSpacing: "0.1em",
            }}>
              AUCUN SHOW {tab === "past" ? "PASSÉ" : "À VENIR"}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AdminShowForm
          show={editingShow}
          federations={allFederations}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); if (profile) fetchData(profile); }}
        />
      )}

      <Footer />
    </>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: "16px 20px",
      background: "#161616",
      border: `1px solid ${color}`,
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "6px",
        background: `${color}22`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "white", lineHeight: 1 }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontFamily: "var(--font-pixel)", fontSize: "7px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginTop: "4px" }}>
          {label.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: "transparent",
        border: "none",
        borderBottom: active ? "2px solid #FFB300" : "2px solid transparent",
        color: active ? "#FFB300" : "rgba(255,255,255,0.5)",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {icon} {label}
    </button>
  );
}

const statPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  background: "#0D0D0D",
  border: "1px solid #252525",
  borderRadius: "3px",
  fontSize: "12px",
  color: "white",
  fontWeight: "700",
  minWidth: "50px",
  justifyContent: "center",
};

const btnEdit: React.CSSProperties = {
  background: "transparent",
  color: "#FFB300",
  border: "1px solid #FFB300",
  padding: "6px 10px",
  borderRadius: "3px",
  cursor: "pointer",
};

const btnDelete: React.CSSProperties = {
  background: "transparent",
  color: "#E8186D",
  border: "1px solid #E8186D",
  padding: "6px 10px",
  borderRadius: "3px",
  cursor: "pointer",
};

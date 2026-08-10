"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogoMark } from "./Logo";
import { LogOut, Plus, Pencil, Trash2, Calendar as CalIcon, Star, Archive, Eye, MousePointerClick, BarChart3, Megaphone, Check, X, MessageCircle, Lightbulb, Send, ExternalLink } from "lucide-react";
import AdminShowForm from "./AdminShowForm";
import AdminFederationForm from "./AdminFederationForm";

// ============================================
// SEUL CET EMAIL PEUT ACCÉDER À L'ADMIN
// ============================================
const ADMIN_EMAIL = "ringsideagenda@gmail.com";

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

type ShowStats = {
  show_id: number;
  views: number;
  ticket_clicks: number;
};

type FederationStats = {
  federation_id: number;
  views: number;
};

type Promoteur = {
  id: string;
  email: string;
  pseudo: string | null;
  promotion_validated: boolean;
  federation_id: number | null;
  created_at: string;
};

type Comment = {
  id: number;
  show_id: number;
  user_id: string;
  content: string;
  status: string;
  created_at: string;
  show_titre?: string;
  user_pseudo?: string;
  user_email?: string;
};

type ShowSuggestion = {
  id: number;
  titre: string;
  federation: string | null;
  date_show: string | null;
  ville: string | null;
  pays: string | null;
  lien_billetterie: string | null;
  lien_source: string | null;
  email_contact: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

type FeatureSuggestion = {
  id: number;
  type: string;
  titre: string;
  description: string;
  email_contact: string | null;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "authorized" | "denied">("checking");
  const [tab, setTab] = useState<"shows" | "past" | "federations" | "promoteurs" | "comments" | "show_suggestions" | "feature_suggestions">("shows");
  const [allShows, setAllShows] = useState<Show[]>([]);
  const [federations, setFederations] = useState<Federation[]>([]);
  const [showStats, setShowStats] = useState<Record<number, ShowStats>>({});
  const [fedStats, setFedStats] = useState<Record<number, FederationStats>>({});
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<ShowSuggestion[]>([]);
  const [featureSuggestions, setFeatureSuggestions] = useState<FeatureSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [editingFed, setEditingFed] = useState<Federation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [fedForm, setFedForm] = useState(false);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    // Pas de session → redirection login
    if (!session) {
      router.push("/admin/login");
      return;
    }

    // Session mais PAS le bon email → accès refusé (404)
    if (session.user.email !== ADMIN_EMAIL) {
      setAuthState("denied");
      return;
    }

    // C'est bien l'admin → autorisé
    setAuthState("authorized");
    fetchData();
  }

  async function fetchData() {
    const [showsRes, fedsRes, showStatsRes, fedStatsRes, promoteursRes, commentsRes, showSuggRes, featureSuggRes] = await Promise.all([
      supabase.from("shows").select("*").order("date", { ascending: true }),
      supabase.from("federations").select("*").order("nom", { ascending: true }),
      supabase.from("show_stats").select("*"),
      supabase.from("federation_stats").select("*"),
      supabase.from("user_profiles").select("*").eq("role", "promotion").order("created_at", { ascending: false }),
      supabase.from("show_comments").select("*").order("created_at", { ascending: false }),
      supabase.from("show_suggestions").select("*").order("created_at", { ascending: false }),
      supabase.from("feature_suggestions").select("*").order("created_at", { ascending: false }),
    ]);

    if (showsRes.data) setAllShows(showsRes.data);
    if (fedsRes.data) setFederations(fedsRes.data);
    if (promoteursRes.data) setPromoteurs(promoteursRes.data);
    if (showSuggRes.data) setShowSuggestions(showSuggRes.data);
    if (featureSuggRes.data) setFeatureSuggestions(featureSuggRes.data);

    const sMap: Record<number, ShowStats> = {};
    if (showStatsRes.data) showStatsRes.data.forEach(s => { sMap[s.show_id] = s; });
    setShowStats(sMap);

    const fMap: Record<number, FederationStats> = {};
    if (fedStatsRes.data) fedStatsRes.data.forEach(f => { fMap[f.federation_id] = f; });
    setFedStats(fMap);

    if (commentsRes.data && commentsRes.data.length > 0) {
      const userIds = [...new Set(commentsRes.data.map(c => c.user_id))];
      const showIds = [...new Set(commentsRes.data.map(c => c.show_id))];

      const [profilesRes, showsForCommentsRes] = await Promise.all([
        supabase.from("user_profiles").select("id, pseudo, email").in("id", userIds),
        supabase.from("shows").select("id, titre").in("id", showIds),
      ]);

      const profilesMap: Record<string, { pseudo: string | null; email: string }> = {};
      if (profilesRes.data) {
        profilesRes.data.forEach(p => { profilesMap[p.id] = { pseudo: p.pseudo, email: p.email }; });
      }

      const showsMap: Record<number, string> = {};
      if (showsForCommentsRes.data) {
        showsForCommentsRes.data.forEach(s => { showsMap[s.id] = s.titre; });
      }

      setComments(commentsRes.data.map(c => ({
        ...c,
        show_titre: showsMap[c.show_id],
        user_pseudo: profilesMap[c.user_id]?.pseudo || "Anonyme",
        user_email: profilesMap[c.user_id]?.email || "",
      })));
    } else {
      setComments([]);
    }

    setLoading(false);
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/admin/login";
  }

  async function deleteShow(id: number) {
    if (!confirm("Supprimer ce show ?")) return;
    const { error } = await supabase.from("shows").delete().eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function deleteFederation(id: number) {
    if (!confirm("Supprimer cette promotion ?")) return;
    const { error } = await supabase.from("federations").delete().eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function validatePromoteur(userId: string, federationId: number) {
    const { error } = await supabase
      .from("user_profiles")
      .update({ promotion_validated: true, federation_id: federationId })
      .eq("id", userId);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function unvalidatePromoteur(userId: string) {
    if (!confirm("Retirer la validation à ce promoteur ?")) return;
    const { error } = await supabase
      .from("user_profiles")
      .update({ promotion_validated: false })
      .eq("id", userId);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function updatePromoteurFederation(userId: string, federationId: number | null) {
    const { error } = await supabase
      .from("user_profiles")
      .update({ federation_id: federationId })
      .eq("id", userId);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function moderateComment(commentId: number, status: "approved" | "rejected") {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("show_comments")
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_by: session?.user.id,
      })
      .eq("id", commentId);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function deleteComment(commentId: number) {
    if (!confirm("Supprimer définitivement ce commentaire ?")) return;
    const { error } = await supabase.from("show_comments").delete().eq("id", commentId);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function updateShowSuggestionStatus(id: number, status: "added" | "rejected") {
    const { error } = await supabase
      .from("show_suggestions")
      .update({ status })
      .eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function deleteShowSuggestion(id: number) {
    if (!confirm("Supprimer cette proposition ?")) return;
    const { error } = await supabase.from("show_suggestions").delete().eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function updateFeatureSuggestionStatus(id: number, status: "review" | "done" | "rejected") {
    const { error } = await supabase
      .from("feature_suggestions")
      .update({ status })
      .eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  async function deleteFeatureSuggestion(id: number) {
    if (!confirm("Supprimer cette suggestion ?")) return;
    const { error } = await supabase.from("feature_suggestions").delete().eq("id", id);
    if (error) alert("Erreur : " + error.message);
    else fetchData();
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatDateTime(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  // ============================================
  // ÉCRAN DE VÉRIFICATION
  // ============================================
  if (authState === "checking") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D0D0D" }}>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", color: "#E8186D", letterSpacing: "0.1em" }}>
          VÉRIFICATION...
        </span>
      </div>
    );
  }

  // ============================================
  // ACCÈS REFUSÉ → PAGE 404 GERMAN SUPLEX
  // ============================================
  if (authState === "denied") {
    return <AccessDenied />;
  }

  // ============================================
  // À PARTIR D'ICI : ADMIN AUTORISÉ UNIQUEMENT
  // ============================================

  const today = new Date().toISOString().split("T")[0];
  const upcomingShows = allShows.filter(s => s.date >= today);
  const pastShows = allShows.filter(s => s.date < today).sort((a, b) => b.date.localeCompare(a.date));

  const displayedShows = tab === "shows" ? upcomingShows : tab === "past" ? pastShows : [];

  const totalViews = Object.values(showStats).reduce((sum, s) => sum + (s.views || 0), 0);
  const totalClicks = Object.values(showStats).reduce((sum, s) => sum + (s.ticket_clicks || 0), 0);
  const totalFedViews = Object.values(fedStats).reduce((sum, f) => sum + (f.views || 0), 0);

  const pendingPromoCount = promoteurs.filter(p => !p.promotion_validated).length;
  const pendingCommentsCount = comments.filter(c => c.status === "pending").length;
  const pendingShowSuggCount = showSuggestions.filter(s => s.status === "pending").length;
  const pendingFeatureSuggCount = featureSuggestions.filter(s => s.status === "pending").length;

  return (
    <div>
      <div style={{
        background: "#0D0D0D",
        borderBottom: "1px solid #252525",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <LogoMark size={36} />
        </a>
        <h1 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "24px",
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}>
          PANNEAU <span style={{ color: "#E8186D" }}>ADMIN</span>
        </h1>
        <button
          onClick={handleLogout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            color: "#E8186D",
            border: "1px solid #E8186D",
            padding: "8px 14px",
            borderRadius: "3px",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          <LogOut size={12} /> Déconnexion
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          <StatCard icon={<Eye size={18} />} label="Vues totales (shows)" value={totalViews} color="#E8186D" />
          <StatCard icon={<MousePointerClick size={18} />} label="Clics billetterie" value={totalClicks} color="#FFB300" />
          <StatCard icon={<BarChart3 size={18} />} label="Vues totales (promotions)" value={totalFedViews} color="#10B981" />
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid #252525", flexWrap: "wrap" }}>
          <TabButton active={tab === "shows"} onClick={() => setTab("shows")} icon={<CalIcon size={14} />} label={`Shows à venir (${upcomingShows.length})`} />
          <TabButton active={tab === "past"} onClick={() => setTab("past")} icon={<Archive size={14} />} label={`Shows passés (${pastShows.length})`} />
          <TabButton active={tab === "federations"} onClick={() => setTab("federations")} icon={<Star size={14} />} label={`Promotions (${federations.length})`} />
          <TabButton active={tab === "promoteurs"} onClick={() => setTab("promoteurs")} icon={<Megaphone size={14} />} label={`Promoteurs (${promoteurs.length})`} badge={pendingPromoCount} />
          <TabButton active={tab === "comments"} onClick={() => setTab("comments")} icon={<MessageCircle size={14} />} label={`Commentaires (${comments.length})`} badge={pendingCommentsCount} />
          <TabButton active={tab === "show_suggestions"} onClick={() => setTab("show_suggestions")} icon={<Send size={14} />} label={`Shows proposés (${showSuggestions.length})`} badge={pendingShowSuggCount} />
          <TabButton active={tab === "feature_suggestions"} onClick={() => setTab("feature_suggestions")} icon={<Lightbulb size={14} />} label={`Suggestions (${featureSuggestions.length})`} badge={pendingFeatureSuggCount} />
        </div>

        {loading ? (
          <p style={{ color: "#888", textAlign: "center", padding: "40px" }}>Chargement...</p>
        ) : tab === "show_suggestions" ? (
          <div>
            {pendingShowSuggCount > 0 && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(255,179,0,0.08)",
                border: "1px solid #FFB300",
                borderRadius: "4px",
                marginBottom: "16px",
                fontSize: "13px",
                color: "#FFB300",
              }}>
                ⏳ {pendingShowSuggCount} proposition{pendingShowSuggCount > 1 ? "s" : ""} de show en attente
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {showSuggestions.map((s) => {
                const statusColor = s.status === "added" ? "#10B981" : s.status === "rejected" ? "#E8186D" : "#FFB300";
                const statusLabel = s.status === "added" ? "✓ AJOUTÉ" : s.status === "rejected" ? "✗ REFUSÉ" : "⏳ EN ATTENTE";

                return (
                  <div key={s.id} style={{
                    padding: "14px 16px",
                    background: "#161616",
                    border: `1px solid ${statusColor}`,
                    borderRadius: "4px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "9px",
                        padding: "2px 8px",
                        borderRadius: "2px",
                        letterSpacing: "0.1em",
                        fontWeight: "700",
                        background: statusColor,
                        color: s.status === "rejected" ? "white" : s.status === "pending" ? "black" : "white",
                      }}>
                        {statusLabel}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                        Reçu le {formatDateTime(s.created_at)}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "white", textTransform: "uppercase", marginBottom: "8px" }}>
                      {s.titre}
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px", marginBottom: "12px", fontSize: "12px" }}>
                      {s.federation && <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Promotion:</span> <span style={{ color: "white" }}>{s.federation}</span></div>}
                      {s.date_show && <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Date:</span> <span style={{ color: "white" }}>{formatDate(s.date_show)}</span></div>}
                      {s.ville && <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Ville:</span> <span style={{ color: "white" }}>{s.ville}</span></div>}
                      {s.pays && <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Pays:</span> <span style={{ color: "white" }}>{s.pays}</span></div>}
                    </div>

                    {(s.lien_billetterie || s.lien_source) && (
                      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                        {s.lien_billetterie && (
                          <a href={s.lien_billetterie} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            background: "rgba(232,24,109,0.1)", color: "#E8186D",
                            padding: "4px 10px", borderRadius: "3px", fontSize: "11px",
                            textDecoration: "none", border: "1px solid rgba(232,24,109,0.3)",
                          }}>
                            <ExternalLink size={10} /> Billetterie
                          </a>
                        )}
                        {s.lien_source && (
                          <a href={s.lien_source} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            background: "rgba(255,179,0,0.1)", color: "#FFB300",
                            padding: "4px 10px", borderRadius: "3px", fontSize: "11px",
                            textDecoration: "none", border: "1px solid rgba(255,179,0,0.3)",
                          }}>
                            <ExternalLink size={10} /> Source
                          </a>
                        )}
                      </div>
                    )}

                    {s.notes && (
                      <p style={{
                        fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
                        padding: "10px 12px", background: "#0D0D0D", borderRadius: "4px",
                        marginBottom: "10px", whiteSpace: "pre-line",
                      }}>
                        {s.notes}
                      </p>
                    )}

                    {s.email_contact && (
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>
                        📧 Contact: <a href={`mailto:${s.email_contact}`} style={{ color: "#FFB300", textDecoration: "none" }}>{s.email_contact}</a>
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {s.status !== "added" && (
                        <button onClick={() => updateShowSuggestionStatus(s.id, "added")} style={btnGreen}>
                          <Check size={11} /> Marquer ajouté
                        </button>
                      )}
                      {s.status !== "rejected" && (
                        <button onClick={() => updateShowSuggestionStatus(s.id, "rejected")} style={btnYellow}>
                          <X size={11} /> Refuser
                        </button>
                      )}
                      <button onClick={() => deleteShowSuggestion(s.id)} style={{ ...btnDelete2, marginLeft: "auto" }}>
                        <Trash2 size={11} /> Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}

              {showSuggestions.length === 0 && (
                <EmptyState text="AUCUNE PROPOSITION DE SHOW" />
              )}
            </div>
          </div>
        ) : tab === "feature_suggestions" ? (
          <div>
            {pendingFeatureSuggCount > 0 && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(255,179,0,0.08)",
                border: "1px solid #FFB300",
                borderRadius: "4px",
                marginBottom: "16px",
                fontSize: "13px",
                color: "#FFB300",
              }}>
                💡 {pendingFeatureSuggCount} suggestion{pendingFeatureSuggCount > 1 ? "s" : ""} en attente
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {featureSuggestions.map((s) => {
                const statusColor = s.status === "done" ? "#10B981" : s.status === "rejected" ? "#E8186D" : s.status === "review" ? "#FFB300" : "#888";
                const statusLabel = s.status === "done" ? "✓ FAIT" : s.status === "rejected" ? "✗ REFUSÉ" : s.status === "review" ? "👀 EN COURS" : "⏳ EN ATTENTE";
                const typeColor = s.type === "bug" ? "#E8186D" : s.type === "idee" ? "#FFB300" : "#10B981";
                const typeLabel = s.type === "bug" ? "🐛 BUG" : s.type === "idee" ? "💡 IDÉE" : "💬 AUTRE";

                return (
                  <div key={s.id} style={{
                    padding: "14px 16px",
                    background: "#161616",
                    border: `1px solid ${statusColor}`,
                    borderRadius: "4px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "9px", padding: "2px 8px", borderRadius: "2px", letterSpacing: "0.1em", fontWeight: "700",
                        background: typeColor, color: s.type === "idee" ? "black" : "white",
                      }}>
                        {typeLabel}
                      </span>
                      <span style={{
                        fontSize: "9px", padding: "2px 8px", borderRadius: "2px", letterSpacing: "0.1em", fontWeight: "700",
                        background: statusColor, color: s.status === "rejected" ? "white" : "black",
                      }}>
                        {statusLabel}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                        Reçu le {formatDateTime(s.created_at)}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "white", textTransform: "uppercase", marginBottom: "8px" }}>
                      {s.titre}
                    </h3>

                    <p style={{
                      fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
                      padding: "10px 12px", background: "#0D0D0D", borderRadius: "4px",
                      marginBottom: "10px", whiteSpace: "pre-line",
                    }}>
                      {s.description}
                    </p>

                    {s.email_contact && (
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>
                        📧 Contact: <a href={`mailto:${s.email_contact}`} style={{ color: "#FFB300", textDecoration: "none" }}>{s.email_contact}</a>
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {s.status !== "review" && (
                        <button onClick={() => updateFeatureSuggestionStatus(s.id, "review")} style={btnYellow}>
                          👀 En cours
                        </button>
                      )}
                      {s.status !== "done" && (
                        <button onClick={() => updateFeatureSuggestionStatus(s.id, "done")} style={btnGreen}>
                          <Check size={11} /> Marquer fait
                        </button>
                      )}
                      {s.status !== "rejected" && (
                        <button onClick={() => updateFeatureSuggestionStatus(s.id, "rejected")} style={btnRed}>
                          <X size={11} /> Refuser
                        </button>
                      )}
                      <button onClick={() => deleteFeatureSuggestion(s.id)} style={{ ...btnDelete2, marginLeft: "auto" }}>
                        <Trash2 size={11} /> Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}

              {featureSuggestions.length === 0 && (
                <EmptyState text="AUCUNE SUGGESTION" />
              )}
            </div>
          </div>
        ) : tab === "comments" ? (
          <div>
            {pendingCommentsCount > 0 && (
              <div style={{
                padding: "12px 16px", background: "rgba(255,179,0,0.08)", border: "1px solid #FFB300",
                borderRadius: "4px", marginBottom: "16px", fontSize: "13px", color: "#FFB300",
              }}>
                ⏳ {pendingCommentsCount} commentaire{pendingCommentsCount > 1 ? "s" : ""} en attente de modération
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {comments.map((c) => {
                const statusColor = c.status === "approved" ? "#10B981" : c.status === "rejected" ? "#E8186D" : "#FFB300";
                const statusLabel = c.status === "approved" ? "✓ APPROUVÉ" : c.status === "rejected" ? "✗ REFUSÉ" : "⏳ EN ATTENTE";

                return (
                  <div key={c.id} style={{
                    padding: "14px 16px", background: "#161616", border: `1px solid ${statusColor}`, borderRadius: "4px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "9px", padding: "2px 8px", borderRadius: "2px", letterSpacing: "0.1em", fontWeight: "700",
                        background: statusColor, color: c.status === "rejected" ? "white" : c.status === "pending" ? "black" : "white",
                      }}>
                        {statusLabel}
                      </span>
                      <span style={{ fontSize: "12px", color: "white", fontWeight: "700" }}>{c.user_pseudo}</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                        sur <a href={`/show/${c.show_id}`} target="_blank" style={{ color: "#FFB300", textDecoration: "none" }}>{c.show_titre || `Show #${c.show_id}`}</a>
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginLeft: "auto" }}>
                        {formatDateTime(c.created_at)}
                      </span>
                    </div>

                    <p style={{
                      fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6,
                      padding: "10px 12px", background: "#0D0D0D", borderRadius: "4px",
                      marginBottom: "10px", whiteSpace: "pre-line",
                    }}>
                      {c.content}
                    </p>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {c.status !== "approved" && (
                        <button onClick={() => moderateComment(c.id, "approved")} style={btnGreen}>
                          <Check size={11} /> Approuver
                        </button>
                      )}
                      {c.status !== "rejected" && (
                        <button onClick={() => moderateComment(c.id, "rejected")} style={btnYellow}>
                          <X size={11} /> Refuser
                        </button>
                      )}
                      <button onClick={() => deleteComment(c.id)} style={{ ...btnDelete2, marginLeft: "auto" }}>
                        <Trash2 size={11} /> Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}

              {comments.length === 0 && <EmptyState text="AUCUN COMMENTAIRE POUR LE MOMENT" />}
            </div>
          </div>
        ) : tab === "promoteurs" ? (
          <div>
            {pendingPromoCount > 0 && (
              <div style={{
                padding: "12px 16px", background: "rgba(255,179,0,0.08)", border: "1px solid #FFB300",
                borderRadius: "4px", marginBottom: "16px", fontSize: "13px", color: "#FFB300",
              }}>
                ⏳ {pendingPromoCount} demande{pendingPromoCount > 1 ? "s" : ""} de validation en attente
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {promoteurs.map((p) => (
                <div key={p.id} style={{
                  padding: "14px 16px", background: "#161616",
                  border: `1px solid ${p.promotion_validated ? "#10B981" : "#FFB300"}`,
                  borderRadius: "4px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{
                          fontSize: "9px", padding: "2px 8px", borderRadius: "2px", letterSpacing: "0.1em", fontWeight: "700",
                          background: p.promotion_validated ? "#10B981" : "#FFB300",
                          color: p.promotion_validated ? "white" : "black",
                        }}>
                          {p.promotion_validated ? "✓ VALIDÉ" : "⏳ EN ATTENTE"}
                        </span>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                          Inscrit le {formatDate(p.created_at)}
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "white", lineHeight: 1, marginBottom: "2px" }}>
                        {p.pseudo || "Sans pseudo"}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{p.email}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700" }}>
                      Promotion :
                    </span>
                    <select
                      value={p.federation_id || ""}
                      onChange={(e) => updatePromoteurFederation(p.id, e.target.value ? parseInt(e.target.value) : null)}
                      style={{
                        background: "#0D0D0D", border: "1px solid #252525", color: "white",
                        fontSize: "12px", padding: "6px 10px", borderRadius: "3px", outline: "none",
                        flex: 1, maxWidth: "300px",
                      }}
                    >
                      <option value="">-- Aucune --</option>
                      {federations.map((f) => (
                        <option key={f.id} value={f.id}>{f.nom}</option>
                      ))}
                    </select>

                    {!p.promotion_validated ? (
                      <button
                        onClick={() => {
                          if (!p.federation_id) {
                            alert("Choisis d'abord une promotion avant de valider !");
                            return;
                          }
                          validatePromoteur(p.id, p.federation_id);
                        }}
                        style={btnGreen}
                      >
                        <Check size={12} /> Valider
                      </button>
                    ) : (
                      <button onClick={() => unvalidatePromoteur(p.id)} style={btnRed}>
                        <X size={12} /> Retirer
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {promoteurs.length === 0 && <EmptyState text="AUCUN COMPTE PROMOTEUR" />}
            </div>
          </div>
        ) : tab === "federations" ? (
          <div>
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { setEditingFed(null); setFedForm(true); }} style={btnAdd}>
                <Plus size={14} /> Nouvelle promotion
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {federations.map((fed) => {
                const stats = fedStats[fed.id];
                return (
                  <div key={fed.id} style={rowStyle}>
                    <div style={thumbStyle}>
                      {fed.logo_url && <img src={fed.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={titleStyle}>{fed.nom}</div>
                      <div style={subStyle}>{fed.pays}</div>
                    </div>
                    <div style={statPill}>
                      <Eye size={11} style={{ color: "#E8186D" }} />
                      <span>{stats?.views || 0}</span>
                    </div>
                    <button onClick={() => { setEditingFed(fed); setFedForm(true); }} style={btnEdit}>
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => deleteFederation(fed.id)} style={btnDelete}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                {tab === "shows" ? "Shows à venir, visibles sur le site" : "Shows passés, archivés et non visibles sur le site"}
              </p>
              {tab === "shows" && (
                <button onClick={() => { setEditingShow(null); setShowForm(true); }} style={btnAdd}>
                  <Plus size={14} /> Nouveau show
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {displayedShows.map((show) => {
                const stats = showStats[show.id];
                return (
                  <div key={show.id} style={{ ...rowStyle, opacity: tab === "past" ? 0.6 : 1 }}>
                    <div style={{ ...thumbStyle, padding: 0 }}>
                      {show.image_url && <img src={show.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "9px", color: "#E8186D", fontWeight: "700",
                          letterSpacing: "0.1em", textTransform: "uppercase",
                        }}>
                          {show.federation}
                        </span>
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
                      <div style={titleStyle}>{show.titre}</div>
                      <div style={subStyle}>{formatDate(show.date)} · {show.ville}</div>
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
                <EmptyState text={tab === "past" ? "AUCUN SHOW PASSE" : "AUCUN SHOW A VENIR"} />
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <AdminShowForm
          show={editingShow}
          federations={federations}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchData(); }}
        />
      )}

      {fedForm && (
        <AdminFederationForm
          federation={editingFed}
          onClose={() => setFedForm(false)}
          onSuccess={() => { setFedForm(false); fetchData(); }}
        />
      )}
    </div>
  );
}

// ============================================
// PAGE ACCÈS REFUSÉ (German Suplex pixel)
// ============================================
function AccessDenied() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(80px, 20vw, 180px)",
          color: "#E8186D",
          lineHeight: 0.9,
          margin: 0,
          textShadow: "0 0 30px rgba(232,24,109,0.5)",
        }}
      >
        404
      </h1>

      <p
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "10px",
          color: "#FFB300",
          letterSpacing: "0.15em",
          marginBottom: "50px",
        }}
      >
        &gt;&gt; ACCÈS INTERDIT ! K.O. &lt;&lt;
      </p>

      <div style={{ position: "relative", width: "240px", height: "160px", marginBottom: "50px" }}>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "220px", height: "8px", background: "#252525", borderTop: "2px solid #E8186D" }} />
        <div style={{ position: "absolute", bottom: "8px", left: "10px", width: "4px", height: "50px", background: "#E8186D" }} />
        <div style={{ position: "absolute", bottom: "8px", right: "10px", width: "4px", height: "50px", background: "#E8186D" }} />
        <div style={{ position: "absolute", bottom: "50px", left: "10px", right: "10px", height: "2px", background: "rgba(255,179,0,0.5)" }} />
        <div style={{ position: "absolute", bottom: "40px", left: "10px", right: "10px", height: "2px", background: "rgba(255,179,0,0.3)" }} />

        <div className="suplex-scene">
          <div className="wrestler-thrower">
            <PixelWrestler color="#E8186D" />
          </div>
          <div className="wrestler-victim">
            <PixelWrestler color="#FFB300" flipped />
          </div>
        </div>
      </div>

      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#E8186D",
          color: "white",
          fontFamily: "Inter, sans-serif",
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "16px 32px",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        ← Retour à l'accueil
      </a>

      <style>{`
        .suplex-scene {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 100px;
        }
        .wrestler-thrower {
          position: absolute;
          bottom: 0;
          left: 30px;
          animation: throwerBridge 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .wrestler-victim {
          position: absolute;
          bottom: 0;
          left: 30px;
          animation: victimFly 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes throwerBridge {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          30% { transform: rotate(0deg) translateY(0); }
          55% { transform: rotate(-20deg) translateY(-4px); }
          70% { transform: rotate(-35deg) translateY(-6px); }
          85% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes victimFly {
          0%, 25% { transform: rotate(0deg) translate(0, 0); opacity: 1; }
          45% { transform: rotate(-90deg) translate(-10px, -30px); opacity: 1; }
          65% { transform: rotate(-180deg) translate(-40px, -20px); opacity: 1; }
          80% { transform: rotate(-180deg) translate(-55px, 0); opacity: 1; }
          85% { transform: rotate(-180deg) translate(-55px, 0); opacity: 0; }
          86% { transform: rotate(0deg) translate(0, 0); opacity: 0; }
          100% { transform: rotate(0deg) translate(0, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function PixelWrestler({ color, flipped }: { color: string; flipped?: boolean }) {
  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 20 30"
      style={{ imageRendering: "pixelated", transform: flipped ? "scaleX(-1)" : "none" }}
      shapeRendering="crispEdges"
    >
      <rect x="7" y="1" width="6" height="6" fill="#F5C9A0" />
      <rect x="7" y="1" width="6" height="2" fill="#3a2a1a" />
      <rect x="6" y="7" width="8" height="9" fill={color} />
      <rect x="3" y="8" width="3" height="7" fill="#F5C9A0" />
      <rect x="14" y="8" width="3" height="7" fill="#F5C9A0" />
      <rect x="6" y="16" width="3" height="8" fill="#1a1a2a" />
      <rect x="11" y="16" width="3" height="8" fill="#1a1a2a" />
      <rect x="6" y="24" width="3" height="3" fill={color} />
      <rect x="11" y="24" width="3" height="3" fill={color} />
    </svg>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: "16px 20px", background: "#161616", border: `1px solid ${color}`,
      borderRadius: "6px", display: "flex", alignItems: "center", gap: "14px",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "6px", background: `${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center", color,
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

function TabButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative", padding: "10px 20px", background: "transparent", border: "none",
        borderBottom: active ? "2px solid #E8186D" : "2px solid transparent",
        color: active ? "#E8186D" : "rgba(255,255,255,0.5)",
        fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: "700",
        letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "8px",
      }}
    >
      {icon} {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          background: "#FFB300", color: "black", fontSize: "10px", fontWeight: "700",
          padding: "2px 6px", borderRadius: "10px", marginLeft: "4px",
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{
      padding: "40px", background: "#161616", border: "1px solid #252525",
      borderRadius: "4px", textAlign: "center", color: "rgba(255,255,255,0.4)",
      fontFamily: "var(--font-pixel)", fontSize: "9px", letterSpacing: "0.1em",
    }}>
      {text}
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  padding: "12px 16px", background: "#161616", border: "1px solid #252525",
  borderRadius: "4px", display: "flex", alignItems: "center", gap: "16px",
};

const thumbStyle: React.CSSProperties = {
  width: "50px", height: "50px", background: "#0D0D0D", borderRadius: "4px",
  overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center",
  justifyContent: "center", padding: "4px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-bebas)", fontSize: "18px", color: "white", lineHeight: 1,
};

const subStyle: React.CSSProperties = {
  fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px",
};

const statPill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px",
  background: "#0D0D0D", border: "1px solid #252525", borderRadius: "3px",
  fontSize: "12px", color: "white", fontWeight: "700", minWidth: "50px", justifyContent: "center",
};

const btnAdd: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "6px", background: "#E8186D",
  color: "white", border: "none", padding: "10px 18px", borderRadius: "4px",
  fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: "700",
  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
};

const btnEdit: React.CSSProperties = {
  background: "transparent", color: "#FFB300", border: "1px solid #FFB300",
  padding: "6px 10px", borderRadius: "3px", cursor: "pointer",
};

const btnDelete: React.CSSProperties = {
  background: "transparent", color: "#E8186D", border: "1px solid #E8186D",
  padding: "6px 10px", borderRadius: "3px", cursor: "pointer",
};

const btnGreen: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "4px", background: "#10B981",
  color: "white", border: "none", padding: "6px 12px", borderRadius: "3px",
  fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
  textTransform: "uppercase", cursor: "pointer",
};

const btnYellow: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "4px", background: "transparent",
  color: "#FFB300", border: "1px solid #FFB300", padding: "6px 12px", borderRadius: "3px",
  fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
  textTransform: "uppercase", cursor: "pointer",
};

const btnRed: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "4px", background: "transparent",
  color: "#E8186D", border: "1px solid #E8186D", padding: "6px 12px", borderRadius: "3px",
  fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
  textTransform: "uppercase", cursor: "pointer",
};

const btnDelete2: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "4px", background: "transparent",
  color: "#E8186D", border: "1px solid #E8186D", padding: "6px 12px", borderRadius: "3px",
  fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
  textTransform: "uppercase", cursor: "pointer",
};

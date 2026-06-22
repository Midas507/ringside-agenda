"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle, Send, Clock, Trash2, User } from "lucide-react";

type Comment = {
  id: number;
  show_id: number;
  user_id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user_profile?: {
    pseudo: string | null;
    role: string;
  };
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ShowComments({ showId }: { showId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [myPendingComment, setMyPendingComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [showId]);

  async function loadData() {
    const { data: { session } } = await supabase.auth.getSession();
    setLoggedIn(!!session);
    setUserId(session?.user.id || null);

    // Récupérer les commentaires approuvés avec les profils
    const { data: approved } = await supabase
      .from("show_comments")
      .select("*")
      .eq("show_id", showId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    // Récupérer les profils pour matcher les pseudos
    if (approved && approved.length > 0) {
      const userIds = [...new Set(approved.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, pseudo, role")
        .in("id", userIds);

      const profilesMap: Record<string, { pseudo: string | null; role: string }> = {};
      if (profiles) {
        profiles.forEach(p => {
          profilesMap[p.id] = { pseudo: p.pseudo, role: p.role };
        });
      }

      setComments(approved.map(c => ({
        ...c,
        user_profile: profilesMap[c.user_id],
      })));
    } else {
      setComments([]);
    }

    // Vérifier si l'utilisateur a un commentaire en attente
    if (session) {
      const { data: myPending } = await supabase
        .from("show_comments")
        .select("*")
        .eq("show_id", showId)
        .eq("user_id", session.user.id)
        .eq("status", "pending")
        .maybeSingle();

      setMyPendingComment(myPending);
    }

    setLoading(false);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (newComment.trim().length < 3) {
      alert("Ton commentaire doit faire au moins 3 caractères");
      return;
    }
    if (newComment.length > 1000) {
      alert("Ton commentaire est trop long (1000 caractères max)");
      return;
    }

    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }

    const { error } = await supabase
      .from("show_comments")
      .insert({
        show_id: showId,
        user_id: session.user.id,
        content: newComment.trim(),
        status: "pending",
      });

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      setNewComment("");
      await loadData();
    }
    setSubmitting(false);
  }

  async function deleteMyPending() {
    if (!myPendingComment) return;
    if (!confirm("Supprimer ton commentaire en attente ?")) return;

    await supabase.from("show_comments").delete().eq("id", myPendingComment.id);
    await loadData();
  }

  async function deleteMyComment(commentId: number) {
    if (!confirm("Supprimer ton commentaire ?")) return;
    await supabase.from("show_comments").delete().eq("id", commentId);
    await loadData();
  }

  if (loading) return null;

  return (
    <div style={{
      padding: "20px 24px",
      background: "#161616",
      border: "1px solid #252525",
      borderRadius: "8px",
      marginTop: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <MessageCircle size={18} style={{ color: "#E8186D" }} />
        <h3 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "22px",
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}>
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Formulaire d'ajout */}
      {loggedIn ? (
        myPendingComment ? (
          <div style={{
            padding: "14px 16px",
            background: "rgba(255,179,0,0.08)",
            border: "1px solid #FFB300",
            borderRadius: "6px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}>
            <Clock size={16} style={{ color: "#FFB300", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "12px", color: "#FFB300", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "4px" }}>
                EN ATTENTE DE MODÉRATION
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
                "{myPendingComment.content}"
              </p>
            </div>
            <button
              onClick={deleteMyPending}
              style={{
                background: "transparent",
                color: "#E8186D",
                border: "1px solid #E8186D",
                padding: "6px 12px",
                borderRadius: "3px",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Supprimer
            </button>
          </div>
        ) : (
          <form onSubmit={submitComment} style={{ marginBottom: "20px" }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partage ton avis sur ce show..."
              rows={3}
              maxLength={1000}
              style={{
                width: "100%",
                background: "#0D0D0D",
                border: "1px solid #252525",
                color: "white",
                fontSize: "13px",
                padding: "12px",
                borderRadius: "4px",
                outline: "none",
                resize: "vertical",
                fontFamily: "Inter, sans-serif",
                marginBottom: "8px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                Ton commentaire sera publié après validation par notre équipe.
              </p>
              <button
                type="submit"
                disabled={submitting || newComment.trim().length < 3}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: newComment.trim().length < 3 ? "#444" : "#E8186D",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: newComment.trim().length < 3 ? "not-allowed" : "pointer",
                }}
              >
                <Send size={12} /> {submitting ? "Envoi..." : "Poster"}
              </button>
            </div>
          </form>
        )
      ) : (
        <div style={{
          padding: "16px",
          background: "#0D0D0D",
          border: "1px solid #252525",
          borderRadius: "6px",
          textAlign: "center",
          marginBottom: "20px",
        }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
            Connecte-toi pour laisser un commentaire
          </p>
          <a href="/connexion" style={{
            display: "inline-block",
            background: "#E8186D",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Se connecter
          </a>
        </div>
      )}

      {/* Liste des commentaires */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
            Aucun commentaire pour le moment. Sois le premier à donner ton avis !
          </p>
        ) : (
          comments.map((c) => {
            const isMine = c.user_id === userId;
            const role = c.user_profile?.role || "fan";
            const roleColor = role === "admin" ? "#10B981" : role === "promotion" ? "#FFB300" : "#E8186D";

            return (
              <div key={c.id} style={{
                padding: "14px 16px",
                background: "#0D0D0D",
                border: "1px solid #252525",
                borderRadius: "6px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <div style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: `${roleColor}22`,
                    border: `1px solid ${roleColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <User size={12} style={{ color: roleColor }} />
                  </div>
                  <span style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "15px",
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}>
                    {c.user_profile?.pseudo || "Anonyme"}
                  </span>
                  {role !== "fan" && (
                    <span style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "6px",
                      background: roleColor,
                      color: role === "admin" ? "white" : "black",
                      padding: "2px 6px",
                      borderRadius: "2px",
                      letterSpacing: "0.1em",
                    }}>
                      {role === "admin" ? "ADMIN" : "PROMO"}
                    </span>
                  )}
                  <span style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    marginLeft: "auto",
                  }}>
                    {formatDate(c.created_at)}
                  </span>
                  {isMine && (
                    <button
                      onClick={() => deleteMyComment(c.id)}
                      style={{
                        background: "transparent",
                        color: "rgba(255,255,255,0.4)",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                      title="Supprimer mon commentaire"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {c.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Facebook, Twitter, MessageCircle, Link as LinkIcon, Check, Share2 } from "lucide-react";

export default function ShareButtons({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);

  // Récupère l'URL courante si pas spécifiée
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback pour anciens navigateurs
      const tmp = document.createElement("textarea");
      tmp.value = shareUrl;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{
      padding: "16px 20px",
      background: "#161616",
      border: "1px solid #252525",
      borderRadius: "6px",
      marginTop: "16px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
      }}>
        <Share2 size={16} style={{ color: "#FFB300" }} />
        <h4 style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          PARTAGER
        </h4>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            background: "#1877F2",
            color: "white",
          }}
        >
          <Facebook size={14} /> Facebook
        </a>
        <a
          href={links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            background: "#000",
            color: "white",
            border: "1px solid #333",
          }}
        >
          <Twitter size={14} /> Twitter
        </a>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            background: "#25D366",
            color: "white",
          }}
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <button
          onClick={copyLink}
          style={{
            ...btnStyle,
            background: copied ? "#10B981" : "transparent",
            color: copied ? "white" : "#FFB300",
            border: copied ? "1px solid #10B981" : "1px solid #FFB300",
            cursor: "pointer",
          }}
        >
          {copied ? <><Check size={14} /> Copié !</> : <><LinkIcon size={14} /> Copier le lien</>}
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "3px",
  fontFamily: "Inter, sans-serif",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  textDecoration: "none",
  border: "none",
};

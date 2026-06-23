import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Instagram, Facebook, X } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-8 pt-24">
        <h1 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "64px",
          lineHeight: 1,
          color: "white",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}>
          CONTACT<span style={{ color: "#E8186D" }}>.</span>
        </h1>
        <p style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
          marginBottom: "32px",
        }}>
          &gt;&gt; UNE QUESTION ? ON RÉPOND À TOUT &lt;&lt;
        </p>

        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #E8186D",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "28px",
            color: "#E8186D",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            Email
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "20px",
          }}>
            Pour toute question, partenariat, ou demande d'ajout de show, écris-nous directement :
          </p>
          <a
            href="mailto:ringsideagenda@gmail.com"
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
              padding: "14px 24px",
              borderRadius: "3px",
              textDecoration: "none",
            }}
          >
            <Mail size={14} /> ringsideagenda@gmail.com
          </a>
        </section>

        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "28px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Tu organises des shows ?
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "12px",
          }}>
            Tu es promoteur, organisateur ou fédération et tu veux référencer tes shows sur Ringside Agenda ?
          </p>
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            lineHeight: 1.7,
          }}>
            Envoie-nous un email avec les infos de ton événement : titre, date, ville, lien billetterie et affiche. On t'ajoute rapidement !
          </p>
        </section>

        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "28px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Réseaux sociaux
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <a href="https://www.instagram.com/ringsideagenda" target="_blank" rel="noopener noreferrer" style={socialBtn}>
              <Instagram size={18} />
            </a>
            <a href="https://www.facebook.com/ringsideagenda" target="_blank" rel="noopener noreferrer" style={socialBtn}>
              <Facebook size={18} />
            </a>
            <a href="https://x.com/ringsideagenda" target="_blank" rel="noopener noreferrer" style={socialBtn}>
              <X size={18} />
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

const socialBtn: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "6px",
  background: "rgba(232,24,109,0.1)",
  border: "1px solid #E8186D",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#E8186D",
};

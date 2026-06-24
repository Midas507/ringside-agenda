import { Megaphone, Lightbulb, ArrowRight } from "lucide-react";

export default function CommunauteSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Titre */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
          <span style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "#FFB300",
            letterSpacing: "0.1em",
          }}>
            &gt;&gt; REJOINS LA COMMUNAUTÉ &lt;&lt;
          </span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "56px",
          color: "white",
          textTransform: "uppercase",
          lineHeight: 0.95,
          letterSpacing: "0.02em",
        }}>
          TOI AUSSI TU PEUX <span style={{ color: "#FFB300" }}>CONTRIBUER</span>
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "15px",
          lineHeight: 1.6,
          maxWidth: "560px",
          margin: "12px auto 0",
        }}>
          Ringside Agenda est construit avec et pour la communauté du catch francophone. Ton aide compte !
        </p>
      </div>

      {/* 2 cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carte 1 : Proposer un show */}
        <a
          href="/proposer-un-show"
          style={{
            display: "block",
            padding: "32px",
            background: "linear-gradient(135deg, rgba(232,24,109,0.1) 0%, #161616 100%)",
            border: "1px solid #E8186D",
            borderRadius: "12px",
            textDecoration: "none",
            transition: "transform 0.2s, border-color 0.2s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = "#FFB300";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#E8186D";
          }}
        >
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "rgba(232,24,109,0.2)",
            border: "1px solid #E8186D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}>
            <Megaphone size={24} style={{ color: "#E8186D" }} />
          </div>

          <h3 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "10px",
            lineHeight: 1,
          }}>
            Tu connais un show<br />pas encore listé ?
          </h3>

          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "20px",
          }}>
            Aide-nous à compléter le calendrier ! Signale un événement manquant en quelques secondes. Pas besoin d'avoir toutes les infos.
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#E8186D",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            📣 Proposer un show <ArrowRight size={14} />
          </div>
        </a>

        {/* Carte 2 : Idée / Suggestion */}
        <a
          href="/suggestion"
          style={{
            display: "block",
            padding: "32px",
            background: "linear-gradient(135deg, rgba(255,179,0,0.1) 0%, #161616 100%)",
            border: "1px solid #FFB300",
            borderRadius: "12px",
            textDecoration: "none",
            transition: "transform 0.2s, border-color 0.2s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = "#E8186D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#FFB300";
          }}
        >
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "rgba(255,179,0,0.2)",
            border: "1px solid #FFB300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}>
            <Lightbulb size={24} style={{ color: "#FFB300" }} />
          </div>

          <h3 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "10px",
            lineHeight: 1,
          }}>
            Une idée pour<br />améliorer le site ?
          </h3>

          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "20px",
          }}>
            Tu as une fonctionnalité à proposer, un bug à signaler ou un retour à partager ? On lit tout et on prend tout en compte !
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#FFB300",
            color: "black",
            padding: "10px 20px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            💡 Partager une idée <ArrowRight size={14} />
          </div>
        </a>
      </div>
    </section>
  );
}

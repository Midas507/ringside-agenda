import { Megaphone, Zap, Crown, Mail, ArrowRight, Bell, HelpCircle } from "lucide-react";

export default function PromoteurSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #1a0810 0%, #161616 50%, #0d0d0d 100%)",
          border: "1px solid #E8186D",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "48px 40px",
        }}
      >
        {/* Effet décoratif */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(232,24,109,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-50px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(255,179,0,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gauche : Titre + CTA */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  background: "rgba(232,24,109,0.15)",
                  border: "1px solid #E8186D",
                  borderRadius: "3px",
                  marginBottom: "20px",
                }}
              >
                <Megaphone size={12} style={{ color: "#E8186D" }} />
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8px",
                    color: "#E8186D",
                    letterSpacing: "0.1em",
                  }}
                >
                  ESPACE PROMOTEUR
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "56px",
                  lineHeight: 0.95,
                  color: "white",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                  letterSpacing: "0.02em",
                }}
              >
                BOOSTE TES <br />
                <span style={{ color: "#E8186D" }}>SHOWS</span>
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  marginBottom: "20px",
                  maxWidth: "480px",
                }}
              >
                Tu organises des shows de catch ? Découvre les <strong style={{ color: "white" }}>Pass Promotion</strong> à venir
                pour gérer toi-même tes événements, les mettre en avant et toucher
                massivement les fans de catch francophones.
              </p>

              <p
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  color: "#FFB300",
                  letterSpacing: "0.1em",
                  marginBottom: "24px",
                }}
              >
                &gt;&gt; BIENTÔT DISPONIBLE &lt;&lt;
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href="mailto:ringsideagenda@gmail.com?subject=Pass Promotion - Pré-inscription"
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
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  <Bell size={14} /> Être prévenu au lancement
                </a>
                <a
                  href="/faq-promoteurs"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "transparent",
                    color: "#10B981",
                    border: "1px solid #10B981",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "700",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "14px 24px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  <HelpCircle size={14} /> Voir la FAQ
                </a>
                <a
                  href="mailto:ringsideagenda@gmail.com?subject=Ajout d'un show"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "transparent",
                    color: "#FFB300",
                    border: "1px solid #FFB300",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "700",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "14px 24px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  Référencer un show <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Droite : Les 2 Pass */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <PassCard
                icon={<Zap size={20} />}
                label="PASS PROMOTION"
                title="Gère tes propres shows"
                features={[
                  "Ajout illimité d'événements",
                  "Modification en temps réel",
                  "Statistiques de tes shows",
                ]}
              />
              <PassCard
                icon={<Crown size={20} />}
                label="PASS PROMOTION PREMIUM"
                title="Mets-toi en avant"
                features={[
                  "Tout du Pass Promotion",
                  "Mise en avant sur l'accueil",
                  "Notifications push aux fans",
                  "Outils marketing exclusifs",
                ]}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PassCard({
  icon,
  label,
  title,
  features,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: "20px 22px",
        background: highlight ? "rgba(232,24,109,0.08)" : "#0D0D0D",
        border: `1px solid ${highlight ? "#E8186D" : "#252525"}`,
        borderRadius: "8px",
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "16px",
            background: "#FFB300",
            color: "black",
            fontFamily: "var(--font-pixel)",
            fontSize: "6px",
            letterSpacing: "0.1em",
            padding: "4px 8px",
            borderRadius: "2px",
            fontWeight: 700,
          }}
        >
          PREMIUM
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            borderRadius: "8px",
            background: highlight ? "#E8186D" : "rgba(255,179,0,0.1)",
            border: highlight ? "1px solid #E8186D" : "1px solid #FFB300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: highlight ? "white" : "#FFB300",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: highlight ? "#E8186D" : "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "2px",
            }}
          >
            {label}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "20px",
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {features.map((feat, i) => (
          <li
            key={i}
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "12px",
              lineHeight: 1.6,
              padding: "3px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: highlight ? "#E8186D" : "#FFB300", fontSize: "14px" }}>✓</span>
            {feat}
          </li>
        ))}
      </ul>
    </div>
  );
}

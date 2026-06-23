"use client";
import Header from "./Header";
import Footer from "./Footer";
import { Calendar, MapPin, Plus, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function APropos() {
  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-8 pt-24">
        {/* Titre */}
        <div className="mb-12 text-center">
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "72px",
              lineHeight: 1,
              color: "white",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            À <span style={{ color: "#E8186D" }}>PROPOS</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            &gt;&gt; LE CALENDRIER DU CATCH FRANCOPHONE &lt;&lt;
          </p>
        </div>

        {/* Présentation */}
        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #E8186D",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "#E8186D",
            textTransform: "uppercase",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}>
            Qui sommes-nous ?
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "15px",
            lineHeight: 1.8,
            marginBottom: "12px",
          }}>
            <strong style={{ color: "white" }}>Ringside Agenda</strong> est le calendrier référence du catch indépendant francophone.
            Nous regroupons tous les shows de catch organisés en France, Belgique et Suisse pour t'offrir une vue d'ensemble
            sur la scène catch francophone, et te permettre de ne plus jamais rater un événement près de chez toi.
          </p>
          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            lineHeight: 1.7,
          }}>
            Que tu sois fan de catch depuis toujours ou que tu découvres cet univers, Ringside Agenda te permet de
            suivre l'actualité des promotions, de trouver des shows près de chez toi grâce à notre carte interactive,
            et de réserver tes places en quelques clics.
          </p>
        </section>

        {/* Notre mission */}
        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "#FFB300",
            textTransform: "uppercase",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}>
            Notre mission
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.8,
            marginBottom: "16px",
          }}>
            La scène catch francophone est riche, diverse et passionnée — mais elle reste souvent méconnue du grand public.
            De nombreuses promotions talentueuses travaillent dans l'ombre, organisant des shows incroyables qui méritent
            d'être vus.
          </p>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.8,
          }}>
            <strong style={{ color: "white" }}>Notre objectif :</strong> donner de la visibilité à toutes ces promotions,
            créer du lien entre les fans et les promotions, et faire grandir la communauté du catch francophone.
            Un seul endroit pour tout savoir, un seul agenda pour tout planifier.
          </p>
        </section>

        {/* Comment utiliser */}
        <section style={{ marginBottom: "24px" }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}>
            Comment <span style={{ color: "#E8186D" }}>utiliser le site</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Calendrier */}
            <div style={{
              padding: "20px",
              background: "#161616",
              border: "1px solid #252525",
              borderRadius: "6px",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "4px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}>
                <Calendar size={22} style={{ color: "#E8186D" }} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "white",
                textTransform: "uppercase",
                marginBottom: "8px",
                letterSpacing: "0.04em",
              }}>
                Le Calendrier
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.6 }}>
                Tous les shows à venir, organisés par mois. Clique sur un show pour voir les détails complets et réserver tes places.
              </p>
            </div>

            {/* Carte */}
            <div style={{
              padding: "20px",
              background: "#161616",
              border: "1px solid #252525",
              borderRadius: "6px",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "4px",
                background: "rgba(255,179,0,0.1)",
                border: "1px solid #FFB300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}>
                <MapPin size={22} style={{ color: "#FFB300" }} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "white",
                textTransform: "uppercase",
                marginBottom: "8px",
                letterSpacing: "0.04em",
              }}>
                La Carte
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.6 }}>
                Trouve les shows près de chez toi grâce à notre carte interactive. Clique sur un pin pour voir le show et accéder à sa billetterie.
              </p>
            </div>

            {/* promotions */}
            <div style={{
              padding: "20px",
              background: "#161616",
              border: "1px solid #252525",
              borderRadius: "6px",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "4px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}>
                <span style={{ color: "#E8186D", fontSize: "22px", fontWeight: "bold" }}>★</span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "22px",
                color: "white",
                textTransform: "uppercase",
                marginBottom: "8px",
                letterSpacing: "0.04em",
              }}>
                Les promotions
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.6 }}>
                Découvre toutes les promotions de catch francophones, leur histoire, leurs prochains shows et leurs réseaux sociaux.
              </p>
            </div>
          </div>
        </section>

        {/* Ajouter un show */}
        <section style={{
          padding: "32px",
          background: "linear-gradient(135deg, #1a0810 0%, #161616 100%)",
          border: "1px solid #E8186D",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            background: "rgba(232,24,109,0.15)",
            border: "1px solid #E8186D",
            borderRadius: "3px",
            marginBottom: "16px",
          }}>
            <Plus size={14} style={{ color: "#E8186D" }} />
            <span style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "#E8186D",
              letterSpacing: "0.1em",
            }}>
              POUR LES PROMOTIONS
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "36px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "12px",
            letterSpacing: "0.04em",
          }}>
            Ajoute ton <span style={{ color: "#E8186D" }}>show</span>
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "20px",
          }}>
            Tu organises des shows de catch en France, Belgique ou Suisse ?
            Ringside Agenda est gratuit pour toutes les promotions.
            Référence ton événement et touche notre communauté de fans !
          </p>

          <a
            href="mailto:contact@ringsideagenda.com"
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
              padding: "12px 24px",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFB300";
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#E8186D";
              e.currentTarget.style.color = "white";
            }}
          >
            <Mail size={14} /> Nous contacter
          </a>
        </section>

        {/* Contact */}
        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}>
            Contact
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "20px",
          }}>
            Une question ? Un partenariat ? Un show à ajouter ? On répond à tous les messages.
          </p>

          <a
            href="mailto:contact@ringsideagenda.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#FFB300",
              fontFamily: "Inter, sans-serif",
              fontWeight: "700",
              fontSize: "14px",
              textDecoration: "none",
              padding: "10px 0",
            }}
          >
            <Mail size={16} /> contact@ringsideagenda.com
          </a>
        </section>

        {/* Réseaux sociaux */}
        <section style={{
          padding: "32px",
          background: "#161616",
          border: "1px solid #252525",
          borderRadius: "8px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}>
            Suis-nous
          </h2>

          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "13px",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}>
            Toute l'actualité du catch francophone, des annonces de shows et des contenus exclusifs sur nos réseaux.
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}>
            <a
              href="https://www.instagram.com/ringsideagenda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "6px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E8186D",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8186D";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(232,24,109,0.1)";
                e.currentTarget.style.color = "#E8186D";
              }}
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/ringsideagenda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "6px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E8186D",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8186D";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(232,24,109,0.1)";
                e.currentTarget.style.color = "#E8186D";
              }}
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://x.com/ringsideagenda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "6px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E8186D",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8186D";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(232,24,109,0.1)";
                e.currentTarget.style.color = "#E8186D";
              }}
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://www.youtube.com/@ringsideagenda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "6px",
                background: "rgba(232,24,109,0.1)",
                border: "1px solid #E8186D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E8186D",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8186D";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(232,24,109,0.1)";
                e.currentTarget.style.color = "#E8186D";
              }}
            >
              <Youtube size={20} />
            </a>
          </div>
        </section>

        {/* Footer signature */}
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
          }}>
            &gt;&gt; MADE WITH PASSION FOR THE FRENCH SPEAKING WRESTLING SCENE &lt;&lt;
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

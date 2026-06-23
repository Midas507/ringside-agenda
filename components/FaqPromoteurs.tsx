"use client";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ChevronDown, Megaphone, Mail, Sparkles, HelpCircle } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

type Section = {
  title: string;
  icon: React.ReactNode;
  color: string;
  questions: FAQ[];
};

const sections: Section[] = [
  {
    title: "Référencement gratuit",
    icon: <Megaphone size={18} />,
    color: "#E8186D",
    questions: [
      {
        question: "Comment référencer mon show gratuitement ?",
        answer: "C'est très simple ! Envoie-nous un mail à ringsideagenda@gmail.com avec :\n• Le titre du show\n• La date et l'heure\n• Le lieu (adresse complète)\n• Le lien de billetterie\n• L'affiche du show\n• Une courte description\n\nOn ajoute ton événement sous 24-48h et il sera visible sur le calendrier, la carte et la page de ta fédération.",
      },
      {
        question: "Le référencement est-il vraiment gratuit ?",
        answer: "Oui, à 100% ! Le référencement basique d'un show est totalement gratuit, sans engagement, sans limite de nombre de shows. Notre mission est de soutenir le catch francophone, pas de te taxer.",
      },
      {
        question: "Ma fédération n'apparaît pas sur le site, que faire ?",
        answer: "Contacte-nous à ringsideagenda@gmail.com avec les infos de ta fédération (nom, pays, logo, description, réseaux sociaux). On crée ta page dédiée gratuitement sous 24-48h.",
      },
      {
        question: "Puis-je modifier mes shows une fois publiés ?",
        answer: "Bien sûr ! Pour le moment, envoie-nous tes modifications par mail et nous les appliquons rapidement. Avec le Pass Promotion (à venir), tu pourras tout gérer toi-même en autonomie.",
      },
    ],
  },
  {
    title: "Pass Promotion (à venir)",
    icon: <Sparkles size={18} />,
    color: "#FFB300",
    questions: [
      {
        question: "Qu'est-ce que le Pass Promotion ?",
        answer: "Le Pass Promotion est un abonnement à venir qui te permettra de gérer toi-même tes shows en autonomie. Tu auras accès à un dashboard pour ajouter, modifier, supprimer tes événements en temps réel, sans passer par notre équipe.",
      },
      {
        question: "Quels seront les tarifs ?",
        answer: "Les tarifs seront annoncés au lancement, mais on prévoit des formules accessibles, adaptées aux petites comme aux grandes promotions. Tu peux te pré-inscrire en envoyant un mail pour être prévenu en avant-première (et bénéficier de tarifs préférentiels au lancement).",
      },
      {
        question: "Quelle est la différence avec le Pass Premium ?",
        answer: "Le Pass Premium (l'offre supérieure) ajoute des fonctionnalités exclusives :\n• Mise en avant de tes shows sur la page d'accueil\n• Notifications push envoyées aux fans qui te suivent\n• Statistiques détaillées (vues, clics billetterie, engagement)\n• Outils marketing exclusifs\n• Support prioritaire",
      },
      {
        question: "Y aura-t-il un essai gratuit ?",
        answer: "Oui, on prévoit une période d'essai gratuit pour que tu puisses tester toutes les fonctionnalités avant de t'engager.",
      },
    ],
  },
  {
    title: "Visibilité et statistiques",
    icon: <HelpCircle size={18} />,
    color: "#10B981",
    questions: [
      {
        question: "Combien de personnes visitent Ringside Agenda ?",
        answer: "Le site est jeune et en croissance constante. Nous communiquons nos chiffres en transparence : le nombre de visiteurs, de pages vues et de clics sur les billetteries est tracé pour chaque show et fédération. Tu peux nous demander tes propres statistiques par mail.",
      },
      {
        question: "Comment être mis en avant sur la page d'accueil ?",
        answer: "L'encart 'À LA UNE' en page d'accueil sera réservé aux promoteurs Pass Premium. Pour le moment, certains shows peuvent être mis en avant manuellement à notre discrétion (gros événements, premières d'une fédération, etc.). Contacte-nous si tu penses que ton show mérite d'y être !",
      },
      {
        question: "Mes fans peuvent-ils me suivre sur le site ?",
        answer: "Oui ! Chaque fan connecté peut suivre ta fédération en cliquant sur le bouton ❤️ Suivre sur ta page. Avec le Pass Premium, tu pourras leur envoyer des notifications quand tu annonces un nouveau show.",
      },
      {
        question: "Mes shows apparaissent-ils sur Google ?",
        answer: "Oui ! Chaque page de show est optimisée SEO avec des données structurées Schema.org. Google peut afficher tes événements directement dans ses résultats de recherche, avec la date, le lieu et le lien de billetterie. C'est de la visibilité gratuite !",
      },
    ],
  },
  {
    title: "Compte et inscription",
    icon: <Mail size={18} />,
    color: "#E8186D",
    questions: [
      {
        question: "Comment créer un compte Promotion ?",
        answer: "Rends-toi sur la page d'inscription, choisis 'Je suis Promo' et remplis le formulaire. Ton compte sera créé immédiatement mais nécessitera une validation manuelle par notre équipe (sous 24-48h) avant de pouvoir gérer une fédération.",
      },
      {
        question: "Pourquoi une validation manuelle ?",
        answer: "C'est pour éviter que n'importe qui s'attribue une fédération qui n'est pas la sienne. On vérifie rapidement que tu es bien le représentant officiel de la fédération que tu déclares (via tes réseaux sociaux, un email pro, etc.).",
      },
      {
        question: "Je gère plusieurs promotions, comment faire ?",
        answer: "Contacte-nous à ringsideagenda@gmail.com en précisant les différentes promotions que tu gères. Nous mettrons en place un accès multi-promotions pour toi.",
      },
      {
        question: "Comment vous contacter ?",
        answer: "Pour toute question, demande, suggestion ou partenariat : ringsideagenda@gmail.com\n\nOn répond généralement sous 24h en semaine. Pour les urgences (show à publier rapidement), précise-le dans le sujet du mail !",
      },
    ],
  },
];

export default function FaqPromoteurs() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenItems({ ...openItems, [key]: !openItems[key] });
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            background: "rgba(232,24,109,0.15)",
            border: "1px solid #E8186D",
            borderRadius: "3px",
            marginBottom: "20px",
          }}>
            <HelpCircle size={12} style={{ color: "#E8186D" }} />
            <span style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "#E8186D",
              letterSpacing: "0.1em",
            }}>
              ESPACE PROMOTEUR
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "72px",
            color: "white",
            textTransform: "uppercase",
            lineHeight: 0.95,
            marginBottom: "16px",
            letterSpacing: "0.02em",
          }}>
            FAQ <span style={{ color: "#E8186D" }}>PROMOTEURS</span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "16px",
            lineHeight: 1.6,
            maxWidth: "640px",
            margin: "0 auto",
          }}>
            Toutes les réponses pour bien utiliser Ringside Agenda et faire briller ta fédération.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                paddingBottom: "10px",
                borderBottom: `1px solid ${section.color}`,
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: `${section.color}22`,
                  border: `1px solid ${section.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: section.color,
                }}>
                  {section.icon}
                </div>
                <h2 style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "32px",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  {section.title}
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.questions.map((q, qIdx) => {
                  const key = `${sIdx}-${qIdx}`;
                  const isOpen = openItems[key];

                  return (
                    <div
                      key={qIdx}
                      style={{
                        background: "#161616",
                        border: `1px solid ${isOpen ? section.color : "#252525"}`,
                        borderRadius: "6px",
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <button
                        onClick={() => toggle(key)}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          background: "transparent",
                          border: "none",
                          color: "white",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: "700",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                      >
                        <span>{q.question}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            color: section.color,
                            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                            transition: "transform 0.2s",
                            flexShrink: 0,
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div style={{
                          padding: "0 20px 20px 20px",
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "13px",
                          lineHeight: 1.7,
                          whiteSpace: "pre-line",
                        }}>
                          {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Contact */}
        <div style={{
          marginTop: "48px",
          padding: "32px",
          background: "linear-gradient(135deg, rgba(232,24,109,0.1) 0%, rgba(255,179,0,0.05) 100%)",
          border: "1px solid #E8186D",
          borderRadius: "8px",
          textAlign: "center",
        }}>
          <Mail size={32} style={{ color: "#FFB300", margin: "0 auto 12px" }} />
          <h3 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "32px",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "8px",
            letterSpacing: "0.04em",
          }}>
            Une autre question ?
          </h3>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            marginBottom: "20px",
            maxWidth: "440px",
            margin: "0 auto 20px",
          }}>
            On répond à tous les mails ! N'hésite pas à nous contacter pour toute demande.
          </p>
          <a
            href="mailto:ringsideagenda@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#E8186D",
              color: "white",
              padding: "14px 28px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <Mail size={14} /> Nous contacter
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

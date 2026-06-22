import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConfidentialitePage() {
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-8 pt-24">
        <h1 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "56px",
          lineHeight: 1,
          color: "white",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}>
          POLITIQUE DE <span style={{ color: "#E8186D" }}>CONFIDENTIALITÉ</span>
        </h1>
        <p style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
          marginBottom: "32px",
        }}>
          &gt;&gt; PROTECTION DE TES DONNÉES &lt;&lt;
        </p>

        <Section title="Données collectées">
          <p>Ringside Agenda ne collecte aucune donnée personnelle de ses visiteurs.</p>
          <p>Aucun compte n'est requis pour consulter le site. La navigation est entièrement anonyme.</p>
        </Section>

        <Section title="Cookies">
          <p>Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement (session, préférences).</p>
          <p>Aucun cookie de tracking publicitaire ou d'analyse n'est utilisé sans consentement.</p>
        </Section>

        <Section title="Newsletter">
          <p>Si tu t'abonnes à notre newsletter, ton email est stocké uniquement pour t'envoyer les actualités du site.</p>
          <p>Tu peux te désabonner à tout moment via le lien présent dans chaque email, ou en nous contactant à <a href="mailto:ringsideagenda@gmail.com" style={linkStyle}>ringsideagenda@gmail.com</a>.</p>
        </Section>

        <Section title="Partenaires et services tiers">
          <p>Le site peut contenir des liens vers des sites tiers (billetteries, réseaux sociaux des fédérations). Ringside Agenda n'est pas responsable de leur politique de confidentialité.</p>
          <p>Le site utilise <strong>Supabase</strong> comme base de données et <strong>Vercel</strong> pour l'hébergement. Ces services peuvent collecter des données techniques (adresse IP, navigateur) à des fins de sécurité et de fonctionnement.</p>
        </Section>

        <Section title="Tes droits (RGPD)">
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), tu disposes des droits suivants :</p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
            <li>Droit d'accès à tes données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          <p style={{ marginTop: "12px" }}>Pour exercer ces droits, contacte-nous à <a href="mailto:ringsideagenda@gmail.com" style={linkStyle}>ringsideagenda@gmail.com</a>.</p>
        </Section>

        <Section title="Modifications">
          <p>Cette politique peut être mise à jour à tout moment. La date de dernière modification est affichée ci-dessous.</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "12px" }}>
            Dernière mise à jour : Juin 2026
          </p>
        </Section>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      padding: "24px",
      background: "#161616",
      border: "1px solid #252525",
      borderRadius: "6px",
      marginBottom: "16px",
    }}>
      <h2 style={{
        fontFamily: "var(--font-bebas)",
        fontSize: "22px",
        color: "#E8186D",
        textTransform: "uppercase",
        marginBottom: "12px",
        letterSpacing: "0.04em",
      }}>
        {title}
      </h2>
      <div style={{
        color: "rgba(255,255,255,0.7)",
        fontSize: "14px",
        lineHeight: 1.7,
      }}>
        {children}
      </div>
    </section>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#FFB300",
  textDecoration: "none",
};

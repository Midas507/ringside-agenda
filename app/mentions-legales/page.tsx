import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MentionsLegalesPage() {
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
          MENTIONS <span style={{ color: "#E8186D" }}>LÉGALES</span>
        </h1>
        <p style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
          marginBottom: "32px",
        }}>
          &gt;&gt; INFORMATIONS LÉGALES &lt;&lt;
        </p>

        <Section title="Éditeur du site">
          <p><strong>Ringside Agenda</strong></p>
          <p>Le calendrier référence du catch indépendant francophone.</p>
          <p>Email : <a href="mailto:ringsideagenda@gmail.com" style={linkStyle}>ringsideagenda@gmail.com</a></p>
        </Section>

        <Section title="Hébergement">
          <p>Le site est hébergé par <strong>Vercel Inc.</strong></p>
          <p>440 N Barranca Ave #4133, Covina, CA 91723, United States</p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>L'ensemble du contenu du site (textes, images, logos, design) est protégé par le droit d'auteur.</p>
          <p>Les logos des fédérations, les affiches de shows et les marques apparaissant sur le site appartiennent à leurs propriétaires respectifs. Ringside Agenda les affiche dans le cadre de la promotion de leurs événements.</p>
          <p>Toute reproduction, modification ou diffusion sans autorisation est interdite.</p>
        </Section>

        <Section title="Responsabilité">
          <p>Ringside Agenda met tout en œuvre pour fournir des informations exactes et à jour. Cependant, le site ne peut garantir l'exactitude des informations transmises par les fédérations (dates, lieux, billetteries).</p>
          <p>Les utilisateurs sont invités à vérifier les informations directement auprès des organisateurs avant tout déplacement ou achat.</p>
        </Section>

        <Section title="Contact">
          <p>Pour toute question relative au site ou aux mentions légales, contactez-nous à : <a href="mailto:ringsideagenda@gmail.com" style={linkStyle}>ringsideagenda@gmail.com</a></p>
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

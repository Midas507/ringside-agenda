export default function SeoSection() {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 24px",
        borderTop: "1px solid #1a1a1a",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Bloc 1 */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "#E8186D",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "12px",
            }}
          >
            Calendrier catch France
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.7 }}>
            Ringside Agenda recense tous les shows de catch en France. Des grandes métropoles comme Paris, Lyon ou Marseille aux villes de province, retrouvez l'agenda complet du catch indépendant français. APC, KHAO Wrestling, RIXE, NWC, TPW, ECC et dizaines d'autres promotions sont référencées.
          </p>
        </div>

        {/* Bloc 2 */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "#E8186D",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "12px",
            }}
          >
            Agenda catch Belgique & Suisse
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.7 }}>
            Le catch francophone ne s'arrête pas aux frontières françaises ! Ringside Agenda couvre également les shows de catch en Belgique (Bruxelles, Liège, Charleroi, Roeselare) et en Suisse (Genève, Lausanne, Bullet). Retrouvez tous les événements catch belges et suisses sur une seule plateforme.
          </p>
        </div>

        {/* Bloc 3 */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "#E8186D",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "12px",
            }}
          >
            Promotions de catch indépendant
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.7 }}>
            Des dizaines de promotions de catch indépendant sont référencées sur Ringside Agenda. Chaque promotion dispose de sa propre page avec ses prochains shows, son historique et ses informations. Qu'il s'agisse de grandes structures ou de petites associations locales, toutes les promotions de wrestling francophone sont les bienvenues.
          </p>
        </div>

        {/* Bloc 4 */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "22px",
              color: "#E8186D",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "12px",
            }}
          >
            Trouve un show près de chez toi
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.7 }}>
            Grâce à notre carte interactive, trouvez facilement un show de catch près de chez vous. Filtrez par région, par pays ou par promotion. Que vous soyez à Paris, Bordeaux, Lille, Strasbourg, Nantes ou dans n'importe quelle ville de France, Belgique ou Suisse, Ringside Agenda vous aide à trouver le prochain événement catch à proximité.
          </p>
        </div>
      </div>

      {/* FAQ SEO */}
      <div style={{ marginTop: "48px", borderTop: "1px solid #1a1a1a", paddingTop: "40px" }}>
        <h2
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "28px",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Questions fréquentes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <FaqItem
            q="Qu'est-ce que Ringside Agenda ?"
            a="Ringside Agenda est le calendrier de référence du catch indépendant francophone. Il recense tous les shows de catch en France, Belgique et Suisse. Promotions, dates, lieux, billetterie : toutes les infos sont centralisées en un seul endroit."
          />
          <FaqItem
            q="Comment trouver des shows de catch près de chez moi ?"
            a="Utilisez notre carte interactive disponible dans l'onglet Carte. Elle affiche tous les événements catch à venir sur une carte de France, Belgique et Suisse. Zoomez sur votre région pour trouver les shows les plus proches."
          />
          <FaqItem
            q="Quelles promotions de catch sont référencées ?"
            a="Ringside Agenda référence toutes les grandes promotions francophones : APC (Absolute Prestige Catch), KHAO Wrestling, RIXE, NWC (New Wrestling Concept), TPW (Tigers Pro Wrestling), ECC (Est Catch Compagnie), Geneva Total Wrestling, Pro Wrestling AllStars, HPW, Drag Attack, et bien d'autres encore."
          />
          <FaqItem
            q="Le site couvre-t-il uniquement la France ?"
            a="Non ! Ringside Agenda couvre l'ensemble du territoire francophone : la France (toutes régions), la Belgique (Wallonie et Flandre) et la Suisse romande. Tous les shows de catch francophones sont référencés."
          />
          <FaqItem
            q="Comment proposer un show manquant ?"
            a="Si vous connaissez un show de catch qui n'est pas encore référencé sur Ringside Agenda, vous pouvez le proposer via notre formulaire 'Proposer un show'. Notre équipe vérifiera et ajoutera l'événement rapidement."
          />
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        background: "#161616",
        border: "1px solid #252525",
        borderRadius: "6px",
      }}
    >
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "700",
          color: "white",
          marginBottom: "8px",
        }}
      >
        {q}
      </h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
        {a}
      </p>
    </div>
  );
}

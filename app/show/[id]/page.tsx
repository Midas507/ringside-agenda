import ShowDetailClient from "@/components/ShowDetailClient";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: show } = await supabase
    .from("shows")
    .select("*")
    .eq("id", id)
    .single();

  if (!show) {
    return { title: "Show introuvable" };
  }

  const dateFormatted = new Date(show.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const title = `${show.titre} - ${show.federation}`;
  const description = `${show.federation} présente ${show.titre} le ${dateFormatted} à ${show.ville}. ${show.description ? show.description.substring(0, 100) + "..." : "Réserve ta place dès maintenant !"}`;
  const image = show.image_url || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: show.titre }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Récupère le show pour générer le Schema.org
  const { data: show } = await supabase
    .from("shows")
    .select("*")
    .eq("id", id)
    .single();

  // Schema.org Event JSON-LD
  const jsonLd = show ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": show.titre,
    "startDate": show.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": show.ville,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": show.ville,
        "addressCountry": show.pays,
      },
    },
    "image": show.image_url ? [show.image_url] : undefined,
    "description": show.description || `${show.federation} présente ${show.titre}`,
    "organizer": {
      "@type": "Organization",
      "name": show.federation,
    },
    "offers": show.lien_billetterie ? {
      "@type": "Offer",
      "url": show.lien_billetterie,
      "price": show.gratuit ? "0" : undefined,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
    } : undefined,
  } : null;

  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ShowDetailClient showId={id} />
    </main>
  );
}

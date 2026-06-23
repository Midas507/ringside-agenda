import FederationDetailClient from "@/components/FederationDetailClient";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: fed } = await supabase
    .from("federations")
    .select("*")
    .eq("id", id)
    .single();

  if (!fed) {
    return { title: "Fédération introuvable" };
  }

  const title = `${fed.nom}`;
  const description = fed.description
    ? fed.description.substring(0, 200)
    : `Découvre ${fed.nom} et tous ses prochains shows de catch sur Ringside Agenda.`;
  const image = fed.logo_url || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: fed.nom }],
      type: "profile",
    },
    X: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function FederationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="bg-[#0D0D0D] min-h-screen">
      <FederationDetailClient federationId={id} />
    </main>
  );
}
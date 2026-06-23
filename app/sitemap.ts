import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ringsideagenda.com";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/calendrier`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/carte`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/federations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Pages dynamiques : shows
  const { data: shows } = await supabase
    .from("shows")
    .select("id, date")
    .order("date", { ascending: false });

  const showPages: MetadataRoute.Sitemap = (shows || []).map((s) => ({
    url: `${baseUrl}/show/${s.id}`,
    lastModified: new Date(s.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Pages dynamiques : promotions
  const { data: federations } = await supabase
    .from("federations")
    .select("id")
    .order("nom");

  const fedPages: MetadataRoute.Sitemap = (federations || []).map((f) => ({
    url: `${baseUrl}/federations/${f.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...showPages, ...fedPages];
}
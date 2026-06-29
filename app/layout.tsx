import type { Metadata } from "next";
import { Inter, Anton, Press_Start_2P } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ringside-agenda.vercel.app"),
  title: {
    default: "Ringside Agenda – Calendrier Catch France, Belgique & Suisse",
    template: "%s | Ringside Agenda",
  },
  description:
    "Ringside Agenda : le calendrier complet des shows de catch en France, Belgique et Suisse. Agenda catch, événements wrestling, promotions indépendantes francophones. Ne rate plus aucun show de catch près de chez toi !",
  keywords: [
    "catch",
    "catch france",
    "catch belgique",
    "catch suisse",
    "calendrier catch",
    "agenda catch",
    "agenda catch france",
    "calendrier catch france",
    "calendrier catch belgique",
    "calendrier catch suisse",
    "shows de catch",
    "shows catch france",
    "événements catch",
    "wrestling france",
    "wrestling francophone",
    "catch francophone",
    "catch indépendant",
    "catch indépendant france",
    "promotions catch",
    "promotions wrestling france",
    "APC catch",
    "KHAO wrestling",
    "catch paris",
    "catch lyon",
    "ringside agenda",
    "prochains shows catch",
    "catch près de chez moi",
  ],
  authors: [{ name: "Ringside Agenda" }],
  creator: "Ringside Agenda",
  publisher: "Ringside Agenda",
  category: "Sport",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://ringside-agenda.vercel.app",
    siteName: "Ringside Agenda",
    title: "Ringside Agenda – Calendrier Catch France, Belgique & Suisse",
    description: "Le calendrier complet des shows de catch en France, Belgique et Suisse. Tous les événements wrestling francophones réunis en un seul endroit.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ringside Agenda - Calendrier Catch Francophone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ringside Agenda – Calendrier Catch France, Belgique & Suisse",
    description: "Le calendrier complet des shows de catch en France, Belgique et Suisse.",
    images: ["/og-image.png"],
    creator: "@RingsideAgenda",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "NJ8tP90Fd0YD2e1J9RcZel0NzQEUja42BASjyCXKpcE",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://ringside-agenda.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${anton.variable} ${pixelFont.variable} bg-[#0D0D0D] text-white antialiased`}
      >
        <PageTransition>{children}</PageTransition>
        <Analytics />
      </body>
    </html>
  );
}

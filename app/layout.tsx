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
  metadataBase: new URL("https://ringsideagenda.com"),
  title: {
    default: "Ringside Agenda – Le calendrier du catch francophone",
    template: "%s | Ringside Agenda",
  },
  description:
    "Tous les shows de catch en France, Belgique & Suisse. Ton agenda complet du catch indépendant.",
  keywords: ["catch", "wrestling", "calendrier", "shows", "France", "Belgique", "Suisse", "catch francophone", "indépendant"],
  authors: [{ name: "Ringside Agenda" }],
  creator: "Ringside Agenda",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://ringsideagenda.com",
    siteName: "Ringside Agenda",
    title: "Ringside Agenda – Le calendrier du catch francophone",
    description: "Tous les shows de catch en France, Belgique & Suisse. Ton agenda complet du catch indépendant.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ringside Agenda - Le calendrier du catch francophone",
      },
    ],
  },
  X: {
    card: "summary_large_image",
    title: "Ringside Agenda – Le calendrier du catch francophone",
    description: "Tous les shows de catch en France, Belgique & Suisse. Ton agenda complet du catch indépendant.",
    images: ["/og-image.png"],
    creator: "@ringsideagenda",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  verification: {
    google: "NJ8tP90Fd0YD2e1J9RcZel0NzQEUja42BASjyCXKpcE",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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

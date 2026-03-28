import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Special_Elite, Amiri, Great_Vibes } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-typewriter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "The Wedding of Alvia & Pandiwa",
  description: "You are cordially invited to celebrate the wedding of Alvia & Pandiwa.",
};

import { MusicProvider } from "@/components/providers/MusicProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import GlobalAudio from "@/components/audio/GlobalAudio";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${playfair.variable} ${montserrat.variable} ${specialElite.variable} ${amiri.variable} ${greatVibes.variable} min-h-full font-sans bg-background text-foreground selection:bg-primary/30 antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <MusicProvider>
              <GlobalAudio />
              {children}
            </MusicProvider>
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}

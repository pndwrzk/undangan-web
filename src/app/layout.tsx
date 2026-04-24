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
  weight: ["300", "400", "500", "600", "700", "800"],
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

export const metadata = {
  title: "The Wedding of Alvia & Pandiwa",
  description: "Our forever begins, be there as our story turns into a lifetime.",
  openGraph: {
    title: "The Wedding of Alvia & Pandiwa",
    description: "Our forever begins, be there as our story turns into a lifetime.",
    url: "http://finallyhomewithpandiwa.com",
    images: [
      {
        url: "http://finallyhomewithpandiwa.com/images/foto_prewad.jpeg",
        width: 1200,
        height: 630,
      },
    ],
  },
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/images/foto_prewad.jpeg" />
        <link rel="preload" as="image" href="/images/foto_box.jpeg" />
        <link rel="preload" as="image" href="/images/foto_kecil.jpeg" />
        <link rel="preload" as="image" href="/hero.jpg" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
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

import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Special_Elite } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
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

export const metadata: Metadata = {
  title: "The Wedding of Alvia & Pandiwa",
  description: "You are cordially invited to celebrate the wedding of Alvia & Pandiwa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${specialElite.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-background text-foreground selection:bg-primary/30">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

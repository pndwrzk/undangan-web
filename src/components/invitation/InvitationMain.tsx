"use client";
// REFRESH_ID: hydration-fix-v3

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { usePrefetch } from "@/hooks/usePrefetch";
import dynamic from "next/dynamic";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import { Z_INDEX } from "@/lib/z-index";
import { registerServiceWorker } from "@/lib/register-sw";

// Critical components - render on server for better LCP
import Splash from "@/components/invitation/Splash";
import Hero from "@/components/invitation/Hero";
import QuoteHeader from "@/components/invitation/QuoteHeader";
import Couple from "@/components/invitation/Couple";

// Below-the-fold components - lazy load
const Story = dynamic(() => import("@/components/invitation/Story"), { ssr: false });
const EventDetails = dynamic(() => import("@/components/invitation/EventDetails"), { ssr: false });
const RSVP = dynamic(() => import("@/components/invitation/RSVP"), { ssr: false });
const Gallery = dynamic(() => import("@/components/invitation/Gallery"), { ssr: false });
const WeddingGift = dynamic(() => import("@/components/invitation/WeddingGift"), { ssr: false });
const Guestbook = dynamic(() => import("@/components/invitation/Guestbook"), { ssr: false });
import BottomNav from "@/components/invitation/BottomNav";
import LoginModal from "@/components/auth/LoginModal";
import { Lock, LayoutDashboard } from "lucide-react";

import { Couple as CoupleType, Guest as GuestType, Event as EventType, Gift as GiftType, Gallery as GalleryType, Song as SongType } from "@/types";

interface InvitationContentProps {
  couple: CoupleType | null;
  guestName?: string | null;
  guest?: GuestType | null;
  events?: EventType[];
  gifts?: GiftType[];
  gallery?: GalleryType[];
  song?: SongType | null;
}

import { useMusic } from "@/components/providers/MusicProvider";

export default function InvitationMain({
  couple,
  guestName,
  guest,
  events = [],
  gifts = [],
  gallery = [],
  song = null
}: InvitationContentProps) {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isPlaying, togglePlay, setActiveSong } = useMusic();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Prefetch admin routes for faster navigation
  usePrefetch([
    '/admin/dashboard',
    '/admin/login',
  ]);

  useEffect(() => {
    setMounted(true);
    if (song) {
      setActiveSong(song);
    }
    
    // Register service worker for image caching
    registerServiceWorker();
  }, [song, setActiveSong]);

  const handleToggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  const handleOpen = () => {
    setIsOpen(true);
    togglePlay(true);
  };

  const coupleNames = couple ? `${couple.brideAlias || couple.brideName} & ${couple.groomAlias || couple.groomName}` : "Mempelai Wanita & Mempelai Pria";

  const footerYear = couple?.weddingDate ? new Date(couple.weddingDate).getFullYear() : "2026";
  const partnerName = guest?.partnerName;

  return (
    <div
      className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-0 md:p-8 lg:p-12 selection:bg-primary/20 overflow-x-hidden"
    >
      {/* Splash Screen */}
      <Splash onOpen={handleOpen} isOpen={isOpen} couple={couple} guestName={guestName} partnerName={partnerName} />


      {/* Main Container - Only render when mounted to prevent hydration errors from stale SSR */}
      {mounted ? (
        <main className={`flex-1 w-full max-w-6xl mx-auto bg-background shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative transition-all duration-1000 md:rounded-3xl overflow-y-auto overflow-x-hidden scroll-smooth ${isOpen ? 'opacity-100' : 'opacity-0 scale-95 blur-sm'}`}>
          {/* Paper Texture & Gradient Overlay */}
          <div
            style={{ 
              zIndex: Z_INDEX.DECORATIVE_OVERLAY,
              backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')"
            }}
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
          />
          <div style={{ zIndex: Z_INDEX.BACKGROUND }} className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-background/40 to-muted/30" />

          {song && <MusicPlayer song={song} />}

          <Hero couple={couple} />
          <QuoteHeader couple={couple} />
          <Couple couple={couple} />
          <Story />

          <EventDetails events={events} couple={couple} />
          <WeddingGift gifts={gifts} />
          <RSVP couple={couple} guest={guest} />
          <Guestbook guest={guest} />
          <Gallery gallery={gallery} />

          {isOpen && <BottomNav />}

          {/* Subtle Admin Button - Restored to original position and style */}
          {mounted && (
            <button
              onClick={() => authStatus === "authenticated" ? router.push("/admin/dashboard") : setIsLoginOpen(true)}
              style={{ zIndex: Z_INDEX.ADMIN_BUTTON }}
              className="fixed right-[-20px] top-1/2 -translate-y-1/2 bg-primary/10 hover:bg-primary/20 p-2 rounded-l-xl transition-all group overflow-hidden"
              title={authStatus === "authenticated" ? "Admin Dashboard" : "Admin Login"}
            >
              <div className="pl-4 pr-1">
                {authStatus === "authenticated" ? (
                  <LayoutDashboard className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                ) : (
                  <Lock className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                )}
              </div>
            </button>
          )}

          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

          <footer style={{ zIndex: Z_INDEX.FOOTER }} className="py-20 md:py-24 px-6 text-center bg-[#fcfaf3] relative -mt-[2px]">
            <div className="max-w-2xl mx-auto">
              <p className="text-muted-foreground font-serif italic text-sm md:text-base leading-relaxed mb-6">
                {t.footer.closing}
              </p>
              <p className="text-muted-foreground font-serif italic text-sm md:text-base mb-12">
                {t.footer.seeYou}
              </p>

              <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-4 italic select-none">
                {coupleNames}
              </h2>
              <p className="font-typewriter text-[10px] md:text-xs tracking-[0.3em] text-primary/60 mb-10">
                #ALLPathsLeadToPandiwa
              </p>

              <div className="w-24 h-[1px] bg-primary/20 mx-auto mb-10" />

              <p className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-widest text-muted-foreground/40 pb-20 md:pb-0">
                &copy; {footerYear} &bull; Made At Home
              </p>
            </div>
          </footer>
        </main>
      ) : (
        <div className="flex-1 w-full max-w-6xl mx-auto bg-background animate-pulse h-[80vh] rounded-3xl" />
      )}
    </div>
  );
}

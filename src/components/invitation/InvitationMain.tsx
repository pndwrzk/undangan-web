"use client";
// REFRESH_ID: hydration-fix-v3

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import dynamic from "next/dynamic";
import MusicPlayer from "@/components/invitation/MusicPlayer";

const Splash = dynamic(() => import("@/components/invitation/Splash"), { ssr: false });
const Hero = dynamic(() => import("@/components/invitation/Hero"), { ssr: false });
const Couple = dynamic(() => import("@/components/invitation/Couple"), { ssr: false });
const Journey = dynamic(() => import("@/components/invitation/Journey"), { ssr: false });
const Countdown = dynamic(() => import("@/components/invitation/Countdown"), { ssr: false });
const EventDetails = dynamic(() => import("@/components/invitation/EventDetails"), { ssr: false });
const RSVP = dynamic(() => import("@/components/invitation/RSVP"), { ssr: false });
const Gallery = dynamic(() => import("@/components/invitation/Gallery"), { ssr: false });
const WeddingGift = dynamic(() => import("@/components/invitation/WeddingGift"), { ssr: false });
const Guestbook = dynamic(() => import("@/components/invitation/Guestbook"), { ssr: false });
import BottomNav from "@/components/invitation/BottomNav";
import LoginModal from "@/components/auth/LoginModal";
import { Lock, LayoutDashboard } from "lucide-react";

import { Couple as CoupleType, Guest as GuestType, Event as EventType, Gift as GiftType, Gallery as GalleryType, Story as StoryType, Song as SongType } from "@/types";

interface InvitationContentProps {
  couple: CoupleType | null;
  guestName?: string | null;
  guest?: GuestType | null;
  events?: EventType[];
  gifts?: GiftType[];
  gallery?: GalleryType[];
  stories?: StoryType[];
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
  stories = [],
  song = null
}: InvitationContentProps) {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isPlaying, togglePlay, setActiveSong } = useMusic();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (song) {
      setActiveSong(song);
    }
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
      className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-0 md:p-8 lg:p-12 selection:bg-primary/20"
    >
      {/* Splash Screen */}
      <Splash onOpen={handleOpen} isOpen={isOpen} couple={couple} guestName={guestName} partnerName={partnerName} />


      {/* Main Container - Only render when mounted to prevent hydration errors from stale SSR */}
      {mounted ? (
        <main className={`flex-1 w-full max-w-6xl mx-auto bg-background shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 scale-95 blur-sm'}`}>
          {/* Paper Texture & Gradient Overlay */}
          <div
            className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-multiply"
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}
          />
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-background/40 to-muted/30" />

          {song && <MusicPlayer song={song} />}

          <Hero couple={couple} />
          <Couple couple={couple} />
          <Journey stories={stories} />
          {/* <Countdown couple={couple} /> */}
          <EventDetails events={events} />
          <Gallery gallery={gallery} />
          <WeddingGift gifts={gifts} />
          <RSVP couple={couple} guest={guest} />
          <Guestbook guest={guest} />

          {isOpen && <BottomNav />}

          {/* Subtle Admin Button - Restored to original position and style */}
          {mounted && (
            <button
              onClick={() => authStatus === "authenticated" ? router.push("/admin/dashboard") : setIsLoginOpen(true)}
              className="fixed right-[-20px] top-1/2 -translate-y-1/2 z-[50] bg-primary/10 hover:bg-primary/20 p-2 rounded-l-xl transition-all group overflow-hidden"
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

          <footer className="py-24 px-6 text-center bg-background relative">
            <div className="max-w-2xl mx-auto">
              <p className="text-muted-foreground font-serif italic text-sm leading-relaxed mb-6">
                {t.footer.closing}
              </p>
              <p className="text-muted-foreground font-serif italic text-sm mb-12">
                {t.footer.seeYou}
              </p>
              
              <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-4 italic select-none">
                {coupleNames}
              </h2>
              {couple?.hashtag && (
                <p className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-10">
                  {couple.hashtag}
                </p>
              )}
              
              <div className="w-24 h-[1px] bg-primary/20 mx-auto mb-12" />
              
              <p className="font-typewriter text-[9px] uppercase tracking-widest text-muted-foreground/40">
                &copy; {footerYear} &bull; Made with Love
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

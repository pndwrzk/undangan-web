"use client";

import { useState, useEffect } from "react";
import Splash from "@/components/invitation/Splash";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import dynamic from "next/dynamic";

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

export default function InvitationContent({ 
  couple, 
  guestName, 
  guest, 
  events = [], 
  gifts = [], 
  gallery = [], 
  stories = [],
  song = null
}: InvitationContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsPlaying(true);
  };

  const coupleNames = couple ? `${couple.brideName} & ${couple.groomName}` : "Alvia & Pandiwa";

  const footerYear = couple?.weddingDate ? new Date(couple.weddingDate).getFullYear() : "2026";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-0 md:p-8 lg:p-12 selection:bg-primary/20">
      {/* Splash Screen */}
      <Splash onOpen={handleOpen} isOpen={isOpen} couple={couple} guestName={guestName} />


      {/* Main Container */}
      <main className={`flex-1 w-full max-w-6xl mx-auto bg-background shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 scale-95 blur-sm'}`}>
        {/* Paper Texture & Gradient Overlay */}
        {mounted && (
          <>
            <div 
              className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-multiply" 
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}
            />
            <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-background/40 to-muted/30" />
          </>
        )}
        
        {song && <MusicPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} song={song} />}
        
        <Hero couple={couple} />
        <Couple couple={couple} />
        <Journey stories={stories} />
          <Countdown couple={couple} />
        <EventDetails events={events} />
          <Gallery gallery={gallery} />
          <WeddingGift gifts={gifts} />
        <RSVP couple={couple} guest={guest} />
          <Guestbook guest={guest} />
        
        {isOpen && <BottomNav />}
        
        <footer className="py-24 px-6 text-center text-muted-foreground text-sm border-t bg-muted/30">
          <p className="font-serif italic text-xl mb-4 text-primary">{coupleNames}</p>
          <p className="font-typewriter text-[10px] uppercase tracking-widest">&copy; {footerYear}. All rights reserved.</p>
          <p className="mt-4 text-xs font-serif italic">Created with Love.</p>
        </footer>
      </main>
    </div>
  );
}

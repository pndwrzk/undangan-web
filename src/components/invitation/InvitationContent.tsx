"use client";

import { useState } from "react";
import Splash from "@/components/invitation/Splash";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import Hero from "@/components/invitation/Hero";
import Couple from "@/components/invitation/Couple";
import EventDetails from "@/components/invitation/EventDetails";
import Gallery from "@/components/invitation/Gallery";
import Journey from "@/components/invitation/Journey";
import Countdown from "@/components/invitation/Countdown";
import WeddingGift from "@/components/invitation/WeddingGift";
import RSVP from "@/components/invitation/RSVP";
import Guestbook from "@/components/invitation/Guestbook";

import { Couple as CoupleType, Guest as GuestType, Event as EventType, Gift as GiftType, Gallery as GalleryType, Story as StoryType } from "@/types";

interface InvitationContentProps {
  couple: CoupleType | null;
  guestName?: string | null;
  guest?: GuestType | null;
  events?: EventType[];
  gifts?: GiftType[];
  gallery?: GalleryType[];
  stories?: StoryType[];
}

export default function InvitationContent({ couple, guestName, guest, events, gifts, gallery, stories }: InvitationContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
        <MusicPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
        
        <Hero couple={couple} />
        <div className="relative px-0">
          <Couple couple={couple} />
          <Journey stories={stories} />
          <Countdown couple={couple} />
          <EventDetails events={events} />
          <Gallery gallery={gallery} />
          <WeddingGift gifts={gifts} />
          <RSVP couple={couple} guest={guest} />
          <Guestbook guest={guest} />
        </div>
        
        <footer className="py-24 px-6 text-center text-muted-foreground text-sm border-t bg-muted/30">
          <p className="font-serif italic text-xl mb-4 text-primary">{coupleNames}</p>
          <p className="font-typewriter text-[10px] uppercase tracking-widest">&copy; {footerYear}. All rights reserved.</p>
          <p className="mt-4 text-xs font-serif italic">Created with Love.</p>
        </footer>
      </main>
    </div>
  );
}

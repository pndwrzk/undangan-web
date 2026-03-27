"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        console.log("Audio play failed (waiting for user interaction)");
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-[90] flex items-center justify-center">
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder audio
      />
      
      <Button
        onClick={onToggle}
        variant="outline"
        className={`w-14 h-14 rounded-full border-2 border-primary bg-background shadow-xl flex items-center justify-center p-0 overflow-hidden relative group transition-all duration-500 ${isPlaying ? 'scale-110' : 'scale-100 opacity-70'}`}
      >
        <div className={`absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors`} />
        
        <div className={`relative z-10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
          {isPlaying ? (
            <Pause size={24} className="text-primary" />
          ) : (
            <Music size={24} className="text-primary" />
          )}
        </div>

        {/* Vinyl Grooves effect */}
        <div className="absolute inset-0 border-[8px] border-black/5 rounded-full pointer-events-none" />
        <div className="absolute inset-2 border-[1px] border-black/5 rounded-full pointer-events-none" />
      </Button>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="ml-4 bg-background/80 backdrop-blur-sm border border-primary/20 px-3 py-1 rounded-full shadow-sm"
          >
            <p className="text-[10px] uppercase font-serif tracking-widest text-primary">Playing Now</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

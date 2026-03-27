"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

import { Song } from "@/types";

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  song?: Song | null;
}

export default function MusicPlayer({ isPlaying, onToggle, song }: MusicPlayerProps) {
  const audioUrl = song?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
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
    <div className="fixed bottom-24 right-6 z-[90]">
      <motion.button
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={isPlaying ? { duration: 10, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
        onClick={onToggle}
        className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center border border-primary/20 text-primary relative group focus:outline-none"
      >
        <Music className={`h-6 w-6 transition-transform ${isPlaying ? 'scale-110' : 'scale-90 opacity-50'}`} />
        
        {/* Pulsing effect when playing */}
        {isPlaying && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/20"
          />
        )}
        
        {/* Tooltip for desktop */}
        <div className="absolute right-full mr-4 bg-background px-4 py-2 rounded-xl text-[10px] font-typewriter uppercase tracking-widest text-primary border border-primary/5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          {isPlaying ? "Pause Music" : "Play Music"}
        </div>
      </motion.button>
      
      <audio
        ref={audioRef}
        loop
        src={audioUrl}
      />
    </div>
  );
}

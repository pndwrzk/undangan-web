"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { useMusic } from "@/components/providers/MusicProvider";

import { Song } from "@/types";

interface MusicPlayerProps {
  song?: Song | null;
}

export default function MusicPlayer({ song }: MusicPlayerProps) {
  const { isPlaying, togglePlay, currentTime, duration, seek } = useMusic();
  
  if (!song) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3 group animate-in fade-in slide-in-from-right-10 duration-1000 delay-500">
      {/* Information Tooltip */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none mb-1 origin-bottom-right">
        <p className="font-typewriter text-[10px] uppercase tracking-widest text-primary mb-1">Now Playing</p>
        <p className="font-serif text-sm font-bold text-slate-800">{song.title}</p>
        <p className="font-serif text-[10px] text-muted-foreground mb-3">{song.artist}</p>
        
        {/* Progress Bar in Tooltip */}
        <div className="w-48 space-y-1 pointer-events-auto">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[8px] font-typewriter text-muted-foreground uppercase tracking-tighter">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-1 h-4 items-end mb-1"
          >
            <div className="w-1 bg-primary/40 rounded-full animate-[music-bar_1.2s_ease-in-out_infinite]" />
            <div className="w-1 bg-primary/60 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]" />
            <div className="w-1 bg-primary/40 rounded-full animate-[music-bar_1.0s_ease-in-out_infinite_0.4s]" />
          </motion.div>
        )}
        
        <button
          onClick={() => togglePlay()}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 shadow-lg ${
            isPlaying 
              ? "bg-primary text-white scale-110 shadow-primary/30 rotate-[360deg]" 
              : "bg-white text-primary hover:bg-primary/5 shadow-black/5"
          }`}
        >
          {isPlaying ? <Pause size={24} /> : <Music size={24} className="animate-pulse" />}
        </button>
      </div>
    </div>
  );
}

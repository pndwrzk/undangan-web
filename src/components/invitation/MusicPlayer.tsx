import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, ChevronDown } from "lucide-react";
import { useMusic } from "@/components/providers/MusicProvider";

import { Song } from "@/types";

interface MusicPlayerProps {
  song?: Song | null;
}

export default function MusicPlayer({ song }: MusicPlayerProps) {
  const { isPlaying, togglePlay, currentTime, duration, seek, setIsSeeking, setCurrentTime } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!song) return null;

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setCurrentTime(parseFloat(e.currentTarget.value));
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-32 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Click Outside Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-[-1] cursor-default"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, originX: 1, originY: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-primary/10 w-64 md:w-72 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="font-typewriter text-[9px] uppercase tracking-widest text-primary mb-1">Now Playing</p>
                  <h4 className="font-serif text-base font-bold text-slate-800 leading-tight">{song.title}</h4>
                  <p className="font-serif text-xs text-muted-foreground">{song.artist}</p>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-primary/5 rounded-full text-muted-foreground"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Seek Bar */}
              <div className="space-y-2 mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration && !isNaN(duration) && isFinite(duration) ? duration : 0}
                  value={currentTime}
                  onInput={handleInput}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${progress}%, color-mix(in srgb, var(--color-primary), transparent 90%) ${progress}%)`
                  }}
                />
                <div className="flex justify-between text-[10px] font-typewriter text-muted-foreground uppercase tracking-widest">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => togglePlay()}
                  className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="flex items-center gap-3">
        {isPlaying && !isExpanded && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-1 h-3 items-end mb-1"
          >
            {[0.4, 0.6, 0.4].map((v, i) => (
              <div 
                key={i}
                className="w-1 bg-primary/60 rounded-full animate-music-bar"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </motion.div>
        )}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl relative overflow-hidden ${
            isPlaying || isExpanded
              ? "bg-primary text-white scale-110" 
              : "bg-white text-primary"
          }`}
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Music size={22} />
            </motion.div>
          ) : (
            <Music size={22} className={!isExpanded ? "animate-pulse" : ""} />
          )}
          
          {/* Removed subtle indicator if expanded to keep music icon visible */}
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Song } from "@/types";

interface MusicContextType {
  isPlaying: boolean;
  activeSong: Song | null;
  currentTime: number;
  duration: number;
  seekTime: number | null;
  togglePlay: (value?: boolean) => void;
  setActiveSong: (song: Song | null) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  seek: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  const togglePlay = (value?: boolean) => {
    setIsPlaying((prev) => (value !== undefined ? value : !prev));
  };

  const seek = (time: number) => {
    setSeekTime(time);
  };

  return (
    <MusicContext.Provider 
      value={{ 
        isPlaying, 
        activeSong, 
        currentTime, 
        duration, 
        seekTime, 
        togglePlay, 
        setActiveSong, 
        setCurrentTime, 
        setDuration, 
        seek 
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

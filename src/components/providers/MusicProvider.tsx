"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Song } from "@/types";

interface MusicContextType {
  isPlaying: boolean;
  activeSong: Song | null;
  togglePlay: (value?: boolean) => void;
  setActiveSong: (song: Song | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  // Music context state holder. Active song is set by the page or component.

  const togglePlay = (value?: boolean) => {
    setIsPlaying((prev) => (value !== undefined ? value : !prev));
  };

  return (
    <MusicContext.Provider value={{ isPlaying, activeSong, togglePlay, setActiveSong }}>
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

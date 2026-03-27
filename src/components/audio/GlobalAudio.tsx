"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "@/components/providers/MusicProvider";

export default function GlobalAudio() {
  const { isPlaying, activeSong, togglePlay } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked or playback failed:", err);
        togglePlay(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, activeSong, togglePlay]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
      } else {
        if (isPlaying) {
          audioRef.current?.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying]);

  if (!activeSong) return null;

  return (
    <audio
      ref={audioRef}
      src={activeSong.url}
      loop
      onEnded={() => togglePlay(false)}
    />
  );
}

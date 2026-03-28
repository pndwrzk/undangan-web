"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "@/components/providers/MusicProvider";

export default function GlobalAudio() {
  const { isPlaying, activeSong, togglePlay, setCurrentTime, setDuration, seekTime } = useMusic();
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

  // Handle seeking
  useEffect(() => {
    if (audioRef.current && seekTime !== null) {
      audioRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        togglePlay(false);
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
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
    />
  );
}

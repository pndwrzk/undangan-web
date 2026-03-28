"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "@/components/providers/MusicProvider";

export default function GlobalAudio() {
  const { isPlaying, activeSong, togglePlay, setCurrentTime, duration, setDuration, seekTime, isSeeking, setIsSeeking, setSeekTime } = useMusic();
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
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
      // Fallback check for duration if it was missing initially (common on mobile)
      if (duration === 0 || isNaN(duration) || !isFinite(duration)) {
        handleLoadedMetadata();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (!isNaN(d) && isFinite(d) && d > 0) {
        setDuration(d);
      }
    }
  };

  const handleSeeked = () => {
    setIsSeeking(false);
    setSeekTime(null);
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
      preload="auto"
      onEnded={() => togglePlay(false)}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onDurationChange={handleLoadedMetadata}
      onCanPlay={handleLoadedMetadata}
      onCanPlayThrough={handleLoadedMetadata}
      onProgress={handleLoadedMetadata}
      onSeeked={handleSeeked}
    />
  );
}

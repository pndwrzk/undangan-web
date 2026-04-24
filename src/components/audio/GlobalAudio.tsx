"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "@/components/providers/MusicProvider";

export default function GlobalAudio() {
  const { isPlaying, activeSong, togglePlay, setCurrentTime, duration, setDuration, seekTime, isSeeking, setIsSeeking, setSeekTime } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingBeforeHiddenRef = useRef(false); // Track if music was playing before tab hidden
  const userStoppedRef = useRef(false); // Track if user manually stopped the music

  const getAudioUrl = (url: string) => {
    if (url.startsWith("/uploads/songs/")) {
      const filename = url.split("/").pop();
      return `/api/music/serve/${filename}`;
    }
    return url;
  };

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
      if (document.hidden) {
        // Tab is hidden - pause music if playing
        if (isPlaying) {
          wasPlayingBeforeHiddenRef.current = true;
          togglePlay(false);
        }
      } else {
        // Tab is visible again - resume music only if:
        // 1. Music was playing before tab was hidden
        // 2. User didn't manually stop the music
        if (wasPlayingBeforeHiddenRef.current && !userStoppedRef.current) {
          togglePlay(true);
        }
        // Reset the flag after returning to tab
        wasPlayingBeforeHiddenRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, togglePlay]);

  // Track when user manually stops the music
  useEffect(() => {
    if (!isPlaying && !document.hidden) {
      // User manually stopped the music (not due to tab change)
      userStoppedRef.current = true;
    } else if (isPlaying) {
      // User started playing music - reset the flag
      userStoppedRef.current = false;
    }
  }, [isPlaying]);

  if (!activeSong) return null;

  return (
    <audio
      ref={audioRef}
      src={getAudioUrl(activeSong.url)}
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

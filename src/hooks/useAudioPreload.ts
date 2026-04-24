"use client";

import { useEffect, useState } from "react";

/**
 * Preload audio file and track loading state
 */
export function useAudioPreload(audioUrl: string | null) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioUrl) {
      setIsLoaded(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    const audio = new Audio();
    
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      setIsLoading(false);
      setProgress(100);
    };

    const handleError = (e: ErrorEvent) => {
      setError(new Error('Failed to load audio'));
      setIsLoading(false);
      setIsLoaded(false);
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        if (duration > 0) {
          setProgress(Math.round((bufferedEnd / duration) * 100));
        }
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError as any);
    audio.addEventListener('progress', handleProgress);

    // Start loading
    audio.src = audioUrl;
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError as any);
      audio.removeEventListener('progress', handleProgress);
      audio.src = '';
    };
  }, [audioUrl]);

  return { isLoaded, isLoading, error, progress };
}

/**
 * Preload audio file (promise-based)
 */
export function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.addEventListener('canplaythrough', () => {
      resolve();
    }, { once: true });
    
    audio.addEventListener('error', (e) => {
      reject(new Error('Failed to load audio'));
    }, { once: true });
    
    audio.src = url;
    audio.load();
  });
}

/**
 * Check if audio is cached in service worker
 */
export async function isAudioCached(url: string): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cache = await caches.open('wedding-audio-cache-v1');
    const response = await cache.match(url);
    return !!response;
  } catch (error) {
    console.error('Error checking audio cache:', error);
    return false;
  }
}

/**
 * Manually cache audio file
 */
export async function cacheAudio(url: string): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cache = await caches.open('wedding-audio-cache-v1');
    const response = await fetch(url);
    
    if (response.ok) {
      await cache.put(url, response);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error caching audio:', error);
    return false;
  }
}

"use client";

import { useEffect, useState } from "react";

/**
 * Preload images and track loading state
 */
export function useImagePreload(imageUrls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const loadImage = (url: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
          setLoadedImages((prev) => new Set([...prev, url]));
          resolve(url);
        };
        
        img.onerror = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
          console.warn(`Failed to preload image: ${url}`);
          reject(url);
        };
        
        img.src = url;
      });
    };

    Promise.allSettled(imageUrls.map(loadImage))
      .then(() => {
        setIsLoading(false);
      });

    // Cleanup
    return () => {
      setLoadedImages(new Set());
      setProgress(0);
    };
  }, [imageUrls]);

  return { loadedImages, isLoading, progress };
}

/**
 * Preload a single image
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(preloadImage));
}

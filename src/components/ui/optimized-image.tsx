"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string;
  showLoader?: boolean;
}

/**
 * Optimized Image component with loading state and fallback
 * Automatically uses Next.js image optimization with caching
 */
export function OptimizedImage({
  src,
  alt,
  fallback = "/placeholder.jpg",
  showLoader = true,
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {showLoader && isLoading && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse rounded" />
      )}
      <Image
        src={error ? fallback : src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Prefetch routes for faster navigation
 * 
 * Usage:
 * usePrefetch(['/admin/dashboard', '/admin/login']);
 */
export function usePrefetch(routes: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch routes after a short delay to not block initial render
    const timer = setTimeout(() => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [routes, router]);
}

/**
 * Prefetch on hover for links
 * 
 * Usage:
 * <a {...getPrefetchProps('/admin/dashboard')}>Dashboard</a>
 */
export function getPrefetchProps(href: string) {
  const router = useRouter();

  return {
    onMouseEnter: () => router.prefetch(href),
    onTouchStart: () => router.prefetch(href),
  };
}

/**
 * Prefetch critical data
 * 
 * Usage:
 * usePrefetchData('/api/admin/guests');
 */
export function usePrefetchData(url: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(console.error);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url, enabled]);
}

/**
 * Prefetch images
 * 
 * Usage:
 * usePrefetchImages(['/image1.jpg', '/image2.jpg']);
 */
export function usePrefetchImages(urls: string[]) {
  useEffect(() => {
    const timer = setTimeout(() => {
      urls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [urls]);
}

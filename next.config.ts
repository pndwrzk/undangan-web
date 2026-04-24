import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://103.193.179.119:3004",
    "http://10.147.252.254:3000",
    "http://103.171.85.219:3000",
    "https://footer-fifth-napkin.ngrok-free.dev",
    "https://sharper-reassign-variety.ngrok-free.dev",
    "http://103.193.179.119",
    "103.193.179.119",
  ],
  
  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year in seconds
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: '**.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
        pathname: '/patterns/**',
      },
    ],
    // Disable optimization for /uploads path - serve directly
    unoptimized: false,
  },
  
  // Enable static exports optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
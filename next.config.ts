import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://10.147.252.254:3000",
    "http://103.171.85.219:3000",
  ],
};

export default nextConfig;
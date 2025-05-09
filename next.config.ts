import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ["http://192.168.101.5:3000", "http://192.168.101.*:*"],
  },
};

export default nextConfig;
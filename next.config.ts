import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['teraki-key.g.kuroco-img.app', 'placehold.jp'],
  },
};

export default nextConfig;

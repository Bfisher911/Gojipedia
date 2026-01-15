import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization with remote patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'ws-na.amazon-adsystem.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    // Use unoptimized images for Netlify compatibility if needed
    unoptimized: process.env.NETLIFY === 'true',
  },

  // Transpile packages for compatibility
  transpilePackages: ['lucide-react'],

  // TypeScript configuration - don't fail build on type errors during initial deploy
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

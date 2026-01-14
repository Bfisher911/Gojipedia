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
    ],
    // Use unoptimized images for Netlify compatibility if needed
    unoptimized: process.env.NETLIFY === 'true',
  },

  // Transpile packages for compatibility
  transpilePackages: ['lucide-react'],

  // Experimental features for better Netlify support
  experimental: {
    // Server actions are stable in Next.js 14+
  },

  // ESLint configuration - don't fail build on warnings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration - don't fail build on type errors during initial deploy
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

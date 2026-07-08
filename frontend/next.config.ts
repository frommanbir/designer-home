import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    minimumCacheTTL: 31536000, // 1 year cache TTL for optimized images in production
    dangerouslyAllowLocalIP: true, //Remove in development
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Limit the viewport widths Next.js optimizes for
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Limit standard inline image sizes
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port:'8000',
        pathname:'/storage/**',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/storage/**",
      },
      {
        protocol: 'http',
        hostname: '194.146.12.71',
        port: '8020',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '194.146.12.71',
        port: '8020',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;

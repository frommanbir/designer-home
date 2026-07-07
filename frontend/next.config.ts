import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true, //Remove in development
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

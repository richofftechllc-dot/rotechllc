import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/learn", destination: "/quiz", permanent: true },
      { source: "/learn/:path*", destination: "/quiz", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/rendezvous-lounge", destination: "https://rendezvous-lounge.vercel.app" },
      { source: "/rendezvous-lounge/:path*", destination: "https://rendezvous-lounge.vercel.app/:path*" },
    ];
  },
};

export default nextConfig;

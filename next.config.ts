import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/learn", destination: "/quiz", permanent: true },
      { source: "/learn/:path*", destination: "/quiz", permanent: true },
      { source: "/rendezvous-lounge", destination: "/demo/rendezvous-lounge", permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: "/demo/rendezvous-lounge", destination: "/demo/rendezvous-lounge.html" },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/learn", destination: "/quiz", permanent: true },
      { source: "/learn/:path*", destination: "/quiz", permanent: true },
    ];
  },
};

export default nextConfig;

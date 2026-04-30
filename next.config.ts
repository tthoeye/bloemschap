import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "44a6c80ff9.clvaw-cdnwnd.com",
      },
      {
        protocol: "https",
        hostname: "duyn491kcolsw.cloudfront.net",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-lostark.game.onstove.com",
      },
      {
        protocol: "https",
        hostname: "*.lostark.game.onstove.com",
      },
      {
        protocol: "https",
        hostname: "img.lostark.co.kr",
      },
      {
        protocol: "https",
        hostname: "cdn.korlark.com",
      },
      {
        protocol: "https",
        hostname: "pica.korlark.com",
      },
    ],
  },
};

export default nextConfig;

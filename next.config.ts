import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000"}/:path*`,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [90],
  },
};

export default nextConfig;

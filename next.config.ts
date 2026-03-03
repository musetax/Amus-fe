import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1️⃣ Domains for simple hosts
    domains: ['cdn-icons-png.flaticon.com'],

    // 2️⃣ Remote patterns for more controlled patterns (S3, etc.)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'appweb-bucket.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/public",
  output: "export",
  distDir: "build/public",
  // https://nextjs.org/docs/messages/export-image-api
  images: { unoptimized: true },
};

export default nextConfig;

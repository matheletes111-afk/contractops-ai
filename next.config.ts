import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  // Exclude pdf-parse from bundling to avoid path resolution issues
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;

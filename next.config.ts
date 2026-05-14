import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;

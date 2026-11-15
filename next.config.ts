import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer and mysql2 are node-only; keep them out of the server bundle.
  serverExternalPackages: ["@react-pdf/renderer", "mysql2"],
};

export default nextConfig;

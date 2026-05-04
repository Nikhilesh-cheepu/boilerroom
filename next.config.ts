import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin/settings", destination: "/admin/hero", permanent: true },
      { source: "/admin/menu", destination: "/admin", permanent: false },
      { source: "/admin/djs", destination: "/admin", permanent: false },
      { source: "/admin/faq", destination: "/admin", permanent: false },
      { source: "/admin/weekly", destination: "/admin", permanent: false },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

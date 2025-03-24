import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
        {
            source: "/api/:path*",
            destination: "http://localhost:4000/api/:path*", // Adjust API server URL
        },
    ];
},
};

export default nextConfig;

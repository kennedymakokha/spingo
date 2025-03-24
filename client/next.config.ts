import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
        {
            source: "/api/:path*",
            destination: "http://185.113.249.137:4000/api/:path*", // Adjust API server URL
        },
    ];
},
};

export default nextConfig;

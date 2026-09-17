import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // The case studies lived at /demo/* before they were linked from
      // anywhere. 307 rather than 308 for now: a permanent redirect is cached
      // hard by browsers and is painful to unwind if the shape changes again.
      { source: "/demo/:slug", destination: "/work/:slug", permanent: false },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every URL ends in "/" so canonicals, the sitemap and internal links all match.
  trailingSlash: true,
  // Placeholder art is SVG; swap in your own photos under /public/images.
  images: { dangerouslyAllowSVG: true, unoptimized: true },
};

export default nextConfig;

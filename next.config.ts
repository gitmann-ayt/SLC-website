import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static site in out/, served from S3 + CloudFront (see deploy.sh).
  output: "export",
  // Every URL ends in "/" so canonicals, the sitemap and internal links all match.
  // Pages are written as about/index.html, etc.
  trailingSlash: true,
  // No image server on a static host: photos are pre-sized WebP in /public/images.
  images: { unoptimized: true },
};

export default nextConfig;

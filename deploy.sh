#!/usr/bin/env bash
# Build the site and publish out/ to S3 + CloudFront.
#
#   ./deploy.sh                                          preview (noindex), on the CloudFront address
#   NEXT_PUBLIC_SITE_URL=https://www.example.com ./deploy.sh   live, on the real domain
#
# Needs Node 20.9+ and the AWS CLI logged in to account 862283391017.
# Tracking IDs (NEXT_PUBLIC_GA_ID etc., see .env.example) are read from the
# environment or .env.production.local at build time.
set -euo pipefail

BUCKET=slc-website-862283391017
DISTRIBUTION=E3O9ZDPJ4TAZHL

cd "$(dirname "$0")"

if [ -z "${NEXT_PUBLIC_SITE_URL:-}" ]; then
  echo "NEXT_PUBLIC_SITE_URL is not set: building a PREVIEW (search engines told not to index it)."
fi

rm -rf out
npm ci
npm run build

# Hashed JS/CSS bundles never change under the same name: cache for a year.
aws s3 sync out/_next/static "s3://$BUCKET/_next/static" --delete \
  --cache-control "public, max-age=31536000, immutable"

# Photos change rarely: cache 7 days.
aws s3 sync out/images "s3://$BUCKET/images" --delete \
  --cache-control "public, max-age=604800"

# Everything else (HTML, page data, sitemap, robots, icons): always revalidate.
# --delete also clears files left over from the old static site (assets/, etc.).
aws s3 sync out "s3://$BUCKET" --delete \
  --exclude "_next/static/*" --exclude "images/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION" --paths "/*" \
  --query 'Invalidation.Id' --output text

echo "Deployed → ${NEXT_PUBLIC_SITE_URL:-https://dovqy9qtwdcdw.cloudfront.net}/"

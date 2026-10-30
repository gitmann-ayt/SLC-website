#!/usr/bin/env bash
# Build the site and publish dist/ to S3 + CloudFront.
#   ./deploy.sh
# Needs the AWS CLI logged in to account 862283391017.
set -euo pipefail

BUCKET=slc-website-862283391017
DISTRIBUTION=E3O9ZDPJ4TAZHL

cd "$(dirname "$0")"
node build.js

# Assets (css/js are cache-busted with ?v=, images change rarely): cache 7 days.
aws s3 sync dist/assets "s3://$BUCKET/assets" --delete \
  --cache-control "public, max-age=604800"

# Everything else (HTML, sitemap, robots, icons): always revalidate.
aws s3 sync dist "s3://$BUCKET" --delete --exclude "assets/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION" --paths "/*" \
  --query 'Invalidation.Id' --output text

echo "Deployed → https://dovqy9qtwdcdw.cloudfront.net/"

# SLC Car Rental: website

Next.js (App Router) + Tailwind CSS v4 website for SLC Car Rental. Static pages for the fleet, city and Islamabad sector pages, services, About (with CEO) and contact, built for SEO (canonical tags, sitemap, robots.txt, llms.txt, schema.org data).

## Run

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # static site in out/
npm start           # serve out/ locally to check the build
npm run typecheck
```

Node 20.9+.

## Deploy

The site is a static export (`output: "export"`) hosted on S3 + CloudFront.

```bash
./deploy.sh                                               # preview on the CloudFront address (not indexed)
NEXT_PUBLIC_SITE_URL=https://www.your-domain.pk ./deploy.sh   # live
```

Needs the AWS CLI logged in to the account named in `deploy.sh`. Without `NEXT_PUBLIC_SITE_URL` the build is a preview: robots.txt and every page carry noindex. Tracking and Search Console IDs go in `.env.production.local` (template: `.env.example`).

## Editing content

All content is plain data in `data/`:

| What | File |
|---|---|
| Brand, phone, WhatsApp, address, domain, nav menus, FAQs | `data/site.ts` |
| Cars, prices, categories | `data/cars.ts` (photos in `public/images/cars/`) |
| Cities and areas | `data/locations.ts` |
| Services | `data/services.ts` |
| CEO and company story | `data/about.ts` |
| City photo credits (required by the image licences) | `data/credits.ts` |

Colours and fonts: `app/globals.css` (`@theme`) and `app/layout.tsx`.

Before launch, work through `REPLACE_GUIDE.md`: it lists every placeholder (CEO name, founding year, contact details, domain, prices, reviews).

The previous static version of this site is in the git history.

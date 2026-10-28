# SLC Car Rental: website

Next.js (App Router) + Tailwind CSS v4 website for SLC Car Rental. Static pages for the fleet, 10 cities and Islamabad sectors, services, About (with CEO) and contact, built for SEO (canonical tags, sitemap, robots.txt, llms.txt, schema.org data).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 20.9+.

## Editing content

All content is plain data in `data/`:

| What | File |
|---|---|
| Brand, phone, WhatsApp, address, domain, nav menus, FAQs | `data/site.ts` |
| Cars, prices, categories | `data/cars.ts` (photos in `public/images/cars/`) |
| Cities and areas | `data/locations.ts` |
| Services | `data/services.ts` |
| CEO and company story | `data/about.ts` |
| Photo credits (required by the image licences) | `data/credits.ts` |

Colours and fonts: `app/globals.css` (`@theme`) and `app/layout.tsx`.

Before launch, work through `REPLACE_GUIDE.md`: it lists every placeholder (CEO name, founding year, contact details, domain, prices, reviews).

The previous static version of this site is in the git history.

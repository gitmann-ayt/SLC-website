# SLC Car Rental Services: website

Static, SEO-friendly website for SLC Car Rental Services (SmartLink Consultants). See `requirements.md` for the full spec.

## Build & preview

```bash
node build.js                      # outputs the finished site to dist/
cd dist && python3 -m http.server  # preview at http://localhost:8000
```

Upload the **contents of `dist/`** to any web host (cPanel, Netlify, Vercel, Cloudflare Pages…).

## Editing content (no HTML needed)

| What | File |
|---|---|
| Phone, WhatsApp, email, address, hours, domain, years | `src/data/site.json` |
| Cars (add / remove / mark `featured` for the home page) | `src/data/cars.json` + photos in `assets/img/cars/<id>-480.webp` and `<id>-800.webp` (4:3) |
| Client organisations | `src/data/clients.json` |
| Testimonials (**drafts: replace with approved quotes**) | `src/data/testimonials.json` |
| FAQs (home page) | `src/data/faqs.json` |
| Area, city & service landing pages (sectors, Rawalpindi, airport…) | `src/data/areas.json`, one entry per page, layout in `src/templates/landing.html` |
| Rates (shown in every page's rate table, in schema and `llms.txt`) | `dayRate` / `monthRate` in `src/data/categories.json`, then set `ratesUpdated` in `site.json` |
| Page text | `src/pages/*.html`, shared header/footer in `src/partials/` |

Run `node build.js` again after any change. It warns about titles over 60 characters, descriptions over 155, duplicate titles and broken internal links.

### Adding an area page

Copy an existing `"type": "area"` entry in `src/data/areas.json` and change everything: slug (`rent-a-car-<sector>-islamabad`), names, title, description, lead, sections and FAQs. Each page needs its own text (sub-sectors, landmarks, local questions). Pages that differ only in the sector name count as doorway pages and can hurt rankings. The new page shows up automatically in the area grids, footer, sitemap and `llms.txt`.

SEO/AEO plan this follows: `smartlink-seo-aeo-spec.md`.

## Structure

```
build.js            zero-dependency static builder
src/pages/          page templates (meta title/description at the top); x.html is published at /x/
src/templates/      landing.html: layout for every page in src/data/areas.json
src/partials/       header, footer, contact section
src/data/           JSON content
src/static/         favicon etc. copied to site root
assets/             css, js, images (WebP, multiple sizes)
dist/               generated output (do not edit by hand)
```

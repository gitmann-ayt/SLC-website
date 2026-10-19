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
| Cars (add / remove / mark `featured` for the home page) | `src/data/cars.json` + photos in `assets/img/cars/<id>-480.webp`, `-800.webp` and `-1200.webp` (16:10, background removed, black & white). Cars that share a photo set `"img"` (e.g. both Civics use `civic`). A car without a `-1200` file is shown as an ordinary cropped 4:3 photo until its cut-out is made. Credit every photo in `assets/img/credits.json` |
| Client organisations | `src/data/clients.json` |
| Testimonials (**drafts: replace with approved quotes**) | `src/data/testimonials.json` |
| FAQs (home page) | `src/data/faqs.json` |
| Area, city & service landing pages (sectors, Rawalpindi, airport…) | `src/data/areas.json`, one entry per page, layout in `src/templates/landing.html` |
| Car-model pages (`/cars/toyota-prado-rent-islamabad/` …) | `src/data/models.json`: one entry per model family, listing its car ids; layout in `src/templates/model.html` |
| Blog posts (`/blog/<file name>/`) | one file per post in `src/blog/`, with a `<!--meta {...} -->` comment (title, description, h1, date, excerpt, faqs); layout in `src/templates/post.html`. The /blog/ index lists them newest first |
| Rates | `rate` (PKR per day) on each car in `src/data/cars.json`, then set `ratesUpdated` in `site.json`. Cards, rate tables, the price list on /cars/, schema and `llms.txt` all read it. In page copy write `{{price.<car id>}}` (e.g. `{{price.prado}}`) or `{{price.from}}` instead of typing a number |
| Page text | `src/pages/*.html`, shared header/footer in `src/partials/` |

Run `node build.js` again after any change. It warns about titles over 60 characters, descriptions over 155, duplicate titles and broken internal links.

### Adding an area page

Copy an existing `"type": "area"` entry in `src/data/areas.json` and change everything: slug (`rent-a-car-<sector>-islamabad`), names, title, description, lead, sections and FAQs. Each page needs its own text (sub-sectors, landmarks, local questions). Pages that differ only in the sector name count as doorway pages and can hurt rankings. The new page shows up automatically in the area grids, footer, sitemap and `llms.txt`.

SEO/AEO plan this follows: `smartlink-seo-aeo-spec.md`.

## Structure

```
build.js            zero-dependency static builder
src/pages/          page templates (meta title/description at the top); x.html is published at /x/
src/templates/      landing.html (areas.json pages), model.html (models.json pages), post.html (blog posts)
src/blog/           blog posts
src/partials/       header, footer, contact section
src/data/           JSON content
src/static/         favicon etc. copied to site root
assets/             css, js, images (WebP, multiple sizes)
dist/               generated output (do not edit by hand)
```

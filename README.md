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
| FAQs | `src/data/faqs.json` |
| Page text | `src/pages/*.html`, shared header/footer in `src/partials/` |

Run `node build.js` again after any change.

## Structure

```
build.js            zero-dependency static builder
src/pages/          page templates (meta title/description at the top)
src/partials/       header, footer, contact section
src/data/           JSON content
src/static/         favicon etc. copied to site root
assets/             css, js, images (WebP, multiple sizes)
dist/               generated output (do not edit by hand)
```

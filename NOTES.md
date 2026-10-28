# Smartlink Rent A Car website

## Source
- Reference: https://www.signaturesrentacar.com/ (recon on 22 Oct 2026)
- Stack observed: Next.js (App Router, `_next/static`), Tailwind CSS v4 (oklab/lab colours), Material Icons, system font stack.
- No public source repo found. Their code, copy, photos, logo and reviews are **not** included here. This project rebuilds the layout and design tokens only; every word of copy is new and all images are generated placeholders.

## Mode and scope
- Complexity: L2 (content marketing site, no WebGL/canvas, light interactions).
- Mode: visual clone with content replaced (neutral placeholder brand "Northline Rent a Car").
- Cloned: homepage only, 15 sections in the original order.
- Not cloned: the ~70 sub-pages (car, category, city, area, blog, legal), the Google reviews widget, analytics.

## Design tokens (measured from computed styles)
| Token | Value | Use |
|---|---|---|
| ink | #000B1D | header, dark bands, text |
| lime | #BFF52C | primary CTA, eyebrows on dark |
| cyan | #04C4E3 | secondary CTA, eyebrows on light |
| paper | #F8F9FA | light section background |
| star | #FBBC04 | review stars |
| H1 | 52px / 700 | hero |
| H2 | ~30–34px / 600 | section titles |
| Buttons | pill, 12–13px / 600, uppercase in header |

All live in `app/globals.css` under `@theme`.

## Section map (original → component)
1. Sticky header with dropdowns → `components/Header.tsx` (adds mobile menu)
2. Hero slideshow + "Find your vehicle" form → `components/Hero.tsx` (form opens WhatsApp with the trip details prefilled)
3. Brand logo strip → `BrandStrip` (text chips with gradient borders instead of carmaker logos)
4–7. Executive / Premium / Luxury / Hybrid fleets → `Fleets` (cards: badge, price pill, spec chips, WhatsApp / Call / Inquiry)
8. Islamabad feature band → `CityFeature which="islamabad"`
9. How to book (4 steps on a dashed wave) → `HowToBook`
10. FAQ accordion on navy → `FAQ` (native `<details>`, works without JS)
11. Service cards → `Services`
12. Rawalpindi feature band → `CityFeature which="rawalpindi"`
13. Drive across Pakistan bento → `Destinations`
14. Reviews → `Reviews` (placeholder, flagged on the page)
15. Blog preview → `Blog`
16. Closing CTA card + footer + floating WhatsApp → `ClosingCTA`, `Footer`, `WhatsAppFab`

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Node 20.9+. Placeholder art is regenerated with `node scripts/make-placeholders.mjs`.

## Verification (22 Oct 2026)
- `next build`: clean, page prerendered static.
- Headless Chromium at 1280 and 390 wide: no console errors, no horizontal scroll.
- Side-by-side with the original's screenshots: section order, spacing rhythm, colours and card anatomy match. Differences are deliberate (own copy, placeholder art, text brand chips, no Google widget).

## Known gaps
- Sub-pages and their routes are not built; nav items point to on-page anchors.
- Reviews section shows placeholder cards. Use real reviews or remove it before launch.
- Images are SVG placeholders; real car and city photos will change the feel more than anything else.

## Update (26 Oct 2026): Smartlink build
- Rebranded to Smartlink Rent A Car. SEO spec: "Signature Rent A Car Site Teardown" (20 Oct 2026).
- New routes: /about/ (CEO + company), /cars/ + 12 car pages, /rent-a-car/ + 12 location pages (G-8, G-9, G-10, G-11 first), /services/ + 6 service pages, /faq/, /contact/.
- SEO: metadataBase + self-canonical on every page, trailing slashes, data-driven sitemap.xml, robots.txt, llms.txt, JSON-LD (AutoRental, WebSite, BreadcrumbList, FAQPage, Car with Offer, Service, AboutPage; Person once the CEO name is set).
- Lead tracking: `components/Analytics.tsx` fires GA4/Ads events on WhatsApp and call clicks.
- Booking forms open WhatsApp directly; no SMS verification step.
- Removed the placeholder blog section (it linked to pages that don't exist).
- Checked: `next build` clean (43 static pages); no horizontal scroll or console errors at 390 and 1280 wide; location pages ~650–700 words with ~44% shared wording (competitor: 95%).
- Launch checklist: REPLACE_GUIDE.md.

# Launch checklist (SLC Car Rental)

Everything marked `PLACEHOLDER` in `data/` must be real before going live. Search engines read these values directly.

## 1. CEO and company (`data/about.ts`)
- `ceo.name`: the CEO's full name (currently "CEO Name").
- `company.foundedYear`: drives every "X+ years" figure on the site (currently 2015).
- Read the bio and quote with the CEO and correct anything that isn't accurate.
- Set `isPlaceholder: false`. This removes the draft banner and publishes Person schema for the CEO.
- Photo: `public/images/team/ceo.jpg`. A higher-resolution, well-lit portrait will look better.

## 2. Brand, contact and domain (`data/site.ts`)
- `siteUrl` (or env `NEXT_PUBLIC_SITE_URL`): the exact live domain. Every canonical tag, the sitemap and robots.txt use it. The competitor's biggest SEO mistake was a wrong domain here.
- `phoneDisplay`, `phoneHref`, `phoneE164`, `whatsapp`, `email`, `address.street`.
- `geo`: the pin from your Google Business Profile. `googleMapsUrl`: your Business Profile link.
- `social`: Facebook, Instagram, TikTok, YouTube URLs.

## 3. Fleet (`data/cars.ts`)
- Real prices (self drive and with driver), model years, and which cars allow self drive (`priceSelfDrive: null` means driver only).
- Car photos are licensed Wikimedia Commons photos of each model, cut out onto white. Replace them with photos of your own cars when possible (1600×1000, white background) and remove the matching rows from `data/credits.ts`. Until then keep the /credits/ page live: the CC BY-SA licences require it.
- Self-drive terms (CNIC, licence, deposit, distance allowance) are typical wording. Confirm them.

## 4. Locations (`data/locations.ts`)
Check the landmarks, pickup notes and drive times against real operations. Cities: Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Faisalabad, Multan, Sialkot, Gujranwala, Abbottabad. Adjust the list to the cities SLC actually serves. To add a city or sector, write new copy for it. Don't copy another entry and swap the name.

## 5. Reviews (`data/site.ts`)
Replace the placeholder reviews with real ones, or remove `<Reviews />` from `app/page.tsx`. No rating schema is emitted until real reviews are in.

## 6. Tracking and Search Console (env vars)
- `NEXT_PUBLIC_GA_ID`: GA4 (`G-…`) or Ads (`AW-…`) ID. Every WhatsApp and call click then fires a `generate_lead` event.
- `NEXT_PUBLIC_ADS_CONVERSION`: optional `AW-…/label` to count those clicks as Ads conversions.
- `NEXT_PUBLIC_GSC_VERIFICATION`: Search Console verification code.
- On launch day, submit `/sitemap.xml` in Search Console and use URL Inspection to confirm the canonical is the live domain.

## 7. Photos and logo (`public/images/`)
- `brand/slc-logo.png`: SLC logo (background removed). Also used for the favicon (`app/icon.png`).
- `cities/`: Wikimedia Commons photos with credits on /credits/.
- `brands/`: car-maker logos (trademarks of their owners). Haval is a text wordmark because no free logo file exists.

## 8. Look and feel
- Colours live in `app/globals.css` under `@theme`: white pages, black (`ink`) hero, footer and feature bands, black primary buttons.
- Fonts: Unbounded (headings) and Manrope (body), loaded in `app/layout.tsx`.
- Home hero photo: `public/images/hero/hero-sedan.webp`. Replace it with a professional photo of one of SLC's own cars (wide, dark, car on the right) for the strongest result.

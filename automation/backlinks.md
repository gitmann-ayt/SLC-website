# Backlink and listing tracker

The Claude in Chrome backlink job (`automation/jobs/backlinks-chrome.md`) works
through this list, then emails an updated copy of the table. Paste that copy
over the table below (or ask Claude Code to) and push to `main`.

Status values: `todo`, `live` (listing is public and correct), `submitted`
(waiting for the site to approve it), `needs owner` (blocked on something only
you can do: an account, password, CAPTCHA, SMS code, postcard or payment),
`skip` (not worth it or not legitimate).

## Business details (every listing must match these exactly)

Search engines trust a business more when its name, address and phone are the
same everywhere. Copy these; don't reword them.

- **Name:** SLC Car Rental Services
- **Address:** Office# 216, 2nd Floor, Kashif Bell-Air Plaza, G-8 Markaz, Islamabad 44000, Pakistan
- **Phone:** +92 310 0000132 (mobile and WhatsApp), landline +92 51 5340191
- **Email:** smartlinkservicesg8@gmail.com
- **Website:** https://www.slccarrentals.com.pk/
- **Hours:** Open 24 hours, 7 days
- **Category:** Car rental agency (add Chauffeur service or Airport shuttle service as secondary categories where offered)
- **Short description (under 250 characters):** Car rental in Islamabad and across Pakistan, self drive or with a professional driver. Hatchbacks, sedans, SUVs, luxury cars and vans, airport transfers, weddings, corporate and monthly rentals. Fixed quotes on WhatsApp.
- **Long description:** SLC Car Rental Services is a car rental company based in G-8 Markaz, Islamabad, serving Islamabad, Rawalpindi, Lahore and cities across Pakistan. Rent a car self drive or with a professional driver: hatchbacks, sedans, SUVs and 4x4s, luxury cars, and vans and coasters. We handle airport pickups at Islamabad International Airport, wedding cars, corporate transport, monthly rentals and northern-area trips to Murree, Hunza and Skardu. Open 24/7. Send your dates and route on WhatsApp for a fixed quote.
- **Logo:** https://www.slccarrentals.com.pk/images/brand/slc-logo.png

## Listings

Tier 1 has the most effect on local searches such as "rent a car Islamabad".
Do these first.

| Tier | Site | URL to start from | Status | Listing URL | Notes |
|---|---|---|---|---|---|
| 1 | Google Business Profile | https://business.google.com/create | todo | | Biggest single lever for map results. Google verifies by video or postcard, which needs the owner |
| 1 | Bing Places | https://www.bingplaces.com/ | todo | | Can import from Google Business Profile once that is verified |
| 1 | Apple Business Connect | https://businessconnect.apple.com/ | todo | | Apple Maps and Siri |
| 1 | Facebook Page | https://www.facebook.com/pages/create | todo | | Put the URL in `brand.social.facebook` in data/site.ts |
| 1 | Instagram business account | https://www.instagram.com/ | todo | | Put the URL in `brand.social.instagram` |
| 1 | LinkedIn company page | https://www.linkedin.com/company/setup/new/ | todo | | Corporate and NGO clients search here |
| 2 | Foursquare | https://foursquare.com/add-place | todo | | Feeds location data to many apps |
| 2 | OpenStreetMap | https://www.openstreetmap.org/ | todo | | Add the office as a car rental shop. Used by many maps |
| 2 | Businesslist.pk | https://www.businesslist.pk/ | todo | | Pakistan business directory |
| 2 | Cybo | https://www.cybo.com/ | todo | | |
| 2 | Hotfrog | https://www.hotfrog.com/ | todo | | |
| 2 | Brownbook | https://www.brownbook.net/ | todo | | |
| 2 | YouTube channel | https://www.youtube.com/ | todo | | Fleet walkarounds and route videos. Put the URL in `brand.social.youtube` |
| 2 | TikTok | https://www.tiktok.com/ | todo | | Put the URL in `brand.social.tiktok` |

## Prospects

The job adds rows here from its research: directories and travel or business
sites that list other Islamabad car rental companies, and blogs whose readers
need a car. It drafts outreach emails but never sends them.

| Site | Page | Why it fits | Contact | Status | Notes |
|---|---|---|---|---|---|

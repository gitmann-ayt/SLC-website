Backlink and listing job for SLC Car Rental Services (website https://www.slccarrentals.com.pk). Run it in Claude in Chrome every week or two until the Tier 1 and Tier 2 listings are live, then monthly.

Use the browser sessions I'm already logged in to. Never type a password, never pay for anything, and don't enter card details. If a site asks you to sign in, create an account, solve a CAPTCHA, enter an SMS or email code, or verify by postcard or video, stop on that site, mark it `needs owner` with one line saying exactly what I need to do, and move on. If a site offers "Continue with Google" using the account I'm already signed in to, ask me before you use it.

Only do white-hat work. Never post reviews or ratings, never comment or post on forums or blogs to drop a link, never join link exchanges, link farms or paid-link offers, and never list SLC on a site that looks spammy (pages full of unrelated links, auto-generated content, or "submit your link here" farms). Mark those `skip`.

## 1. Read the tracker

Open https://github.com/gitmann-ayt/SLC-website/blob/main/automation/backlinks.md. The "Business details" section is the only text to use in listings: copy the name, address, phone, website, hours and descriptions exactly. Don't invent services, prices, awards or years in business.

## 2. Work through the listings

For each row in "Listings" with status `todo` or `submitted`, in table order, Tier 1 first, at most 8 sites per run:

- `todo`: open the start URL. Search the site for "SLC Car Rental" first in case a listing already exists. If it exists, check that it matches the business details and fix what you can. If it doesn't exist and the form can be filled while I'm logged in, fill every field using the business details, upload the logo where asked, and submit the free option.
- `submitted`: check whether the listing is now public. If it is, mark it `live`.
- After each site, record the status, the public listing URL (if there is one) and a short note.

## 3. Check live listings

For rows marked `live`, open the listing URL and confirm the name, address, phone and website still match the business details. Note any that don't.

## 4. Find new prospects

Search Google (google.com.pk) for each of these and look at the first two pages of results:

- rent a car Islamabad
- car rental Islamabad with driver
- rent a car Rawalpindi
- Islamabad airport car rental
- Hunza tour car rental from Islamabad
- car rental companies in Pakistan list

From the results, collect sites that are not car rental companies themselves but list or recommend car rental companies: business directories, "best car rental in Islamabad" articles, travel blogs and trip guides, hotel and guest house pages that mention transport, tour operator partner pages, university or embassy vendor lists. Also open the "People also ask" answers and note which sites they cite. Skip sites already in the tracker.

For each new prospect, add a row under "Prospects": the site, the exact page, why it fits SLC, a contact email or contact-page URL if the site shows one, and status `todo`. Aim for 5 to 10 good prospects per run, not a long list of weak ones.

## 5. Draft outreach (don't send)

For the 3 best prospects that have a contact email, write a short, personal email in Gmail and save it as a DRAFT. Don't send it. Each draft:

- names the specific page and why SLC fits it (for example, an Islamabad to Hunza trip guide that has no transport section);
- offers something useful: accurate drive times and road notes from SLC's guides at https://www.slccarrentals.com.pk/guides/, or a quote for their readers;
- asks if they would consider adding SLC with a link, and is under 120 words;
- signs off as "SLC Car Rental Services", with the phone and website from the business details.

Mark those prospects `drafted`.

## 6. Report

Email the report to info@reca-app.com with the subject "[SLC backlinks] <today's date>", using the webmail I'm logged in to. Don't email anyone else. The report has:

1. First line: "Live listings: X of N. New this run: Y. Waiting on you: Z."
2. **Waiting on you:** one line per `needs owner` site, saying exactly what I need to do (for example "Google Business Profile: record the verification video showing the office signboard").
3. **Profile URLs for the website:** any new live Google Business Profile, Facebook, Instagram, YouTube or TikTok URLs. These go into `brand.googleMapsUrl` and `brand.social` in `data/site.ts`, which adds them to the site's schema.
4. **Listings that don't match** the business details, and what is wrong.
5. **Outreach drafts** saved in Gmail, with the prospect each one is for.
6. **Updated tracker:** the full "Listings" and "Prospects" tables from backlinks.md as Markdown, with this run's changes, ready to paste back into the file.
7. Any site you skipped and why.

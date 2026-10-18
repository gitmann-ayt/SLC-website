# SLC Car Rental Services — Website Requirements

**Client:** SLC Car Rental Services (SLC = **SmartLink Consultants**)
**Market:** Pakistan
**Document status:** v1.0 · 17 Oct 2026 · items marked **[TBC]** must be confirmed by the client before launch

---

## 1. Purpose

Build a fast, responsive, search-engine-optimised marketing website for SLC Car Rental Services. The site has three jobs, in this order:

1. **Generate enquiries.** Get visitors to call, message on WhatsApp or send a booking request. Contact is the most important part of the site.
2. **Show the fleet.** Present a wide range of everyday Pakistani cars ("you name it, we have it").
3. **Build trust.** Show 13 years of experience and the organisations SLC has worked with.

## 2. Brand & visual design

| Item | Requirement |
|---|---|
| Logo | The supplied retro badge (classic car, "SLC", stars, "Car Rental Services"). Use it in the header, footer, favicon and social-share image. |
| Colour palette | Taken from the logo: **cream** `#EFE1B4` (badge fill), **ink/charcoal** `#141210` (car & lettering), **paper** `#FAF6EC` (page background). Supporting tones may be derived from these, such as a darker gold for highlights and stars. WhatsApp green is allowed only on WhatsApp buttons, because people recognise it. |
| Style | Retro / vintage motor-club feel that echoes the badge: condensed bold headings, horizontal "sunrise" stripe motif from the logo, star accents, rounded badge shapes. It should still look clean, modern and professional. |
| Typography | Condensed display face for headings (e.g. Oswald) and a readable sans-serif for body text (e.g. DM Sans). |
| Design reference | https://www.signaturesrentacar.com/ : borrow its structure (hero with booking form, fleet by category, how-to-book steps, services, FAQ, testimonials, final CTA, WhatsApp on every card), not its look. |

## 3. Pages & site map

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Hero with contact/booking, fleet preview, services, experience, clients & testimonials, how to book, FAQ, contact |
| Our Fleet | `/cars/` | Full fleet, filterable by category, with an enquiry action on every car |
| About Us | `/about/` | Company story (SmartLink Consultants, 13 years), values, clients, photo credits |
| Contact Us | `/contact/` | Full contact page: booking form, phone, WhatsApp, email, address, hours, map |
| 404 | `/404.html` | Friendly not-found page with contact options |
| City hubs | `/rent-a-car-islamabad/`, `/rent-a-car-rawalpindi/` | Target "rent a car Islamabad / Rawalpindi"; the Islamabad hub links every sector page |
| Area pages | `/rent-a-car-g8-islamabad/` … (G-6–G-13, F-6–F-11, I-8, Blue Area, Bahria Town, DHA) | One page per sector, each with its own copy, rates table, FAQs and `Service` schema (added 18 Oct 2026, see `smartlink-seo-aeo-spec.md`) |
| Service pages | `/rent-a-car-with-driver-islamabad/`, `/self-drive-rent-a-car-islamabad/`, `/monthly-car-rental-islamabad/`, `/islamabad-airport-rent-a-car/`, `/wedding-car-rental-islamabad/` | One page per service keyword |

## 4. Contact & conversion (highest priority)

Contact must be **in the hero section** and in every other place a visitor might decide to book:

- **R-C1 Hero:** a quick booking form (pick-up city, pick-up date, return date, car type, with or without driver, name, phone). It sends the request to WhatsApp with a pre-filled message. Next to it go large **Call Now** and **WhatsApp** buttons.
- **R-C2 Header:** a "Call" button with the phone number, always visible in the sticky header.
- **R-C3 Mobile:** a fixed bottom action bar on phones with Call / WhatsApp / Book.
- **R-C4 Fleet cards:** every car has a **WhatsApp** button (message pre-filled with that car's name) and a **Call** button.
- **R-C5 Mid-page CTA band** between content sections.
- **R-C6 Contact section** at the end of the home page and on the Contact page: full form, phone(s), WhatsApp, email, office address, working hours, and a map that loads only when clicked.
- **R-C7 Footer:** full contact details (name, address, phone) on every page.
- The forms work without a server: they open WhatsApp with the details filled in. An email option (`mailto:`) is available as a fallback. A form backend (e.g. Formspree or a PHP mailer) can be added later.
- Phone numbers use `tel:` links and email uses `mailto:` links.

**[TBC] contact details:** phone number(s), WhatsApp number, email, office address, working hours, Google Maps location, and social media links. The site currently uses clearly fake placeholders (`+92 300 0000000`, `info@example.com`). All of them live in **one file**: `src/data/site.json`.

## 5. Fleet

- The fleet is everyday cars used in Pakistan, shown with real photos.
- Categories and starting list (the client will validate it and add or remove cars):

| Category | Cars |
|---|---|
| Economy / Hatchback | Suzuki Alto, Suzuki Wagon R |
| Sedan | Toyota Yaris, Honda City, Toyota Corolla, Corolla Grande, Honda Civic 2022, Honda Civic 2025, Hyundai Elantra |
| SUV & 4x4 | Honda BR-V, Toyota Revo, Toyota Prado, Toyota Fortuner, Kia Sportage, Hyundai Tucson, Toyota Land Cruiser V8 |
| Luxury | Mercedes S400, S500, E250, C180, Audi A6, A5, A4, Lexus LX 570 |
| Vans & Coasters | Toyota Grand Cabin (13 seats), Coaster 4C (22 seats), Coaster 5C (28 seats) |

- Each car card shows: photo, make & model, category, seats, transmission, fuel, ideal use, and WhatsApp/Call buttons.
- **Prices:** daily rates per car supplied by the client on 18 Oct 2026, from PKR 4,000 (Alto) to PKR 150,000 (Lexus LX 570). They live in `src/data/cars.json` (`rate`). Whether a rate includes driver and fuel is confirmed per booking. **[TBC]**
- **Easy maintenance:** cars are stored in one data file (`src/data/cars.json`). Adding or removing a car means editing that file and rebuilding the site. No HTML changes are needed.
- Photos are freely licensed (Wikimedia Commons) and credited on the About page. The client may replace them with photos of their own cars later, which is recommended.

## 6. Experience & trust

- Show **13 years of experience** prominently: in the hero, in a stats strip, in the About page, and in the SEO text.
- **Clients / testimonials:** show the organisations SLC has worked with:
  USAID, iEARN, Silkbank, TSL Builders, Kalon Chemicals, Muslim Hands, HelpInNeed, Emirates Group of Companies.
- Client names appear as styled text "wordmarks". Official logos will only be used once the client confirms permission and supplies the files. **[TBC]**
- Testimonial quotes: the layout uses **draft placeholder quotes**. Before launch they **must** be replaced with real, approved wording from each organisation, or removed. Quotes must never be attributed to an organisation without its approval. **[TBC]**
- No fake star ratings or review counts and no review schema markup until real reviews exist.

## 7. Responsiveness

- Mobile-first layout that works from 320 px phones up to large desktop screens.
- Tested at 360, 768, 1024 and 1440 px widths. No horizontal scrolling. Tap targets are at least 44 px.
- On phones the navigation collapses to a menu button, and the fixed bottom contact bar appears (R-C3).

## 8. Performance & loading

- **Pages:** static HTML that needs no JavaScript to show content. A slim progress bar shows while moving between pages, and content fades in smoothly.
- **Images:**
  - WebP format, served at several widths through `srcset`/`sizes` (480/800 for cars, 768/1280/1920 for the hero).
  - `width` and `height` set on every image so the layout doesn't jump while loading.
  - Lazy loading (`loading="lazy"`, `decoding="async"`) for everything below the fold. The hero image is preloaded with `fetchpriority="high"`.
  - A shimmer placeholder shows while each image loads, then the image fades in.
- **Fonts:** fonts are preconnected and use `display=swap`.
- CSS and JS are each one small file (no frameworks). JS is deferred.
- Target Lighthouse scores of 90+ for Performance, Accessibility, Best Practices and SEO on mobile.

## 9. SEO

- One clear `<h1>` per page and a logical H2/H3 order.
- A unique `<title>` (≤ 60 chars) and meta description (≤ 160 chars) on every page.
- Copy written around search terms such as *rent a car Islamabad*, *rent a car Rawalpindi*, *car rental with driver*, *corporate car rental Pakistan*, *self drive car rental*, *Toyota Corolla on rent*, *Honda Civic on rent*, *Prado on rent*, *Coaster on rent*, *airport pick and drop*, *wedding car rental*, *13 years experience*.
- Canonical URLs, Open Graph and Twitter cards, plus a social-share image.
- Structured data (JSON-LD):
  - `AutoRental` (LocalBusiness) with name, logo, address, phone, opening hours and area served
  - `FAQPage` for the FAQ section
  - `BreadcrumbList` on inner pages
- `sitemap.xml` and `robots.txt` are generated by the build.
- Descriptive `alt` text on every image, and descriptive link text.
- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`).
- **[TBC]** production domain. The placeholder is `https://www.example.com`, set in `src/data/site.json`.
- **[TBC] Service area / city:** the copy assumes **Islamabad & Rawalpindi**, with travel across Pakistan. Confirm the head-office city, because it is central to local SEO.

## 10. Content sections (home page, in order)

1. Sticky header: logo, navigation, Call button
2. **Hero:** H1, 13-years badge, short pitch, Call/WhatsApp buttons, quick booking form
3. Stats strip: 13+ years, fleet size, corporate clients, cities served
4. Fleet preview with category tabs and a link to the full fleet
5. Services: with driver, self drive, corporate & NGO contracts, airport transfers, weddings & events, tours/out-of-city, monthly/long-term rental
6. Mid-page CTA band
7. Why choose SLC: 13 years, maintained fleet, professional drivers, 24/7 support, transparent billing, corporate invoicing
8. Clients ("Trusted by") + testimonials
9. How to book in 4 steps
10. FAQ (accordion, with FAQ schema)
11. Contact section (form + details + map)
12. Footer

## 11. Accessibility

- WCAG 2.1 AA colour contrast. A visible focus state. Keyboard-usable menu, tabs and accordion.
- Form fields have labels. Reduced-motion users get no animations (`prefers-reduced-motion`).

## 12. Technical

- Plain HTML/CSS/JS with a zero-dependency Node build script (`node build.js`). It assembles the pages from shared partials and data files into `dist/`.
- `dist/` is pure static files, so it can be hosted anywhere: cPanel/shared hosting, Netlify, Vercel, GitHub Pages or Cloudflare Pages.
- No cookies or tracking by default. A Google Analytics / Search Console ID can be added in `site.json`. **[TBC]**

## 13. Open items for the client (summary)

1. Phone, WhatsApp, email, address, hours, map pin, social links
2. Production domain
3. Head-office city / service areas
4. Final car list (add/remove), rates if they should be shown, and ideally real photos of SLC's own cars
5. Approved testimonial quotes, and permission to use client logos
6. Analytics / Search Console IDs

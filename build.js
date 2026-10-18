#!/usr/bin/env node
/*
 * SLC Car Rental Services — static site builder (zero dependencies).
 *
 *   node build.js        → builds ./dist
 *
 * Pages live in src/pages/*.html and start with a meta comment:
 *   <!--meta {"title": "...", "description": "...", "nav": "fleet", "crumb": "Our Fleet"} -->
 * src/pages/cars.html is published at /cars/ (index.html at /, 404.html stays /404.html).
 *
 * Area, city and service landing pages (/rent-a-car-g9-islamabad/ etc.) are generated from
 * src/data/areas.json with the template src/templates/landing.html.
 *
 * Inside pages, templates and partials:
 *   {{site.phoneDisplay}}   value from src/data/site.json (HTML-escaped)
 *   {{meta.h1}}             value from the page's meta (HTML-escaped)
 *   {{@component arg}}      output of a component function below
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(SRC, 'data', f), 'utf8'));
const site = readJSON('site.json');
const cars = readJSON('cars.json');
const categories = readJSON('categories.json');
const clients = readJSON('clients.json');
const testimonials = readJSON('testimonials.json').items;
const faqs = readJSON('faqs.json');
const areas = readJSON('areas.json');
const credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/credits.json'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const get = (obj, p) => p.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const abs = (p) => site.domain.replace(/\/$/, '') + p;
const wa = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const catLabel = (id) => (categories.find((c) => c.id === id) || {}).long || id;
const carName = (c) => `${c.make} ${c.model}`;
const pageUrl = (slug) => `/${slug}/`;
const stripTags = (s) => String(s).replace(/<[^>]+>/g, '');
const money = (n) => `PKR ${Number(n).toLocaleString('en-US')}`;
const addressLine = () => [site.address.officeNo, site.address.street, site.address.locality].filter(Boolean).join(', ');

const carById = Object.fromEntries(cars.map((c) => [c.id, c]));
const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]));
const faqById = Object.fromEntries(faqs.map((f) => [f.id, f]));
const rates_ = cars.map((c) => c.rate).filter(Boolean);
const minRate = Math.min(...rates_), maxRate = Math.max(...rates_);
const ratesUpdatedText = site.ratesUpdated
  ? new Date(site.ratesUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  : '';

// Token values: {{site.x}} from site.json, {{price.<car id>}} = that car's daily rate, {{price.from}} = the lowest rate.
function tokenValue(p, meta) {
  if (p.startsWith('meta.')) return get(meta, p.slice(5));
  if (p.startsWith('price.')) {
    const key = p.slice(6);
    if (key === 'from') return money(minRate);
    return carById[key] && carById[key].rate ? money(carById[key].rate) : undefined;
  }
  return get({ site }, p);
}

// Tokens in plain-text fields (FAQ answers, schema), unescaped: escape the result once where it is output.
const fill = (s) =>
  String(s ?? '').replace(/\{\{((?:site|price)\.[\w.-]+)\}\}/g, (_, p) => {
    const v = tokenValue(p);
    if (v === undefined) throw new Error(`Unknown token {{${p}}}`);
    return v;
  });

/* ---------------- components ---------------- */

function carCard(c, place) {
  const name = carName(c);
  const msg = `Assalam o Alaikum SLC, I'd like to rent the ${name}${place ? ` ${place}` : ''}${c.rate ? ` (${money(c.rate)}/day)` : ''}. Please share availability.`;
  const alt = place ? `${name} for rent ${place}` : `${name} available for rent in ${site.city} with or without driver`;
  const img = c.img || c.id;
  return `
<article class="car-card" data-cat="${c.category}">
  <div class="car-media img-wrap">
    <img src="/assets/img/cars/${img}-480.webp"
         srcset="/assets/img/cars/${img}-480.webp 480w, /assets/img/cars/${img}-800.webp 800w"
         sizes="(min-width: 1100px) 340px, (min-width: 700px) 45vw, 92vw"
         width="800" height="600" loading="lazy" decoding="async"
         alt="${esc(alt)}">
    <span class="car-tag">${esc(catLabel(c.category))}</span>
  </div>
  <div class="car-body">
    <h3 class="car-title"><span>${esc(c.make)}</span> ${esc(c.model)}</h3>
    <p class="car-use">${esc(c.use)}</p>
    <ul class="car-specs" aria-label="Specifications">
      <li>${icon('seat')}${c.seats} seats</li>
      <li>${icon('gear')}${esc(c.transmission)}</li>
      <li>${icon('fuel')}${esc(c.fuel)}</li>
      ${c.colors ? `<li>${icon('drop')}${esc(c.colors)}</li>` : ''}
    </ul>
    <p class="car-price">${c.rate ? `<strong>${money(c.rate)}</strong> <span>/ day</span>` : `${icon('star', 'star')} Ask for today's rate`}</p>
    <div class="car-actions">
      <a class="btn btn-wa btn-sm" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Book ${esc(name)} on WhatsApp">${icon('whatsapp')}WhatsApp</a>
      <a class="btn btn-outline btn-sm" href="tel:${site.phoneTel}" aria-label="Call to book ${esc(name)}">${icon('phone')}Call</a>
    </div>
  </div>
</article>`;
}

function fleet(arg) {
  const list = arg === 'featured' ? cars.filter((c) => c.featured) : cars;
  const tabs = [{ id: 'all', label: 'All cars' }, ...categories]
    .map((c, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-filter="${c.id}">${esc(c.label)}</button>`)
    .join('');
  return `
<div class="fleet" data-fleet>
  <div class="tabs" role="tablist" aria-label="Filter cars by category">${tabs}</div>
  <div class="car-grid">${list.map((c) => carCard(c)).join('')}</div>
  <p class="fleet-empty" hidden>More cars in this category are available on request. <a href="/cars/">See the full fleet</a> or <a href="tel:${site.phoneTel}">call us</a>.</p>
</div>`;
}

function pageCars(arg, meta) {
  return `<div class="car-grid car-grid--4">${meta.cars
    .map((id) => {
      if (!carById[id]) throw new Error(`${meta.slug}: unknown car "${id}"`);
      return carCard(carById[id], meta.in);
    })
    .join('')}</div>`;
}

function fleetCount() {
  return String(cars.length);
}

function carList() {
  // Plain-text model list for SEO copy, e.g. "Suzuki Alto, Toyota Corolla, ..."
  return esc(cars.map(carName).join(', '));
}

function clientsStrip() {
  const items = clients
    .map((c) => `<li class="client"><span class="client-name">${esc(c.name)}</span><span class="client-sector">${esc(c.sector)}</span></li>`)
    .join('');
  return `<ul class="clients" aria-label="Organisations we have worked with">${items}</ul>`;
}

function clientNames() {
  return esc(clients.map((c) => c.name).join(', '));
}

function testimonialCards() {
  // NOTE: quotes come from src/data/testimonials.json and are DRAFTS until approved by each organisation.
  return `<div class="t-track" tabindex="0" aria-label="Client testimonials">${testimonials
    .map(
      (t) => `
  <figure class="t-card">
    <div class="t-stars" aria-hidden="true">${icon('star')}${icon('star')}${icon('star')}${icon('star')}${icon('star')}</div>
    <blockquote><p>${esc(t.quote)}</p></blockquote>
    <figcaption><span class="t-org">${esc(t.org)}</span><span class="t-ctx">${esc(t.context)}</span></figcaption>
  </figure>`
    )
    .join('')}</div>`;
}

// {{@faq}} = the site-wide FAQ (src/data/faqs.json); {{@faq page}} = the landing page's own questions.
function faq(arg, meta) {
  const list = (arg === 'page' ? meta.faqs : faqs).map((f) => ({ q: fill(f.q), a: fill(f.a) }));
  const items = list
    .map(
      (f, i) => `
  <details class="faq-item"${i === 0 ? ' open' : ''}>
    <summary><h3>${esc(f.q)}</h3>${icon('plus', 'faq-icon')}</summary>
    <div class="faq-a"><p>${esc(f.a)}</p></div>
  </details>`
    )
    .join('');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return `<div class="faq">${items}</div>\n<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function bookingForm(variant = 'hero', meta = {}) {
  const id = variant;
  const carOptions = categories
    .map((cat) => `<optgroup label="${esc(cat.long)}">${cars.filter((c) => c.category === cat.id).map((c) => `<option>${esc(carName(c))}</option>`).join('')}</optgroup>`)
    .join('');
  const full = variant === 'contact';
  const pickup = meta.pickup || (meta.type && meta.type !== 'service' ? meta.place : '');
  return `
<form class="book-form book-form--${variant}" data-book-form data-wa="${site.whatsapp}" data-email="${esc(site.email)}" novalidate>
  <div class="form-grid">
    <div class="field">
      <label for="${id}-pickup">Pick-up city / location</label>
      <input id="${id}-pickup" name="pickup" type="text" autocomplete="address-level2" placeholder="e.g. Islamabad Airport"${pickup ? ` value="${esc(pickup)}"` : ''} required>
    </div>
    <div class="field">
      <label for="${id}-car">Preferred car</label>
      <select id="${id}-car" name="car"><option value="">Any suitable car</option>${carOptions}</select>
    </div>
    <div class="field">
      <label for="${id}-from">Pick-up date</label>
      <input id="${id}-from" name="from" type="date" required>
    </div>
    <div class="field">
      <label for="${id}-to">Return date</label>
      <input id="${id}-to" name="to" type="date">
    </div>
    <div class="field">
      <label for="${id}-name">Your name</label>
      <input id="${id}-name" name="name" type="text" autocomplete="name" required>
    </div>
    <div class="field">
      <label for="${id}-phone">Phone / WhatsApp</label>
      <input id="${id}-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="03XX XXXXXXX" required>
    </div>
    <fieldset class="field field--full seg">
      <legend>Service</legend>
      <label><input type="radio" name="driver" value="With driver"${meta.slug === 'self-drive-rent-a-car-islamabad' ? '' : ' checked'}><span>With driver</span></label>
      <label><input type="radio" name="driver" value="Self drive"${meta.slug === 'self-drive-rent-a-car-islamabad' ? ' checked' : ''}><span>Self drive</span></label>
    </fieldset>
    ${full ? `<div class="field field--full">
      <label for="${id}-msg">Anything else? <span class="opt">(optional)</span></label>
      <textarea id="${id}-msg" name="message" rows="3" placeholder="Number of passengers, destinations, monthly contract…"></textarea>
    </div>` : ''}
  </div>
  <p class="form-error" role="alert" hidden></p>
  <div class="form-actions">
    <button type="submit" class="btn btn-wa btn-lg btn-block">${icon('whatsapp')}Send booking on WhatsApp</button>
    ${full ? `<button type="button" class="btn btn-outline btn-lg btn-block" data-mailto>${icon('mail')}Send by email instead</button>` : ''}
  </div>
  <p class="form-note">${icon('clock')} We usually reply within minutes. Prefer to talk? <a href="tel:${site.phoneTel}">Call ${esc(site.phoneDisplay)}</a></p>
</form>`;
}

function contactList() {
  return `
<ul class="contact-list">
  <li>${icon('phone')}<div><span class="cl-label">Call us 24/7</span><a href="tel:${site.phoneTel}">${esc(site.phoneDisplay)}</a>${site.phone2Display ? `<a href="tel:${site.phone2Tel}">${esc(site.phone2Display)}</a>` : ''}</div></li>
  <li>${icon('whatsapp')}<div><span class="cl-label">WhatsApp</span><a href="${wa('Assalam o Alaikum SLC, I need a car on rent.')}" target="_blank" rel="noopener">Chat with us now</a></div></li>
  <li>${icon('mail')}<div><span class="cl-label">Email</span><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
  <li>${icon('pin')}<div><span class="cl-label">Office</span><address>${esc(addressLine())}, Pakistan</address></div></li>
  <li>${icon('clock')}<div><span class="cl-label">Hours</span><span>${esc(site.hours)}</span></div></li>
</ul>`;
}

function map() {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
  return `
<div class="map" data-map="${esc(src)}">
  <button type="button" class="map-load">${icon('pin')}<span>Show our location on Google Maps</span></button>
</div>`;
}

function waLink(text) {
  return wa(text || 'Assalam o Alaikum SLC, I need a car on rent.');
}

function credits_() {
  return `<ul class="credits">${credits
    .map((c) => `<li><a href="${esc(c.page)}" rel="nofollow noopener" target="_blank">${esc(c.file.replace(/^File:/, ''))}</a>, ${esc(c.author || 'Unknown')}, ${esc(c.license)}</li>`)
    .join('')}</ul>`;
}

/* ----- landing-page components (meta = the page's entry in areas.json) ----- */

function crumbs(arg, meta) {
  const parts = meta.crumbs.map((c, i) =>
    i === meta.crumbs.length - 1 ? `<span aria-current="page">${esc(c.name)}</span>` : `<a href="${c.path}">${esc(c.name)}</a>`
  );
  return `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>${parts.join('<span aria-hidden="true">/</span>')}</nav>`;
}

function lead(arg, meta) {
  return meta.lead;
}

function napLine() {
  return `<p class="nap">${icon('pin')}<span><strong>${esc(site.name)}</strong> · ${esc(addressLine())} · ${esc(site.hours)}</span></p>`;
}

function waPage(arg, meta) {
  return wa(`Assalam o Alaikum SLC, I need a car on rent ${meta.in}.`);
}

function sections(arg, meta) {
  return meta.sections
    .map(
      (s) =>
        `<h2>${esc(s.h)}</h2>\n${(s.p || []).map((p) => `<p>${p}</p>`).join('\n')}` +
        (s.list ? `\n<ul class="ticks">${s.list.map((li) => `<li>${icon('check')}<span>${esc(li)}</span></li>`).join('')}</ul>` : '') +
        (s.html ? '\n' + render(s.html, meta) : '')
    )
    .join('\n');
}

function ratesNote(meta) {
  const updated = ratesUpdatedText ? `Rates last updated <time datetime="${esc(site.ratesUpdated)}">${ratesUpdatedText}</time>. ` : '';
  return `<p class="rates-note">${updated}Rates are per day. What's included (driver, fuel, mileage) depends on the booking and is confirmed before you book. <a href="${waPage(null, meta)}" target="_blank" rel="noopener">Ask on WhatsApp</a> or <a href="tel:${site.phoneTel}">call ${esc(site.phoneDisplay)}</a>.</p>`;
}

// Landing pages: one row per car type with the lowest daily rate.
function rates(arg, meta) {
  const rows = categories
    .map((cat) => {
      const list = cars.filter((c) => c.category === cat.id);
      const seats = list.map((c) => c.seats);
      const lo = Math.min(...seats), hi = Math.max(...seats);
      const from = Math.min(...list.map((c) => c.rate || Infinity));
      return `<tr><th scope="row">${esc(cat.long)}</th><td>${esc(list.map(carName).join(', '))}</td><td>${lo === hi ? lo : `${lo}–${hi}`}</td><td>${isFinite(from) ? `From <strong>${money(from)}</strong>` : '<span class="rate-ask">Ask for rate</span>'}</td></tr>`;
    })
    .join('\n');
  return `
<div class="table-wrap">
<table class="rates rates--types">
  <caption>${esc(meta.ratesH || `Car rental rates ${meta.in}`)}, by car type. <a href="/cars/#rates">See the rate for every car</a>.</caption>
  <thead><tr><th scope="col">Car type</th><th scope="col">Models</th><th scope="col">Seats</th><th scope="col">Per day</th></tr></thead>
  <tbody>
${rows}
  </tbody>
</table>
</div>
${ratesNote(meta)}`;
}

// Fleet page: every car and its daily rate, grouped by car type.
function priceList(arg, meta) {
  const groups = categories
    .map((cat) => {
      const list = cars.filter((c) => c.category === cat.id);
      return `<tbody>
  <tr class="rates-group"><th scope="colgroup" colspan="3">${esc(cat.long)}</th></tr>
${list.map((c) => `  <tr><th scope="row">${esc(carName(c))}</th><td>${c.seats}</td><td>${c.rate ? `<strong>${money(c.rate)}</strong>` : '<span class="rate-ask">Ask for rate</span>'}</td></tr>`).join('\n')}
</tbody>`;
    })
    .join('\n');
  return `
<div class="table-wrap">
<table class="rates rates--list">
  <caption>Daily car rental rates in Islamabad and Rawalpindi, ${cars.length} cars</caption>
  <thead><tr><th scope="col">Car</th><th scope="col">Seats</th><th scope="col">Per day</th></tr></thead>
${groups}
</table>
</div>
${ratesNote({ in: 'in Islamabad' })}`;
}

const ratesHeading = (arg, meta) => esc(meta.ratesH || `Car rental rates ${meta.in}`);
const carsHeading = (arg, meta) => esc(meta.carsH || `Popular cars on rent ${meta.in}`);
const faqHeading = (arg, meta) => esc(meta.type === 'service' ? `${meta.name}: questions & answers` : `FAQs: renting a car ${meta.in}`);
const nearbyHeading = (arg, meta) => esc(meta.nearbyH || `Also serving near ${meta.name}`);
const linkLabel = (a) => (a.type === 'service' ? a.name : `Rent a car in ${a.name}`);

function nearby(arg, meta) {
  return `<ul class="chips">${meta.nearby
    .map((slug) => {
      const a = areaBySlug[slug];
      if (!a) throw new Error(`${meta.slug}: unknown nearby page "${slug}"`);
      return `<li><a href="${pageUrl(slug)}">${esc(linkLabel(a))}</a></li>`;
    })
    .join('')}</ul>`;
}

// {{@areaGrid islamabad}} = Islamabad sectors; {{@areaGrid all}} = both cities + every area.
function areaGrid(arg) {
  const list = areas.filter((a) => (arg === 'all' ? a.type !== 'service' : a.group === arg));
  return `<ul class="area-grid">${list
    .map((a) => `<li><a href="${pageUrl(a.slug)}"><span class="ag-pre">Rent a car in</span><strong>${esc(a.name)}</strong><small>${esc(a.sub || '')}</small></a></li>`)
    .join('')}</ul>`;
}

// {{@pageLinks areas}} / {{@pageLinks services}}: plain link lists for the footer.
function pageLinks(arg) {
  const list = areas.filter((a) => (arg === 'services' ? a.type === 'service' : a.type !== 'service'));
  return `<ul>${list.map((a) => `<li><a href="${pageUrl(a.slug)}">${esc(linkLabel(a))}</a></li>`).join('')}</ul>`;
}

const components = {
  fleet, pageCars, fleetCount, carList, clients: clientsStrip, clientNames, testimonials: testimonialCards, faq,
  bookingForm, contactList, map, wa: waLink, credits: credits_, year: () => String(new Date().getFullYear()),
  crumbs, lead, napLine, waPage, sections, rates, priceList, ratesHeading, carsHeading, faqHeading, nearbyHeading, nearby, areaGrid, pageLinks,
};

/* ---------------- page shell ---------------- */

function businessSchema() {
  const s = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': abs('/#business'),
    name: site.name,
    alternateName: [site.legalName, 'SLC Rent a Car'],
    url: abs('/'),
    logo: abs('/assets/img/logo-512.png'),
    image: abs('/assets/img/og-image.jpg'),
    telephone: site.phoneTel,
    email: site.email,
    foundingDate: String(site.foundedYear),
    slogan: `${site.years} years of trusted car rental in Pakistan`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [site.address.officeNo, site.address.street].filter(Boolean).join(', '),
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    ...(site.geo ? { geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng } } : {}),
    ...(site.mapsUrl ? { hasMap: site.mapsUrl } : {}),
    areaServed: [
      ...site.areas.map((a) => ({ '@type': 'City', name: a })),
      ...areas.filter((a) => a.type === 'area').map((a) => ({ '@type': 'Place', name: a.place })),
    ],
    openingHours: site.hoursSchema,
    priceRange: `${money(minRate)} - ${money(maxRate)}`,
    sameAs: [...Object.values(site.social), site.mapsUrl].filter(Boolean),
  };
  return `<script type="application/ld+json">${JSON.stringify(s)}</script>`;
}

function websiteSchema() {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    name: site.name,
    alternateName: 'SLC Rent a Car',
    url: abs('/'),
    publisher: { '@id': abs('/#business') },
    inLanguage: 'en-PK',
  })}</script>`;
}

function head(meta) {
  const url = abs(meta.path);
  const crumbs = meta.crumbs
    ? `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '/' }, ...meta.crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
      })}</script>`
    : '';
  const extra = (meta.schemas || []).map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  const ga = site.gaId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}');</script>`
    : '';
  const heroPreload = meta.hero
    ? `<link rel="preload" as="image" type="image/webp" href="/assets/img/hero/hero-1280.webp" imagesrcset="/assets/img/hero/hero-768.webp 768w, /assets/img/hero/hero-1280.webp 1280w, /assets/img/hero/hero-1920.webp 1920w" imagesizes="100vw" fetchpriority="high">`
    : '';
  return `<!doctype html>
<html lang="en-PK" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
${meta.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#141210">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs('/assets/img/og-image.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_PK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(meta.title)}">
<meta name="twitter:description" content="${esc(meta.description)}">
<meta name="twitter:image" content="${abs('/assets/img/og-image.jpg')}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/assets/img/icon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Oswald:wght@500;600;700&display=swap">
${heroPreload}
<link rel="stylesheet" href="/assets/css/styles.css?v=${BUILD_ID}">
<script>document.documentElement.className='js'</script>
<script src="/assets/js/main.js?v=${BUILD_ID}" defer></script>
${businessSchema()}
${meta.path === '/' ? websiteSchema() : ''}
${crumbs}
${extra}
${ga}
</head>`;
}

const BUILD_ID = Date.now().toString(36);

function render(tpl, meta) {
  return tpl
    .replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => render(fs.readFileSync(path.join(SRC, 'partials', name + '.html'), 'utf8'), meta))
    .replace(/\{\{@(\w+)(?:\s+([^}]*))?\}\}/g, (_, name, arg) => {
      if (!components[name]) throw new Error(`Unknown component @${name}`);
      return components[name](arg && arg.trim(), meta);
    })
    .replace(/\{\{nav:(\w+)\}\}/g, (_, n) => (meta.nav === n ? ' aria-current="page"' : ''))
    .replace(/\{\{([\w.-]+)\}\}/g, (_, p) => {
      const v = tokenValue(p, meta);
      if (v === undefined) throw new Error(`Unknown token {{${p}}}`);
      return esc(v);
    });
}

/* ---------------- build ---------------- */

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else if (!e.name.endsWith('.json')) fs.copyFileSync(s, d);
  }
}

// "/" → dist/index.html, "/cars/" → dist/cars/index.html, "/404.html" → dist/404.html
const distFile = (p) => path.join(DIST, p.endsWith('/') ? p + 'index.html' : p);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
copyDir(path.join(SRC, 'static'), DIST);

const built = []; // { meta } of every page, in sitemap order
const titles = new Map();

function emit(meta, body) {
  for (const k of ['title', 'description']) meta[k] = render(meta[k], meta).replace(/&amp;/g, '&');
  if (meta.title.length > 60) console.warn(`  ! ${meta.path}: title is ${meta.title.length} chars (max 60)`);
  if (meta.description.length > 155) console.warn(`  ! ${meta.path}: description is ${meta.description.length} chars (max 155)`);
  if (titles.has(meta.title)) console.warn(`  ! ${meta.path}: same title as ${titles.get(meta.title)}`);
  titles.set(meta.title, meta.path);
  const out = distFile(meta.path);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, head(meta) + '\n' + body);
  built.push(meta);
  console.log(`  ✓ ${meta.path}`);
}

// Hand-written pages
const pages = fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html'));
pages.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
for (const file of pages) {
  const raw = fs.readFileSync(path.join(SRC, 'pages', file), 'utf8');
  const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: missing meta comment`);
  const meta = JSON.parse(m[1]);
  const name = file.replace(/\.html$/, '');
  meta.path = name === 'index' ? '/' : name === '404' ? '/404.html' : `/${name}/`;
  if (meta.crumb) meta.crumbs = [{ name: meta.crumb, path: meta.path }];
  emit(meta, render(raw.slice(m[0].length), meta));
}

// Generated landing pages: cities, areas, services
const landing = fs.readFileSync(path.join(SRC, 'templates', 'landing.html'), 'utf8');
for (const a of areas) {
  const parent = a.parent && areaBySlug[a.parent];
  if (a.parent && !parent) throw new Error(`${a.slug}: unknown parent "${a.parent}"`);
  const meta = {
    ...a,
    path: pageUrl(a.slug),
    nav: a.type === 'service' ? 'services' : 'areas',
    faqs: [...a.faqs, ...(a.type === 'area' ? [faqById.documents] : [])],
  };
  meta.crumbs = [
    ...(parent ? [{ name: parent.h1, path: pageUrl(parent.slug) }] : []),
    { name: a.type === 'area' ? a.name : a.h1, path: meta.path },
  ];
  meta.schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: a.h1,
      serviceType: a.serviceType || 'Car rental',
      url: abs(meta.path),
      description: stripTags(fill(a.lead)),
      provider: { '@id': abs('/#business') },
      areaServed:
        a.type === 'service'
          ? [{ '@type': 'City', name: 'Islamabad' }, { '@type': 'City', name: 'Rawalpindi' }]
          : { '@type': a.type === 'city' ? 'City' : 'Place', name: a.place },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'PKR', lowPrice: minRate, highPrice: maxRate, offerCount: cars.length },
    },
  ];
  emit(meta, render(landing, meta));
}

// sitemap.xml, robots.txt, llms.txt, manifest
const indexable = built.filter((m) => !m.noindex);
const priority = (m) => (m.path === '/' ? '1.0' : m.type === 'city' || m.slug === 'rent-a-car-g8-islamabad' ? '0.9' : '0.8');
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((m) => `  <url><loc>${abs(m.path)}</loc><lastmod>${today}</lastmod><priority>${priority(m)}</priority></url>`)
    .join('\n')}\n</urlset>\n`
);

// AI search and answer engines are named explicitly so nobody blocks them by accident with a later "Disallow".
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Bingbot', 'Applebot-Extended'];
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n${aiBots.map((b) => `User-agent: ${b}`).join('\n')}\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`
);

const llmLink = (m, note) => `- [${stripTags(m.h1 || m.title.split(' | ')[0])}](${abs(m.path)})${note ? `: ${note}` : ''}`;
const byType = (t) => built.filter((m) => m.type === t);
fs.writeFileSync(
  path.join(DIST, 'llms.txt'),
  `# ${site.name}

> ${site.name} (${site.legalName}) is a car rental company in ${addressLine()}, Pakistan, in business since ${site.foundedYear}. It rents cars with a driver or as self drive in Islamabad and Rawalpindi, from the Suzuki Alto to the Toyota Land Cruiser V8, Mercedes S-Class, Lexus LX 570 and Coaster, with delivery to every sector. Daily rates start at ${money(minRate)}. Phone/WhatsApp ${site.phoneDisplay}. Open ${site.hours}.

## Key facts
- Office: ${addressLine()}, ${site.address.region}, Pakistan
- Phone: ${site.phoneDisplay} · WhatsApp: +${site.whatsapp} · Email: ${site.email}
- Hours: ${site.hours}
- Experience: ${site.years} years (since ${site.foundedYear})
- Services: rent a car with driver, self drive (selected cars; CNIC, driving licence and refundable deposit), monthly and corporate contracts, Islamabad Airport pick and drop, wedding cars, out-of-city tours
- Organisations served: ${clients.map((c) => c.name).join(', ')}
- Daily rates${ratesUpdatedText ? ` (updated ${ratesUpdatedText})` : ''}: ${cars.map((c) => `${carName(c)} ${c.rate ? money(c.rate) : 'on request'}`).join('; ')}

## Key pages
${llmLink(built.find((m) => m.path === '/'), 'home page')}
${byType('city').map((m) => llmLink(m)).join('\n')}
- [Fleet](${abs('/cars/')}): all ${cars.length} cars
- [About](${abs('/about/')})
- [Contact & booking](${abs('/contact/')})

## Areas
${byType('area').map((m) => llmLink(m)).join('\n')}

## Services
${byType('service').map((m) => llmLink(m)).join('\n')}
`
);

fs.writeFileSync(
  path.join(DIST, 'site.webmanifest'),
  JSON.stringify({
    name: site.name, short_name: site.shortName, start_url: '/', display: 'standalone',
    background_color: '#FAF6EC', theme_color: '#141210',
    icons: [{ src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }],
  })
);

// Every internal link must point at a page or file that exists.
let broken = 0;
for (const m of built) {
  const html = fs.readFileSync(distFile(m.path), 'utf8');
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = href.endsWith('/') ? path.join(DIST, href, 'index.html') : path.join(DIST, href);
    if (!fs.existsSync(target)) { console.warn(`  ! ${m.path}: broken link ${href}`); broken++; }
  }
}
console.log(`Built ${built.length} pages → dist/${broken ? ` (${broken} broken links)` : ''}`);

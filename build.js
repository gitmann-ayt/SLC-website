#!/usr/bin/env node
/*
 * SLC Car Rental Services — static site builder (zero dependencies).
 *
 *   node build.js        → builds ./dist
 *
 * Pages live in src/pages/*.html and start with a meta comment:
 *   <!--meta {"title": "...", "description": "...", "nav": "fleet", "crumb": "Our Fleet"} -->
 *
 * Inside pages and partials:
 *   {{site.phoneDisplay}}   value from src/data/site.json (HTML-escaped)
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
const credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/credits.json'), 'utf8'));
const cities = readJSON('locations.json').cities;
for (const city of cities) for (const a of city.areas) a.city = city.name;
const areas = cities.flatMap((c) => c.areas);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const get = (obj, p) => p.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const abs = (p) => site.domain.replace(/\/$/, '') + p;
const wa = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const catLabel = (id) => (categories.find((c) => c.id === id) || {}).long || id;
const carName = (c) => `${c.make} ${c.model}`;
const carUrl = (c) => `/cars/${c.id}.html`;
const areaUrl = (a) => `/locations/${a.slug}.html`;
const areaName = (a) => (a.name.includes(a.city) || a.name.startsWith('DHA') ? a.name : `${a.name}, ${a.city}`);
const carMsg = (c) => `Assalam o Alaikum SLC, I'd like to rent the ${carName(c)}. Please share availability and rate.`;
const carImg = (c, sizes, attrs = 'loading="lazy"') => `<img src="/assets/img/cars/${c.id}-480.webp"
         srcset="/assets/img/cars/${c.id}-480.webp 480w, /assets/img/cars/${c.id}-800.webp 800w, /assets/img/cars/${c.id}-1200.webp 1200w"
         sizes="${sizes}" width="1200" height="750" ${attrs} decoding="async"
         alt="${esc(carName(c))} on rent in Islamabad and Rawalpindi, with or without driver">`;

/* ---------------- components ---------------- */

function carCard(c) {
  const name = carName(c);
  return `
<article class="car-card" data-cat="${c.category}">
  <a class="car-media img-wrap" href="${carUrl(c)}" tabindex="-1" aria-hidden="true">
    ${carImg(c, '(min-width: 1100px) 340px, (min-width: 700px) 45vw, 92vw')}
    <span class="car-tag">${esc(catLabel(c.category))}</span>
  </a>
  <div class="car-body">
    <h3 class="car-title"><a href="${carUrl(c)}"><span>${esc(c.make)}</span> ${esc(c.model)}</a></h3>
    <p class="car-use">${esc(c.use)}</p>
    <ul class="car-specs" aria-label="Specifications">
      <li>${icon('seat')}${c.seats} seats</li>
      <li>${icon('gear')}${esc(c.transmission)}</li>
      <li>${icon('fuel')}${esc(c.fuel)}</li>
    </ul>
    <p class="car-rate">${icon('star', 'star')} Ask for today's rate · with or without driver</p>
    <div class="car-actions">
      <a class="btn btn-wa btn-sm" href="${wa(carMsg(c))}" target="_blank" rel="noopener" aria-label="Book ${esc(name)} on WhatsApp">${icon('whatsapp')}WhatsApp</a>
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
  <div class="car-grid">${list.map(carCard).join('')}</div>
  <p class="fleet-empty" hidden>More cars in this category are available on request. <a href="/fleet.html">See the full fleet</a> or <a href="tel:${site.phoneTel}">call us</a>.</p>
</div>`;
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

function faq() {
  const items = faqs
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
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return `<div class="faq">${items}</div>\n<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function bookingForm(variant = 'hero', meta = {}) {
  const id = variant;
  const carOptions = categories
    .map((cat) => `<optgroup label="${esc(cat.long)}">${cars.filter((c) => c.category === cat.id).map((c) => `<option${meta.car === c ? ' selected' : ''}>${esc(carName(c))}</option>`).join('')}</optgroup>`)
    .join('');
  const full = variant !== 'hero';
  return `
<form class="book-form book-form--${variant}" data-book-form data-wa="${site.whatsapp}" data-email="${esc(site.email)}" novalidate>
  <div class="form-grid">
    <div class="field">
      <label for="${id}-pickup">Pick-up city / location</label>
      <input id="${id}-pickup" name="pickup" type="text" autocomplete="address-level2" placeholder="e.g. Islamabad Airport"${meta.area ? ` value="${esc(areaName(meta.area))}"` : ''} required>
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
      <label><input type="radio" name="driver" value="With driver" checked><span>With driver</span></label>
      <label><input type="radio" name="driver" value="Self drive"><span>Self drive</span></label>
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

function navMenu(_, meta) {
  const cur = (n) => (meta.nav === n ? ' aria-current="page"' : '');
  const carCols = categories
    .map((cat) => `<div class="mega-col"><p class="mega-h">${esc(cat.long)}</p><ul>${cars
      .filter((c) => c.category === cat.id)
      .map((c) => `<li><a href="${carUrl(c)}"${meta.car === c ? ' aria-current="page"' : ''}>${esc(carName(c))}</a></li>`)
      .join('')}</ul></div>`)
    .join('');
  const locCols = cities
    .map((city) => `<div class="mega-col"><p class="mega-h">${esc(city.name)}</p><ul class="cols-2">${city.areas
      .map((a) => `<li><a href="${areaUrl(a)}"${meta.area === a ? ' aria-current="page"' : ''}>${esc(a.name)}</a></li>`)
      .join('')}</ul></div>`)
    .join('');
  const dd = (id, label, href, n, cols, allLabel) => `
        <li class="has-dd">
          <div class="dd-row"><a href="${href}"${cur(n)}>${label}</a><button type="button" class="dd-toggle" aria-expanded="false" aria-controls="dd-${id}" aria-label="Show ${label} menu">${icon('chevron')}</button></div>
          <div class="dd" id="dd-${id}"><div class="dd-inner dd-${id}">${cols}</div><a class="dd-all" href="${href}">${allLabel} ${icon('arrow')}</a></div>
        </li>`;
  return `<ul class="nav-list">
        <li><a href="/"${cur('home')}>Home</a></li>${dd('cars', 'Our Fleet', '/fleet.html', 'fleet', carCols, 'View the full fleet')}${dd('places', 'Locations', '/locations.html', 'locations', locCols, 'All service areas')}
        <li><a href="/#services">Services</a></li>
        <li><a href="/about.html"${cur('about')}>About Us</a></li>
        <li><a href="/contact.html"${cur('contact')}>Contact Us</a></li>
      </ul>`;
}

function waPage(_, meta) {
  if (meta.car) return wa(carMsg(meta.car));
  if (meta.area) return wa(`Assalam o Alaikum SLC, I need a car on rent in ${areaName(meta.area)}.`);
  return wa('Assalam o Alaikum SLC, I need a car on rent.');
}

function carSpecs(_, { car: c }) {
  const rows = [
    ['seat', 'Seats', `${c.seats} passengers`],
    ['gear', 'Transmission', c.transmission],
    ['fuel', 'Fuel', c.fuel],
    ['car', 'Category', catLabel(c.category)],
    ['driver', 'Service', 'With driver or self drive'],
    ['star', 'Ideal for', c.use],
  ];
  return `<dl class="spec-grid">${rows.map(([i, k, v]) => `<div class="spec">${icon(i)}<dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}

function carHeroImg(_, { car }) {
  return carImg(car, '(min-width: 1000px) 600px, 92vw', 'fetchpriority="high"');
}

function similarCars(_, { car }) {
  const same = cars.filter((c) => c.category === car.category && c !== car);
  const list = (same.length >= 3 ? same : same.concat(cars.filter((c) => c.featured && c !== car && !same.includes(c)))).slice(0, 3);
  return `<div class="car-grid">${list.map(carCard).join('')}</div>`;
}

function carSchema(_, { car: c }) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Car', name: carName(c),
    brand: { '@type': 'Brand', name: c.make }, model: c.model, description: c.about,
    image: abs(`/assets/img/cars/${c.id}-1200.webp`), vehicleSeatingCapacity: c.seats,
    fuelType: c.fuel, vehicleTransmission: c.transmission, url: abs(carUrl(c)),
    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', seller: { '@id': abs('/#business') }, areaServed: ['Islamabad', 'Rawalpindi'] },
  })}</script>`;
}

function areaChips(arg, meta) {
  // arg: "all" | "city" (same city as current area, excluding it) | "<cityId>"
  const list = arg === 'city' ? areas.filter((a) => a.city === meta.area.city && a !== meta.area)
    : arg === 'all' ? areas : (cities.find((c) => c.id === arg) || { areas: [] }).areas;
  return `<ul class="chips">${list.map((a) => `<li><a href="${areaUrl(a)}">${icon('pin')}${esc(arg === 'all' ? areaName(a) : a.name)}</a></li>`).join('')}</ul>`;
}

function featuredCards() {
  return `<div class="car-grid">${cars.filter((c) => c.featured).slice(0, 6).map(carCard).join('')}</div>`;
}

function contactList() {
  return `
<ul class="contact-list">
  <li>${icon('phone')}<div><span class="cl-label">Call us 24/7</span><a href="tel:${site.phoneTel}">${esc(site.phoneDisplay)}</a>${site.phone2Display ? `<a href="tel:${site.phone2Tel}">${esc(site.phone2Display)}</a>` : ''}</div></li>
  <li>${icon('whatsapp')}<div><span class="cl-label">WhatsApp</span><a href="${wa('Assalam o Alaikum SLC, I need a car on rent.')}" target="_blank" rel="noopener">Chat with us now</a></div></li>
  <li>${icon('mail')}<div><span class="cl-label">Email</span><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
  <li>${icon('pin')}<div><span class="cl-label">Office</span><address>${esc(site.address.street)}, ${esc(site.address.locality)}, Pakistan</address></div></li>
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

function credits_() {
  return `<ul class="credits">${credits
    .map((c) => `<li><a href="${esc(c.page)}" rel="nofollow noopener" target="_blank">${esc(c.file.replace(/^File:/, ''))}</a>, ${esc(c.author || 'Unknown')}, ${esc(c.license)}</li>`)
    .join('')}</ul>`;
}

const components = {
  fleet, fleetCount, carList, clients: clientsStrip, clientNames, testimonials: testimonialCards, faq,
  bookingForm, contactList, map, wa: waPage, credits: credits_, navMenu, carSpecs, carHeroImg, similarCars, carSchema, areaChips, featuredCards, year: () => String(new Date().getFullYear()),
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
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: site.areas.map((a) => ({ '@type': 'City', name: a })),
    openingHours: site.hoursSchema,
    priceRange: '$$',
    sameAs: Object.values(site.social).filter(Boolean),
  };
  return `<script type="application/ld+json">${JSON.stringify(s)}</script>`;
}

function head(meta) {
  const url = abs(meta.path);
  const trail = meta.crumbs || (meta.crumb ? [{ name: meta.crumb, path: meta.path }] : null);
  const crumbs = trail
    ? `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
      })}</script>`
    : '';
  const ga = site.gaId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}');</script>`
    : '';
  const p = meta.preloadCar;
  const heroPreload = p
    ? `<link rel="preload" as="image" type="image/webp" href="/assets/img/cars/${p}-800.webp" imagesrcset="/assets/img/cars/${p}-480.webp 480w, /assets/img/cars/${p}-800.webp 800w, /assets/img/cars/${p}-1200.webp 1200w" imagesizes="(min-width: 1000px) 600px, 92vw" fetchpriority="high">`
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
${crumbs}
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
    .replace(/\{\{([\w.]+)\}\}/g, (_, p) => {
      const v = p.startsWith('meta.') ? get(meta, p.slice(5)) : get({ site }, p);
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

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
copyDir(path.join(SRC, 'static'), DIST);

const sitemap = [];
let count = 0;
function buildPage(srcFile, outPath, extra = {}) {
  const raw = fs.readFileSync(srcFile, 'utf8');
  const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${srcFile}: missing meta comment`);
  const meta = Object.assign(JSON.parse(m[1]), extra, { path: outPath });
  for (const k of ['title', 'description']) meta[k] = render(meta[k], meta).replace(/&amp;/g, '&').replace(/&#39;/g, "'");
  if (meta.title.length > 65) console.warn(`  ! ${outPath}: title is ${meta.title.length} chars`);
  if (meta.description.length > 165) console.warn(`  ! ${outPath}: description is ${meta.description.length} chars`);
  const body = render(raw.slice(m[0].length), meta);
  const file = path.join(DIST, outPath === '/' ? 'index.html' : outPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, head(meta) + '\n' + body);
  if (!meta.noindex) sitemap.push(meta.path);
  count++;
}

// Hand-written pages
for (const f of fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html'))) {
  buildPage(path.join(SRC, 'pages', f), f === 'index.html' ? '/' : '/' + f);
}
// One detail page per car
for (const car of cars) {
  buildPage(path.join(SRC, 'templates', 'car.html'), carUrl(car), {
    car, preloadCar: car.id,
    crumbs: [{ name: 'Our Fleet', path: '/fleet.html' }, { name: carName(car), path: carUrl(car) }],
  });
}
// One landing page per service area
for (const area of areas) {
  buildPage(path.join(SRC, 'templates', 'location.html'), areaUrl(area), {
    area, areaFull: areaName(area),
    crumbs: [{ name: 'Locations', path: '/locations.html' }, { name: areaName(area), path: areaUrl(area) }],
  });
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
    .map((p) => `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
fs.writeFileSync(
  path.join(DIST, 'site.webmanifest'),
  JSON.stringify({
    name: site.name, short_name: site.shortName, start_url: '/', display: 'standalone',
    background_color: '#FAF6EC', theme_color: '#141210',
    icons: [{ src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }],
  })
);
console.log(`Built ${count} pages (${cars.length} cars, ${areas.length} locations) → dist/`);

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

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const get = (obj, p) => p.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const abs = (p) => site.domain.replace(/\/$/, '') + p;
const wa = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const catLabel = (id) => (categories.find((c) => c.id === id) || {}).long || id;
const carName = (c) => `${c.make} ${c.model}`;

/* ---------------- components ---------------- */

function carCard(c) {
  const name = carName(c);
  const msg = `Assalam o Alaikum SLC, I'd like to rent the ${name}. Please share availability and rate.`;
  return `
<article class="car-card" data-cat="${c.category}">
  <div class="car-media img-wrap">
    <img src="/assets/img/cars/${c.id}-480.webp"
         srcset="/assets/img/cars/${c.id}-480.webp 480w, /assets/img/cars/${c.id}-800.webp 800w"
         sizes="(min-width: 1100px) 340px, (min-width: 700px) 45vw, 92vw"
         width="800" height="600" loading="lazy" decoding="async"
         alt="${esc(name)} available for rent in ${esc(site.city)} with or without driver">
    <span class="car-tag">${esc(catLabel(c.category))}</span>
  </div>
  <div class="car-body">
    <h3 class="car-title"><span>${esc(c.make)}</span> ${esc(c.model)}</h3>
    <p class="car-use">${esc(c.use)}</p>
    <ul class="car-specs" aria-label="Specifications">
      <li>${icon('seat')}${c.seats} seats</li>
      <li>${icon('gear')}${esc(c.transmission)}</li>
      <li>${icon('fuel')}${esc(c.fuel)}</li>
    </ul>
    <p class="car-rate">${icon('star', 'star')} Ask for today's rate · with or without driver</p>
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

function bookingForm(variant = 'hero') {
  const id = variant;
  const carOptions = categories
    .map((cat) => `<optgroup label="${esc(cat.long)}">${cars.filter((c) => c.category === cat.id).map((c) => `<option>${esc(carName(c))}</option>`).join('')}</optgroup>`)
    .join('');
  const full = variant !== 'hero';
  return `
<form class="book-form book-form--${variant}" data-book-form data-wa="${site.whatsapp}" data-email="${esc(site.email)}" novalidate>
  <div class="form-grid">
    <div class="field">
      <label for="${id}-pickup">Pick-up city / location</label>
      <input id="${id}-pickup" name="pickup" type="text" autocomplete="address-level2" placeholder="e.g. Islamabad Airport" required>
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

function waLink(text) {
  return wa(text || 'Assalam o Alaikum SLC, I need a car on rent.');
}

function credits_() {
  return `<ul class="credits">${credits
    .map((c) => `<li><a href="${esc(c.page)}" rel="nofollow noopener" target="_blank">${esc(c.file.replace(/^File:/, ''))}</a>, ${esc(c.author || 'Unknown')}, ${esc(c.license)}</li>`)
    .join('')}</ul>`;
}

const components = {
  fleet, fleetCount, carList, clients: clientsStrip, clientNames, testimonials: testimonialCards, faq,
  bookingForm, contactList, map, wa: waLink, credits: credits_, year: () => String(new Date().getFullYear()),
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
  const crumbs = meta.crumb
    ? `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: meta.crumb, item: url },
        ],
      })}</script>`
    : '';
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
      return components[name](arg && arg.trim());
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

const pages = fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html'));
const sitemap = [];
for (const file of pages) {
  const raw = fs.readFileSync(path.join(SRC, 'pages', file), 'utf8');
  const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: missing meta comment`);
  const meta = JSON.parse(m[1]);
  meta.path = file === 'index.html' ? '/' : '/' + file;
  for (const k of ['title', 'description']) meta[k] = render(meta[k], meta).replace(/&amp;/g, '&');
  if (meta.title.length > 65) console.warn(`  ! ${file}: title is ${meta.title.length} chars`);
  if (meta.description.length > 165) console.warn(`  ! ${file}: description is ${meta.description.length} chars`);
  const body = render(raw.slice(m[0].length), meta);
  fs.writeFileSync(path.join(DIST, file), head(meta) + '\n' + body);
  if (!meta.noindex) sitemap.push(meta.path);
  console.log(`  ✓ ${file}`);
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
console.log(`Built ${pages.length} pages → dist/`);

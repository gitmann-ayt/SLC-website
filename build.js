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
 * src/data/areas.json with the template src/templates/landing.html, car-model pages
 * (/cars/toyota-prado-rent-islamabad/) from src/data/models.json with src/templates/model.html,
 * and blog posts (/blog/<file name>/) from src/blog/*.html with src/templates/post.html.
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
const models = readJSON('models.json');
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
const modelUrl = (slug) => `/cars/${slug}/`;
const modelBySlug = Object.fromEntries(models.map((m) => [m.slug, m]));
const modelByCar = {};
for (const m of models)
  for (const id of m.cars) {
    if (!carById[id]) throw new Error(`models.json ${m.slug}: unknown car "${id}"`);
    modelByCar[id] = m;
  }
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Blog posts: src/blog/<slug>.html, each starting with a <!--meta {...} --> comment like the pages.
const posts = fs
  .readdirSync(path.join(SRC, 'blog'))
  .filter((f) => f.endsWith('.html'))
  .map((file) => {
    const raw = fs.readFileSync(path.join(SRC, 'blog', file), 'utf8');
    const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
    if (!m) throw new Error(`blog/${file}: missing meta comment`);
    const slug = file.replace(/\.html$/, '');
    return { ...JSON.parse(m[1]), slug, path: `/blog/${slug}/`, body: raw.slice(m[0].length) };
  })
  .sort((a, b) => b.date.localeCompare(a.date));
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

// Car photos (3:2) are assets/img/cars/<img>-<colour>-{480,800,1200}.webp, one set per colour in the
// car's "colors" ("White / Black" → <img>-white-*, <img>-black-*). The first colour is shown; the
// others only download when a visitor picks that colour's swatch. A car with no colour photos falls
// back to the older single set <img>-480/-800/-1200.webp, a black & white cut-out (the Honda City,
// and the Land Cruiser in the home-page hero).
const imgId = (c) => c.img || c.id;
const hasCarFile = (name) => fs.existsSync(path.join(ROOT, 'assets/img/cars', name));
const swatchColour = { white: '#f4f3ef', black: '#1d1d1d', grey: '#a3a6aa', silver: '#c4c6c8' };
const variants = (c) =>
  String(c.colors || '')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => ({ label, key: label.toLowerCase(), base: `/assets/img/cars/${imgId(c)}-${label.toLowerCase()}` }))
    .filter((v) => hasCarFile(`${imgId(c)}-${v.key}-480.webp`));
const isCutout = (c) => !variants(c).length;
const carPhoto = (c) => (isCutout(c) ? `/assets/img/cars/${imgId(c)}-800.webp` : `${variants(c)[0].base}-800.webp`);

// The car's photos stacked in one frame: the first colour as a normal <img>, the rest with data-src
// so they cost nothing until main.js swaps them in.
function carImgs(c, sizes, alt, attrs = 'loading="lazy"') {
  const set = (base) => `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w`;
  if (isCutout(c)) {
    const base = `/assets/img/cars/${imgId(c)}`;
    return `<img src="${base}-480.webp" srcset="${set(base)}" sizes="${sizes}" width="1200" height="750" ${attrs} decoding="async" alt="${esc(alt)}">`;
  }
  return variants(c)
    .map((v, i) =>
      i === 0
        ? `<img src="${v.base}-480.webp" srcset="${set(v.base)}" sizes="${sizes}" width="1200" height="800" ${attrs} decoding="async" alt="${esc(alt)}" data-colour="${v.key}">`
        : `<img class="car-alt" data-src="${v.base}-480.webp" data-srcset="${set(v.base)}" data-sizes="${sizes}" width="1200" height="800" decoding="async" alt="${esc(`${alt}, ${v.key}`)}" data-colour="${v.key}">`
    )
    .join('');
}

// Colour buttons that crossfade the photos (main.js); plain text when there is only one colour photo.
function swatches(c) {
  const vs = variants(c);
  if (vs.length < 2) return c.colors ? `${icon('drop')}${esc(c.colors)}` : '';
  return `<span class="swatches" role="group" aria-label="Colour">${vs
    .map((v, i) => `<button type="button" class="swatch" data-colour="${v.key}" aria-pressed="${i === 0}" title="${esc(v.label)}" style="--sw:${swatchColour[v.key] || '#ccc'}"><span class="sr-only">${esc(v.label)}</span></button>`)
    .join('')}</span>`;
}

/* ---------------- components ---------------- */

function carCard(c, place, imgAttrs) {
  const name = carName(c);
  const msg = `Assalam o Alaikum SLC, I'd like to rent the ${name}${place ? ` ${place}` : ''}${c.rate ? ` (${money(c.rate)}/day)` : ''}. Please share availability.`;
  const alt = place ? `${name} for rent ${place}` : `${name} available for rent in ${site.city} with or without driver`;
  const href = modelByCar[c.id] && modelUrl(modelByCar[c.id].slug);
  const media = `<span class="car-zoom">${carImgs(c, '(min-width: 1100px) 340px, (min-width: 700px) 45vw, 92vw', alt, imgAttrs)}</span>
    <span class="car-tag">${esc(catLabel(c.category))}</span>`;
  const mediaCls = `car-media img-wrap${isCutout(c) ? ' car-media--cutout' : ''}`;
  return `
<article class="car-card" data-cat="${c.category}">
  ${href ? `<a class="${mediaCls}" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>` : `<div class="${mediaCls}">${media}</div>`}
  <div class="car-body">
    <h3 class="car-title">${href ? `<a href="${href}">` : ''}<span>${esc(c.make)}</span> ${esc(c.model)}${href ? '</a>' : ''}</h3>
    <p class="car-use">${esc(c.use)}</p>
    <ul class="car-specs" aria-label="Specifications">
      <li>${icon('seat')}${c.seats} seats</li>
      <li>${icon('gear')}${esc(c.transmission)}</li>
      <li>${icon('fuel')}${esc(c.fuel)}</li>
      ${c.colors ? `<li class="car-colours">${swatches(c)}</li>` : ''}
    </ul>
    <p class="car-price">${c.rate ? `<strong>${money(c.rate)}</strong> <span>/ day</span>` : `${icon('star', 'star')} Ask for today's rate`}</p>
    <div class="car-actions">
      <a class="btn btn-wa btn-sm" href="${wa(msg)}" target="_blank" rel="noopener" aria-label="Book ${esc(name)} on WhatsApp">${icon('whatsapp')}WhatsApp</a>
      <a class="btn btn-outline btn-sm" href="tel:${site.phoneTel}" aria-label="Call to book ${esc(name)}">${icon('phone')}Call</a>
    </div>
  </div>
</article>`;
}

// On /cars/ the first card is on screen at load, so its photo loads at once and is not hidden while
// waiting for main.js (it can be the page's largest paint); every other card photo loads lazily.
const firstRow = (arg, i) => (arg === 'all' && i === 0 ? 'fetchpriority="low"' : undefined);

function fleet(arg) {
  const list = arg === 'featured' ? cars.filter((c) => c.featured) : cars;
  const tabs = [{ id: 'all', label: 'All cars' }, ...categories]
    .map((c, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-filter="${c.id}">${esc(c.label)}</button>`)
    .join('');
  return `
<div class="fleet" data-fleet>
  <div class="tabs" role="tablist" aria-label="Filter cars by category">${tabs}</div>
  <div class="car-grid">${list.map((c, i) => carCard(c, undefined, firstRow(arg, i))).join('')}</div>
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

// A scrolling strip: the list is written three times and CSS slides it left by a third, so the loop
// has no visible seam. Screen readers get the first copy only.
function clientsStrip() {
  const items = (hidden) =>
    clients
      .map((c) => `<li class="client"${hidden ? ' aria-hidden="true"' : ''}><span class="client-name">${esc(c.name)}</span><span class="client-sector">${esc(c.sector)}</span></li>`)
      .join('');
  return `<div class="marquee"><ul class="clients" aria-label="Organisations we have worked with">${items(false)}${items(true)}${items(true)}</ul></div>`;
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
    .map((cat) => `<optgroup label="${esc(cat.long)}">${cars.filter((c) => c.category === cat.id).map((c) => `<option${meta.selectCar === carName(c) ? ' selected' : ''}>${esc(carName(c))}</option>`).join('')}</optgroup>`)
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

// {{@wa}}: the page's own WhatsApp message on generated pages (which car / which area), else a general one.
function waLink(text, meta = {}) {
  if (meta.waText || meta.in) return waPage(null, meta);
  return wa(text || 'Assalam o Alaikum SLC, I need a car on rent.');
}

// Main navigation. "Our Fleet", "Areas" and "Services" open dropdowns listing every car-model page,
// area page and service page, so new entries in models.json / areas.json show up in the menu automatically.
function navMenu(arg, meta) {
  const cur = (n) => (meta.nav === n ? ' aria-current="page"' : '');
  const here = (p) => (meta.path === p ? ' aria-current="page"' : '');
  const col = (heading, links, cls = '') =>
    `<div class="mega-col"><p class="mega-h">${esc(heading)}</p><ul${cls ? ` class="${cls}"` : ''}>${links
      .map(([href, label]) => `<li><a href="${href}"${here(href)}>${esc(label)}</a></li>`)
      .join('')}</ul></div>`;
  const carCols = categories
    .map((cat) => [cat, models.filter((m) => carById[m.cars[0]].category === cat.id)])
    .filter(([, list]) => list.length)
    .map(([cat, list]) => col(cat.long, list.map((m) => [modelUrl(m.slug), m.name])))
    .join('');
  const placeCols = areas
    .filter((hub) => hub.type === 'city')
    .map((hub) =>
      col(hub.name, [[pageUrl(hub.slug), `All of ${hub.name}`], ...areas.filter((a) => a.parent === hub.slug).map((a) => [pageUrl(a.slug), a.name])], 'cols-2')
    )
    .join('');
  const serviceCol = col('Car rental services', areas.filter((a) => a.type === 'service').map((a) => [pageUrl(a.slug), a.name]));
  const dd = (id, label, href, n, cols, all) => `
        <li class="has-dd">
          <div class="dd-row"><a href="${href}"${cur(n)}>${label}</a><button type="button" class="dd-toggle" aria-expanded="false" aria-controls="dd-${id}" aria-label="Show ${label} menu">${icon('chevron')}</button></div>
          <div class="dd" id="dd-${id}"><div class="dd-inner dd-${id}">${cols}</div><a class="dd-all" href="${all[0]}">${all[1]} ${icon('arrow')}</a></div>
        </li>`;
  return `<ul class="nav-list">
        <li><a href="/"${cur('home')}>Home</a></li>${dd('cars', 'Our Fleet', '/cars/', 'fleet', carCols, ['/cars/', 'Full fleet &amp; daily rates'])}${dd('places', 'Areas', '/rent-a-car-islamabad/', 'areas', placeCols, ['/#areas', 'All areas we serve'])}
${dd('services', 'Services', '/#services', 'services', serviceCol, ['/#services', 'All our services'])}
        <li><a href="/about/"${cur('about')}>About Us</a></li>
        <li><a href="/contact/"${cur('contact')}>Contact Us</a></li>
      </ul>`;
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
  return wa(meta.waText || `Assalam o Alaikum SLC, I need a car on rent ${meta.in}.`);
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
${list.map((c) => `  <tr><th scope="row">${modelByCar[c.id] ? `<a href="${modelUrl(modelByCar[c.id].slug)}">${esc(carName(c))}</a>` : esc(carName(c))}</th><td>${c.seats}</td><td>${c.rate ? `<strong>${money(c.rate)}</strong>` : '<span class="rate-ask">Ask for rate</span>'}</td></tr>`).join('\n')}
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
  if (arg === 'models') return `<ul>${models.map((m) => `<li><a href="${modelUrl(m.slug)}">${esc(m.name)} on rent</a></li>`).join('')}</ul>`;
  const list = areas.filter((a) => (arg === 'services' ? a.type === 'service' : a.type !== 'service'));
  return `<ul>${list.map((a) => `<li><a href="${pageUrl(a.slug)}">${esc(linkLabel(a))}</a></li>`).join('')}</ul>`;
}

/* ----- car-model page components (meta = the page's entry in models.json) ----- */

function modelPhoto(arg, meta) {
  const c = carById[meta.cars[0]];
  const pick = variants(c).length > 1 ? `<p class="model-colours">Colours: ${swatches(c)}</p>` : '';
  return `<div class="model-photo-wrap"><figure class="model-photo img-wrap${isCutout(c) ? ' model-photo--cutout' : ''}"><span class="car-zoom">${carImgs(c, '(min-width: 1100px) 680px, 92vw', `${meta.name} for rent in Islamabad`, '')}</span></figure>${pick}</div>`;
}

function specTable(arg, meta) {
  const list = meta.cars.map((id) => carById[id]);
  const rows = [
    ['Seats', (c) => c.seats],
    ['Transmission', (c) => esc(c.transmission)],
    ['Fuel', (c) => esc(c.fuel)],
    ['Colours', (c) => esc(c.colors || '')],
    ['Rate per day', (c) => (c.rate ? `<strong class="nowrap">${money(c.rate)}</strong>` : '<span class="rate-ask">Ask for rate</span>')],
  ];
  const head = list.length > 1 ? `<thead><tr><td></td>${list.map((c) => `<th scope="col">${esc(c.model)}</th>`).join('')}</tr></thead>` : '';
  return `
<div class="table-wrap">
<table class="rates rates--spec">
  <caption>${esc(meta.name)} on rent in Islamabad and Rawalpindi. Every car can be booked with a driver; self drive is offered on selected cars.</caption>
  ${head}
  <tbody>
${rows.map(([label, f]) => `  <tr><th scope="row">${label}</th>${list.map((c) => `<td>${f(c)}</td>`).join('')}</tr>`).join('\n')}
  </tbody>
</table>
</div>
${ratesNote(meta)}`;
}

function relatedCars(arg, meta) {
  return `<div class="car-grid">${meta.related
    .map((slug) => {
      const m = modelBySlug[slug];
      if (!m) throw new Error(`${meta.slug}: unknown related model "${slug}"`);
      return carCard(carById[m.cars[0]], 'in Islamabad');
    })
    .join('')}</div>`;
}

/* ----- blog components ----- */

const readingTime = (post) => Math.max(1, Math.round(stripTags(post.body).split(/\s+/).length / 200));

function postMeta(arg, meta) {
  return `<time datetime="${meta.date}">${fmtDate(meta.date)}</time>${meta.updated ? ` · Updated <time datetime="${meta.updated}">${fmtDate(meta.updated)}</time>` : ''} · ${readingTime(meta)} min read`;
}

function postBody(arg, meta) {
  return render(meta.body, meta);
}

// {{@postList all}} = every post; {{@postList others}} = every post except the current one.
function postList(arg, meta) {
  const list = posts.filter((p) => arg !== 'others' || p.slug !== meta.slug);
  return `<ul class="post-list">${list
    .map(
      (p) => `<li><a href="${p.path}"><time datetime="${p.date}">${fmtDate(p.date)}</time><strong>${esc(p.h1)}</strong><span>${esc(fill(p.excerpt))}</span><span class="post-more">Read the guide${icon('arrow')}</span></a></li>`
    )
    .join('')}</ul>`;
}

const components = {
  fleet, pageCars, fleetCount, carList, clients: clientsStrip, clientNames, testimonials: testimonialCards, faq,
  bookingForm, contactList, map, wa: waLink, credits: credits_, navMenu, year: () => String(new Date().getFullYear()),
  crumbs, lead, napLine, waPage, sections, rates, priceList, modelPhoto, specTable, relatedCars, postMeta, postBody, postList, ratesHeading, carsHeading, faqHeading, nearbyHeading, nearby, areaGrid, pageLinks,
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
  // "preloadCar": "<img id>" in a page's meta preloads that car's cut-out (the home hero).
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
  for (const k of ['title', 'description']) meta[k] = render(meta[k], meta).replace(/&amp;/g, '&').replace(/&#39;/g, "'");
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

// Car-model pages
const modelTpl = fs.readFileSync(path.join(SRC, 'templates', 'model.html'), 'utf8');
for (const m of models) {
  const list = m.cars.map((id) => carById[id]);
  const meta = {
    ...m,
    type: 'model',
    path: modelUrl(m.slug),
    nav: 'fleet',
    in: 'in Islamabad',
    nearby: m.links,
    selectCar: carName(list[0]),
    waText: `Assalam o Alaikum SLC, I'd like to rent the ${m.name} in Islamabad. Please share availability.`,
    crumbs: [{ name: 'Our Fleet', path: '/cars/' }, { name: m.name, path: modelUrl(m.slug) }],
  };
  meta.schemas = list.map((c) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${carName(c)} for rent in Islamabad`,
    image: abs(carPhoto(c)),
    brand: { '@type': 'Brand', name: c.make },
    description: `${carName(c)} on rent in Islamabad and Rawalpindi: ${c.seats} seats, ${c.transmission.toLowerCase()}, ${c.fuel.toLowerCase()}. ${c.use}.`,
    ...(c.rate
      ? {
          offers: {
            '@type': 'Offer',
            url: abs(meta.path),
            price: c.rate,
            priceCurrency: 'PKR',
            priceSpecification: { '@type': 'UnitPriceSpecification', price: c.rate, priceCurrency: 'PKR', unitCode: 'DAY', unitText: 'per day' },
            businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
            availability: 'https://schema.org/InStock',
            seller: { '@id': abs('/#business') },
          },
        }
      : {}),
  }));
  emit(meta, render(modelTpl, meta));
}

// Blog posts
const postTpl = fs.readFileSync(path.join(SRC, 'templates', 'post.html'), 'utf8');
for (const p of posts) {
  const meta = { ...p, type: 'post', nav: 'blog', crumbs: [{ name: 'Blog', path: '/blog/' }, { name: p.h1, path: p.path }] };
  meta.schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: fill(p.h1),
      description: fill(p.description),
      datePublished: p.date,
      dateModified: p.updated || p.date,
      image: abs('/assets/img/og-image.jpg'),
      mainEntityOfPage: abs(p.path),
      author: { '@id': abs('/#business') },
      publisher: { '@id': abs('/#business') },
      inLanguage: 'en-PK',
    },
  ];
  emit(meta, render(postTpl, meta));
}

// sitemap.xml, robots.txt, llms.txt, manifest
const indexable = built.filter((m) => !m.noindex);
const priority = (m) => (m.path === '/' ? '1.0' : m.type === 'city' || m.slug === 'rent-a-car-g8-islamabad' ? '0.9' : m.type === 'post' ? '0.6' : '0.8');
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((m) => `  <url><loc>${abs(m.path)}</loc><lastmod>${m.type === 'post' ? m.updated || m.date : today}</lastmod><priority>${priority(m)}</priority></url>`)
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

## Cars
${byType('model').map((m) => llmLink(m)).join('\n')}

## Guides
${byType('post').map((m) => llmLink(m, fill(m.excerpt))).join('\n')}
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

/* SLC Car Rental Services — site behaviour (no dependencies) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- page progress bar ---------- */
  var progress = $('.progress');
  function startProgress() { if (progress) { progress.classList.remove('is-done'); void progress.offsetWidth; progress.classList.add('is-active'); } }
  function endProgress() { if (progress) { progress.classList.add('is-done'); progress.classList.remove('is-active'); } }
  startProgress();
  if (document.readyState === 'complete') endProgress(); else window.addEventListener('load', endProgress);
  window.addEventListener('pageshow', function (e) { if (e.persisted) endProgress(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    startProgress();
  });

  /* ---------- images: shimmer until loaded, then fade in ---------- */
  $$('.img-wrap img').forEach(function (img) {
    function done() { img.classList.add('is-loaded'); img.parentNode.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });

  /* ---------- mobile menu ---------- */
  var toggle = $('.menu-toggle'), nav = $('#nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
  }

  /* ---------- fleet filter ---------- */
  $$('[data-fleet]').forEach(function (fleet) {
    var tabs = $$('.tab', fleet), cards = $$('.car-card', fleet), empty = $('.fleet-empty', fleet);
    function apply(filter, focus) {
      var shown = 0;
      tabs.forEach(function (t) {
        var on = t.dataset.filter === filter;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      cards.forEach(function (c) {
        var show = filter === 'all' || c.dataset.cat === filter;
        c.hidden = !show;
        if (show) { shown++; c.classList.add('is-in'); }
      });
      if (empty) empty.hidden = shown > 0;
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { apply(t.dataset.filter); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); apply(tabs[(i + d + tabs.length) % tabs.length].dataset.filter, true); }
      });
    });
    var fromHash = location.hash.slice(1);
    if (fromHash && tabs.some(function (t) { return t.dataset.filter === fromHash; })) apply(fromHash);
  });

  /* ---------- booking forms → WhatsApp / email ---------- */
  var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  function fmt(d) {
    if (!d) return '';
    var p = d.split('-');
    return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  $$('[data-book-form]').forEach(function (form) {
    var from = form.elements.from, to = form.elements.to, err = $('.form-error', form);
    if (from) { from.min = today; from.addEventListener('change', function () { if (to) { to.min = from.value || today; if (to.value && to.value < from.value) to.value = from.value; } }); }
    if (to) to.min = today;

    function collect() {
      var bad = [];
      ['pickup', 'from', 'name', 'phone'].forEach(function (n) {
        var el = form.elements[n];
        var ok = el && el.value.trim() && (n !== 'phone' || /[0-9]{7,}/.test(el.value.replace(/\D/g, '')));
        if (el) { el.classList.toggle('is-invalid', !ok); el.setAttribute('aria-invalid', String(!ok)); }
        if (!ok) bad.push(el);
      });
      if (bad.length) {
        err.textContent = 'Please fill in the highlighted fields so we can prepare your quote.';
        err.hidden = false; bad[0].focus();
        return null;
      }
      err.hidden = true;
      var f = form.elements, driver = form.querySelector('input[name="driver"]:checked');
      var lines = [
        'Assalam o Alaikum SLC, I would like to book a car.',
        '',
        '• Name: ' + f.name.value.trim(),
        '• Phone: ' + f.phone.value.trim(),
        '• Pick-up: ' + f.pickup.value.trim(),
        '• Dates: ' + fmt(f.from.value) + (f.to && f.to.value ? ' to ' + fmt(f.to.value) : ''),
        '• Car: ' + (f.car.value || 'Any suitable car'),
        '• Service: ' + (driver ? driver.value : 'With driver')
      ];
      if (f.message && f.message.value.trim()) lines.push('• Notes: ' + f.message.value.trim());
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = collect();
      if (msg) window.open('https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
    var mail = $('[data-mailto]', form);
    if (mail) mail.addEventListener('click', function () {
      var msg = collect();
      if (msg) location.href = 'mailto:' + form.dataset.email + '?subject=' + encodeURIComponent('Car rental booking request') + '&body=' + encodeURIComponent(msg);
    });
    form.addEventListener('input', function (e) { if (e.target.classList.contains('is-invalid') && e.target.value.trim()) { e.target.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); } });
  });

  /* ---------- map: load only on demand ---------- */
  $$('.map[data-map]').forEach(function (box) {
    var btn = $('.map-load', box);
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = box.dataset.map; f.title = 'SLC Car Rental Services location on Google Maps';
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f); btn.remove();
    });
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var items = $$('.section-head, .car-card, .service, .step, .client, .t-card, .why-list li, .faq-item');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight) return; // already on screen: leave visible
      el.classList.add('reveal'); io.observe(el);
    });
  }
})();

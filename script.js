/* =============================================
   HIGHBURY HILL — Interactions + Google Maps
   ============================================= */

/* --- Intro animation: logo rises, lifestyle images cascade from depth,
       then the overlay lifts to reveal the hero (Rekha-style preloader) --- */
(function () {
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  function finish() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    document.body.style.overflow = '';
    /* make sure the hero tagline + button are visible no matter what */
    if (typeof gsap !== 'undefined') gsap.set(['.hero-title', '.hero-cta'], { clearProps: 'all' });
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || typeof gsap === 'undefined') { finish(); return; }

  /* Lock scroll while the intro plays */
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', function () {
    var tl = gsap.timeline({ onComplete: finish });

    tl
      /* 1 — logo (with halo) rises + scales in */
      .fromTo('.intro-logo-wrap',
        { y: 50, scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'power3.out' })
      /* 2 — all lifestyle tiles cascade in from depth, staggered */
      .fromTo('.intro-img',
        { y: 55, scale: 0.82, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.3, stagger: 0.1, ease: 'power3.out' },
        '-=0.8')
      /* 3 — hold the full collage a beat */
      .to({}, { duration: 0.5 })
      /* 4 — decorative tiles + logo fade away... */
      .to('.intro-img:not(.intro-hero-tile)',
        { opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.03, ease: 'power2.in' })
      .to('.intro-logo-wrap',
        { opacity: 0, y: -28, duration: 0.6, ease: 'power2.in' }, '<')
      /* 5 — ...while the hero tile expands to fill the whole screen */
      .to('.intro-hero-tile',
        { top: 0, left: 0, width: '100%', height: '100%', duration: 1.3, ease: 'power3.inOut' }, '<0.05')
      /* 6 — cross-fade the overlay out onto the matching real hero */
      .to('.intro-overlay',
        { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, '+=0.15')
      /* 7 — tagline rises up on the dark-filtered hero */
      .from('.hero-title',
        { y: 50, opacity: 0, duration: 1.3, ease: 'power3.out' }, '-=0.35')
      /* 8 — offer button fades up */
      .from('.hero-cta',
        { y: 28, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.8');
  });

  /* Safety net — never leave the user trapped behind the overlay */
  setTimeout(finish, 12000);
})();

/* Hero is now a still image (see .hero-still) — no video injection needed */

/* --- Google Maps: lazy-load API only when location section is near viewport --- */
(function () {
  var mapEl = document.getElementById('googleMap');
  if (!mapEl) return;

  var mapLoaded = false;
  var mapObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !mapLoaded) {
      mapLoaded = true;
      var s = document.createElement('script');
      s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDsNEx5nu6E0QXdfy9BRyPDyhDhd-JqmLc&callback=initMap';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      mapObserver.disconnect();
    }
  }, { rootMargin: '300px' });

  mapObserver.observe(mapEl);
})();


/* --- Header scroll state + active nav link --- */
const header = document.getElementById('site-header');
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);

  // Highlight active nav link based on scroll position
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* --- Mobile menu --- */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

/* --- Unit type tabs (cross-fade) --- */
const unitTabs = document.querySelectorAll('.unit-tab');
const unitPanels = document.querySelectorAll('.unit-panel');

unitTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const next = document.getElementById('tab-' + tab.dataset.tab);
    if (!next || next.classList.contains('active')) return;
    unitTabs.forEach(t => t.classList.remove('active'));
    unitPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    /* Reset panel fade animation so it replays on every tab switch */
    next.style.animation = 'none';
    next.offsetHeight; // reflow flush
    next.style.animation = '';
    next.classList.add('active');
    /* Re-trigger main photo slide reveal for the incoming panel */
    const mainPhoto = next.querySelector('.unit-main-photo');
    if (mainPhoto && mainPhoto.classList.contains('reveal-left')) {
      mainPhoto.classList.remove('in-view');
      void mainPhoto.offsetHeight; // reflow
      mainPhoto.classList.add('in-view');
    }
  });
});

/* Thumbnail switcher removed — single main photo per unit type */

/* --- Floor plan toggle --- */
document.querySelectorAll('.fp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const fpId = btn.dataset.fp;
    const fpImg = document.getElementById(fpId);
    if (!fpImg) return;

    // Update active button within same floor plan group
    document.querySelectorAll(`[data-fp="${fpId}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Swap floor plan image with fade
    fpImg.style.opacity = '0';
    setTimeout(() => {
      fpImg.src = btn.dataset.src;
      fpImg.style.opacity = '1';
    }, 200);
  });
});

/* --- Map toggle --- */
const mapToggles = document.querySelectorAll('.map-toggle');
const mapViews = document.querySelectorAll('.map-view');

mapToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    mapToggles.forEach(b => b.classList.remove('active'));
    mapViews.forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('map-' + btn.dataset.map);
    if (target) target.classList.add('active');

    // Re-center map when switching back to Google Maps tab
    if (btn.dataset.map === 'google' && window._highburiMap) {
      setTimeout(() => {
        google.maps.event.trigger(window._highburiMap, 'resize');
        window._highburiMap.setCenter(VENUE.coords);
      }, 100);
    }
  });
});

/* Hero text removed — no entry animation needed */

/* --- Scroll reveal system (staggered, viewport-triggered) --- */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function addReveal(el, delayMs) {
    el.classList.add('reveal');
    if (delayMs) el.style.setProperty('--reveal-delay', delayMs);
  }
  function addRevealLeft(el, delayMs) {
    el.classList.add('reveal-left');
    if (delayMs) el.style.setProperty('--reveal-delay', delayMs);
  }

  /* Section headings — label then title stagger */
  document.querySelectorAll('section').forEach(sec => {
    const label = sec.querySelector('.section-label');
    const title = sec.querySelector('.section-title');
    if (label) addReveal(label, 0);
    if (title) addReveal(title, 110);
  });

  /* Concept — philosophy quote + each section text block */
  document.querySelectorAll('.concept-philosophy').forEach(el => addReveal(el, 100));
  document.querySelectorAll('.concept-section-text').forEach(el => addReveal(el, 80));

  /* Staggered grids */
  [
    ['.fact-item',   80],
    ['.amenity-item', 70],
    ['.distance-item:not(.distance-hidden)', 45],
  ].forEach(([sel, step]) => {
    document.querySelectorAll(sel).forEach((el, i) => addReveal(el, i * step));
  });

  /* Gallery is a Swiper slideshow — no per-item reveal (would clash with slide transforms) */

  /* Register & location blocks */
  document.querySelectorAll('.register-text, .register-form-wrap').forEach((el, i) => addReveal(el, i * 130));
  document.querySelectorAll('.location-text, .location-map').forEach((el, i) => addReveal(el, i * 120));

  /* House type panels — detail panel fades up; photo slides in from left */
  document.querySelectorAll('.unit-detail').forEach(el => addReveal(el, 120));
  document.querySelectorAll('.unit-main-photo').forEach(el => addRevealLeft(el, 0));

  /* Reduced-motion: show everything immediately */
  if (prefersReduced) {
    document.querySelectorAll('.reveal, .reveal-left').forEach(el => el.classList.add('in-view'));
    return;
  }

  /* Single observer for both reveal variants */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  /* Only observe elements below the initial viewport — prevents animations firing on page load.
     Elements already in view get in-view immediately so they're visible without blocking. */
  document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      revealObs.observe(el);
    } else {
      el.classList.add('in-view');
    }
  });

  /* --- Concept images: overflow-mask slide reveal (img inside wrapper) --- */
  const clipImgs = Array.from(document.querySelectorAll('.concept-img-wrap'));
  clipImgs.forEach((el, i) => {
    el.classList.add('img-clip-reveal');
    const inner = el.querySelector('img');
    if (inner) inner.style.transitionDelay = `${i * 0.18}s`;
  });

  const clipObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        clipObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });
  clipImgs.forEach(el => clipObs.observe(el));
  setTimeout(() => {
    clipImgs.forEach(el => { if (!el.classList.contains('revealed')) el.classList.add('revealed'); });
  }, 2500);
})();

/* --- Registration form → Google Sheet (Apps Script Web App) --- */
/* Paste your deployed Apps Script Web App URL between the quotes below. */
const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwzegRPKkEB_JmvladtrDGaYCHI2bI0IDQUvL1hTfU_SE2cFnjDM9NxkAzBt9QYvhPq/exec';

const form = document.getElementById('registerForm');
const formSuccess = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();

  /* Collect the lead */
  const data = new URLSearchParams();
  data.append('firstName', (form.firstName && form.firstName.value) || '');
  data.append('lastName',  (form.lastName && form.lastName.value) || '');
  data.append('mobile',    (form.mobile && form.mobile.value) || '');
  data.append('email',     (form.email && form.email.value) || '');
  data.append('unitType',  (form.unitType && form.unitType.value) || '');
  data.append('budget',    (form.budget && form.budget.value) || '');
  data.append('lang',      window.HH_LANG || 'en');
  data.append('page',      location.href);

  /* Send to the sheet (fire-and-forget; no-cors avoids CORS issues) */
  if (LEAD_ENDPOINT.indexOf('http') === 0 && LEAD_ENDPOINT.indexOf('PASTE_YOUR_DEPLOYMENT_ID') === -1) {
    fetch(LEAD_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data }).catch(() => {});
  }

  /* Pop up the thank-you modal, reset the form for next time */
  formSuccess.classList.add('show');
  form.reset();
});

/* Close the thank-you popup */
function closeFormSuccess() { formSuccess.classList.remove('show'); }
const successCloseBtn = document.getElementById('successClose');
if (successCloseBtn) successCloseBtn.addEventListener('click', closeFormSuccess);
formSuccess.addEventListener('click', e => { if (e.target === formSuccess) closeFormSuccess(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && formSuccess.classList.contains('show')) closeFormSuccess();
});

/* --- Gallery Lightbox --- */
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lbImg');
const lbClose    = document.getElementById('lbClose');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');
const lbCounter  = document.getElementById('lbCounter');

/* Build unique lightbox image list from both marquee rows (dedupe by src) */
let lbImages = [];
let lbIdx = 0;

(function () {
  const rows = document.querySelectorAll('.gallery-row');
  if (!rows.length) return;

  const seen = new Set();
  document.querySelectorAll('.gallery-row .swiper-slide img').forEach(img => {
    if (!seen.has(img.src)) { seen.add(img.src); lbImages.push({ src: img.src, alt: img.alt }); }
  });

  /* Click a tile → open lightbox at the matching image (ignore drag-clicks) */
  rows.forEach(row => {
    row.addEventListener('click', e => {
      const img = e.target.closest('.swiper-slide')?.querySelector('img');
      if (!img || row.classList.contains('swiper-was-dragging')) return;
      const idx = lbImages.findIndex(x => x.src === img.src);
      if (idx >= 0) openLightbox(idx);
    });
  });
})();

function openLightbox(i) {
  lbIdx = i;
  lbImg.src = lbImages[i].src;
  lbImg.alt = lbImages[i].alt;
  lbCounter.textContent = (i + 1) + ' / ' + lbImages.length;
  /* hide nav + counter when there's only one image (e.g. a floor plan) */
  var single = lbImages.length <= 1;
  lbPrev.style.display    = single ? 'none' : '';
  lbNext.style.display    = single ? 'none' : '';
  lbCounter.style.display = single ? 'none' : '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* --- Floor plan: click to open full-size in the lightbox --- */
document.querySelectorAll('.floorplan-img').forEach(function (img) {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', function () {
    lbImages = [{ src: img.src, alt: img.alt || 'Floor Plan' }];
    openLightbox(0);
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => openLightbox((lbIdx - 1 + lbImages.length) % lbImages.length));
lbNext.addEventListener('click', () => openLightbox((lbIdx + 1) % lbImages.length));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   openLightbox((lbIdx - 1 + lbImages.length) % lbImages.length);
  if (e.key === 'ArrowRight')  openLightbox((lbIdx + 1) % lbImages.length);
});

/* Touch swipe navigation in lightbox */
let _lbTouchX = 0;
lightbox.addEventListener('touchstart', e => { _lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _lbTouchX;
  if (Math.abs(dx) < 40) return;
  if (dx < 0) openLightbox((lbIdx + 1) % lbImages.length);
  else         openLightbox((lbIdx - 1 + lbImages.length) % lbImages.length);
});

/* Location Show More */
const MORE_LABEL = { en: ['Show More', 'Show Less'], th: ['ดูเพิ่มเติม', 'ดูน้อยลง'] };
const locationShowMoreBtn = document.getElementById('locationShowMore');
if (locationShowMoreBtn) {
  locationShowMoreBtn.addEventListener('click', () => {
    const hidden = document.querySelectorAll('.distance-hidden');
    const isExpanded = locationShowMoreBtn.classList.contains('expanded');
    hidden.forEach(el => { el.style.display = isExpanded ? '' : 'flex'; });
    locationShowMoreBtn.classList.toggle('expanded', !isExpanded);
    const lbl = MORE_LABEL[window.HH_LANG || 'en'];
    locationShowMoreBtn.querySelector('span').textContent = isExpanded ? lbl[0] : lbl[1];
  });
}

/* =============================================
   LANGUAGE  —  EN / TH  live toggle
   ============================================= */
(function () {
  const rules = [
    /* Nav */
    { sel: '.main-nav a', all: true,
      en: ['Concept','House Types','Location','Atmosphere','Register'],
      th: ['แนวคิด','แบบบ้าน','ทำเล','บรรยากาศ','ลงทะเบียน'] },
    { sel: '.mobile-nav a', all: true,
      en: ['Concept','House Types','Location','Atmosphere','Register'],
      th: ['แนวคิด','แบบบ้าน','ทำเล','บรรยากาศ','ลงทะเบียน'] },

    /* Hero */
    { sel: '.hero-title', html: true,
      en: 'Where Luxury<br><em>Meets Life</em>',
      th: 'ที่ซึ่งความหรูหรา<br><em>มาบรรจบกับชีวิต</em>' },
    { sel: '.hero-cta', en: 'View Our Offer', th: 'ดูข้อเสนอพิเศษ' },

    /* Register */
    { sel: '.register-text .section-label', en: 'Register', th: 'ลงทะเบียน' },
    { sel: '.register-text .section-title', html: true,
      en: 'Begin Your<br><em>Journey</em>', th: 'เริ่มต้น<br><em>การเดินทางของคุณ</em>' },
    { sel: '.line-qr-caption', en: 'Scan to add us on LINE', th: 'สแกนเพื่อเพิ่มเพื่อนทาง LINE' },
    { sel: '.register-desc',
      en: 'Take the first step towards your dream home. Register your interest and our team will be in touch to guide you through the process.',
      th: 'ก้าวแรกสู่บ้านในฝันของคุณ ลงทะเบียนความสนใจ แล้วทีมงานของเราจะติดต่อกลับเพื่อดูแลคุณในทุกขั้นตอน' },
    { sel: 'label[for="firstName"]', html: true, en: 'First Name <span>*</span>', th: 'ชื่อ <span>*</span>' },
    { sel: 'label[for="lastName"]',  en: 'Last Name',  th: 'นามสกุล' },
    { sel: 'label[for="mobile"]',    html: true, en: 'Mobile Number <span>*</span>', th: 'เบอร์โทรศัพท์ <span>*</span>' },
    { sel: 'label[for="email"]',     en: 'Email Address', th: 'อีเมล' },
    { sel: 'label[for="unitType"]',  en: 'Interested Unit Type', th: 'แบบบ้านที่สนใจ' },
    { sel: 'label[for="budget"]',    en: 'Budget Range', th: 'งบประมาณ' },
    { sel: 'label[for="consent"]',   html: true,
      en: 'I consent to HIGHBURY HILL contacting me with project information and agree to the <a href="#">Privacy Policy</a>.',
      th: 'ฉันยินยอมให้ HIGHBURY HILL ติดต่อเพื่อให้ข้อมูลโครงการ และยอมรับ<a href="#">นโยบายความเป็นส่วนตัว</a>' },
    { sel: '#firstName', attr: 'placeholder', en: 'Your first name', th: 'ชื่อของคุณ' },
    { sel: '#lastName',  attr: 'placeholder', en: 'Your last name',  th: 'นามสกุลของคุณ' },
    { sel: '#unitType option[value=""]', en: '— Select —', th: '— เลือก —' },
    { sel: '#budget option[value=""]',   en: '— Select —', th: '— เลือก —' },
    { sel: '#budget option[value="10-15"]', en: '฿10.9 – 15 Million THB', th: '฿10.9 – 15 ล้านบาท' },
    { sel: '#budget option[value="15-20"]', en: '฿15 – 20 Million THB',   th: '฿15 – 20 ล้านบาท' },
    { sel: '#budget option[value="20-27"]', en: '฿20 – 27 Million THB',   th: '฿20 – 27 ล้านบาท' },
    { sel: '#budget option[value="27+"]',   en: '฿27.2 Million THB+',     th: '฿27.2 ล้านบาทขึ้นไป' },
    { sel: '.register-form button[type="submit"]', en: 'Register Now', th: 'ลงทะเบียนเลย' },
    { sel: '.form-success h3', en: 'Thank You!', th: 'ขอบคุณค่ะ' },
    { sel: '.form-success p',
      en: "We've received your registration. Our team will contact you shortly.",
      th: 'เราได้รับการลงทะเบียนของคุณแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด' },

    /* Concept */
    { sel: '.concept-header .section-label', en: 'Our Concept', th: 'แนวคิดของเรา' },
    { sel: '.concept-header .section-title', html: true,
      en: 'A Private World<br><em>Above the Ordinary</em>', th: 'โลกส่วนตัว<br><em>เหนือระดับ</em>' },
    { sel: '.concept-philosophy', html: true,
      en: 'Where the boundary between home and nature dissolves —<br>and every moment becomes an invitation to live deliberately.',
      th: 'ที่ซึ่งเส้นแบ่งระหว่างบ้านกับธรรมชาติเลือนหาย —<br>และทุกช่วงเวลาคือคำเชิญให้ใช้ชีวิตอย่างตั้งใจ' },
    { sel: '.concept-section-title', all: true,
      en: ["Nature's Sanctuary", 'Refined Craft', 'Deliberate Living'],
      th: ['สุนทรียะแห่งธรรมชาติ', 'งานออกแบบอันประณีต', 'การใช้ชีวิตอย่างตั้งใจ'] },
    { sel: '.concept-section-desc', all: true,
      en: [
        "Nestled within Pattaya's rolling hills, where lush landscapes and mountain silhouettes define the horizon. Here, home and nature are one.",
        'Every detail considered, every material chosen with purpose. A home designed so that nothing is arbitrary — and everything reflects who you are.',
        'Two distinct pool villa typologies. One extraordinary way of life — not simply lived, but chosen with intention at every step.'
      ],
      th: [
        'ตั้งอยู่บนเนินเขาของพัทยา ท่ามกลางภูมิทัศน์เขียวขจีและแนวภูเขาเป็นฉากหลัง ที่ซึ่งบ้านและธรรมชาติเป็นหนึ่งเดียว',
        'ใส่ใจทุกรายละเอียด คัดสรรทุกวัสดุอย่างมีจุดมุ่งหมาย บ้านที่ออกแบบให้ทุกสิ่งมีความหมายและสะท้อนตัวตนของคุณ',
        'พูลวิลล่าสองรูปแบบที่แตกต่าง หนึ่งวิถีชีวิตอันพิเศษ ที่ไม่เพียงใช้ชีวิต แต่เลือกอย่างตั้งใจในทุกย่างก้าว'
      ] },

    /* Atmosphere */
    { sel: '#atmosphere .section-label', en: 'Atmosphere', th: 'บรรยากาศ' },
    { sel: '#atmosphere .section-title', html: true,
      en: 'A Glimpse of <em>Your Future Home</em>', th: 'ภาพบรรยากาศ<em>บ้านในอนาคตของคุณ</em>' },

    /* Fact sheet */
    { sel: '.fact-label', all: true,
      en: ['House Typologies','Total Residences','Sqm. per Unit','Starting Price','63 Units · Q3/2026'],
      th: ['แบบบ้าน','ยูนิตทั้งหมด','ตร.ม. ต่อยูนิต','ราคาเริ่มต้น','63 ยูนิต · ไตรมาส 3/2026'] },
    { sel: '.fact-item:nth-child(5) .fact-number', en: 'Phase 1', th: 'เฟส 1' },

    /* House types */
    { sel: '.units .section-label', en: 'House Types', th: 'แบบบ้าน' },
    { sel: '.units .section-title', html: true,
      en: 'Find Your <em>Perfect Home</em>', th: 'ค้นหา<em>บ้านที่ใช่</em>ของคุณ' },
    { sel: '.unit-subtitle', all: true,
      en: ['Private Pool Villa','Private Pool Villa','Grand Pool Villa','Signature Pool Villa'],
      th: ['พูลวิลล่าส่วนตัว','พูลวิลล่าส่วนตัว','แกรนด์พูลวิลล่า','พูลวิลล่าซิกเนเจอร์'] },
    { sel: '.unit-specs', all: true, html: true,
      en: [
        '285 Sq.M &nbsp;·&nbsp; 4 Bedrooms &nbsp;·&nbsp; 5 Bathrooms &nbsp;·&nbsp; 2 Car Parking &nbsp;·&nbsp; 1 Private Pool',
        '375 Sq.M &nbsp;·&nbsp; 4 Bedrooms &nbsp;·&nbsp; 5 Bathrooms &nbsp;·&nbsp; 3 Car Parking &nbsp;·&nbsp; 1 Private Pool',
        '484 Sq.M &nbsp;·&nbsp; 4 Bedrooms &nbsp;·&nbsp; 5 Bathrooms &nbsp;·&nbsp; 4 Car Parking &nbsp;·&nbsp; 1 Private Pool',
        '590 Sq.M &nbsp;·&nbsp; 5 Bedrooms &nbsp;·&nbsp; 6 Bathrooms &nbsp;·&nbsp; 1 Maid Room &nbsp;·&nbsp; 4 Car Parking &nbsp;·&nbsp; 1 Private Pool'
      ],
      th: [
        '285 ตร.ม. &nbsp;·&nbsp; 4 ห้องนอน &nbsp;·&nbsp; 5 ห้องน้ำ &nbsp;·&nbsp; จอดรถ 2 คัน &nbsp;·&nbsp; สระส่วนตัว 1 สระ',
        '375 ตร.ม. &nbsp;·&nbsp; 4 ห้องนอน &nbsp;·&nbsp; 5 ห้องน้ำ &nbsp;·&nbsp; จอดรถ 3 คัน &nbsp;·&nbsp; สระส่วนตัว 1 สระ',
        '484 ตร.ม. &nbsp;·&nbsp; 4 ห้องนอน &nbsp;·&nbsp; 5 ห้องน้ำ &nbsp;·&nbsp; จอดรถ 4 คัน &nbsp;·&nbsp; สระส่วนตัว 1 สระ',
        '590 ตร.ม. &nbsp;·&nbsp; 5 ห้องนอน &nbsp;·&nbsp; 6 ห้องน้ำ &nbsp;·&nbsp; ห้องแม่บ้าน 1 ห้อง &nbsp;·&nbsp; จอดรถ 4 คัน &nbsp;·&nbsp; สระส่วนตัว 1 สระ'
      ] },
    { sel: '.unit-detail .btn', all: true, en: 'Register Interest', th: 'ลงทะเบียนสนใจ' },
    { sel: '.fp-btn', all: true,
      en: ['1st Floor','2nd Floor','1st Floor','2nd Floor','1st Floor','2nd Floor','1st Floor','2nd Floor'],
      th: ['ชั้น 1','ชั้น 2','ชั้น 1','ชั้น 2','ชั้น 1','ชั้น 2','ชั้น 1','ชั้น 2'] },

    /* Amenities */
    { sel: '.amenities .section-label', en: 'Amenities', th: 'สิ่งอำนวยความสะดวก' },
    { sel: '.amenities .section-title', html: true,
      en: 'A Life Well <em>Lived</em>', th: 'ชีวิตที่<em>สมบูรณ์แบบ</em>' },
    { sel: '.amenity-item p', all: true, html: true,
      en: ['Swimming Pool<br>&amp; Kids Pool','Fitness &amp; Kids<br>Club House','Kids Playground','Garden &amp;<br>Jogging Track','24/7 Security<br>&amp; CCTV','Underground<br>Cable System'],
      th: ['สระว่ายน้ำ<br>และสระเด็ก','ฟิตเนสและ<br>คลับเฮาส์เด็ก','สนามเด็กเล่น','สวน<br>และลู่วิ่ง','รักษาความปลอดภัย 24 ชม.<br>และกล้องวงจรปิด','ระบบสายไฟ<br>ใต้ดิน'] },

    /* Location */
    { sel: '.location-text .section-label', en: 'Location', th: 'ทำเลที่ตั้ง' },
    { sel: '.location-text .section-title', html: true,
      en: 'Perfectly<br><em>Connected</em>', th: 'เชื่อมต่อ<br><em>ทุกการเดินทาง</em>' },
    { sel: '.location-address', html: true,
      en: 'Chaiyapruke 2 Road, Banglamung<br>Pattaya · Chonburi 20150',
      th: 'ถนนชัยพฤกษ์ 2 บางละมุง<br>พัทยา · ชลบุรี 20150' },
    { sel: '.distance-item span:first-child', all: true,
      en: ['Tara Pattana International School','Sukhumvit Road','Siam Country Club','Highgate International School','Jomtien Beach','Ocean Marina Yacht Club','Jomtien Hospital',"Columbia Pictures' Aquaverse",'Rugby International School','Nongnooch Pattaya Garden','U-Tapao International Airport'],
      th: ['โรงเรียนนานาชาติธารปัญญา','ถนนสุขุมวิท','สยามคันทรีคลับ','โรงเรียนนานาชาติไฮเกท','หาดจอมเทียน','โอเชียน มารีน่า ยอชต์คลับ','โรงพยาบาลจอมเทียน','โคลัมเบีย พิคเจอร์ส อควาเวิร์ส','โรงเรียนนานาชาติรักบี้','สวนนงนุชพัทยา','สนามบินนานาชาติอู่ตะเภา'] },
    { sel: '.distance-item span:last-child', all: true,
      en: ['6.9 km','7.1 km','8.1 km','8.6 km','9.3 km','11.2 km','11 km','15 km','14.7 km','17 km','30 km'],
      th: ['6.9 กม.','7.1 กม.','8.1 กม.','8.6 กม.','9.3 กม.','11.2 กม.','11 กม.','15 กม.','14.7 กม.','17 กม.','30 กม.'] },
    { sel: '.map-toggle', all: true, en: ['Google Maps','Graphic Map'], th: ['Google Maps','แผนที่ภาพ'] },
    { sel: '.legend-item span:last-child', all: true,
      en: ['HIGHBURY HILL','Nearby Landmarks'], th: ['HIGHBURY HILL','สถานที่ใกล้เคียง'] },

    /* Footer */
    { sel: '.footer-tagline', en: 'Where Nature Meets Contemporary Luxury', th: 'ที่ซึ่งธรรมชาติบรรจบกับความหรูหราร่วมสมัย' },
    { sel: '.footer-col-title', all: true, en: ['Project','Contact'], th: ['โครงการ','ติดต่อ'] },
    { sel: '.footer-col:first-child a', all: true,
      en: ['Concept','House Types','Location','Atmosphere'],
      th: ['แนวคิด','แบบบ้าน','ทำเล','บรรยากาศ'] },
    { sel: '.footer-bottom p', html: true,
      en: '&copy; 2026 HIGHBURY HILL. All rights reserved.',
      th: '© 2026 HIGHBURY HILL สงวนลิขสิทธิ์' },
    { sel: '.footer-legal a', all: true,
      en: ['Privacy Policy','Terms & Conditions'], th: ['นโยบายความเป็นส่วนตัว','ข้อกำหนดและเงื่อนไข'] },
  ];

  function applyLang(lang) {
    rules.forEach(function (r) {
      const nodes = r.all ? Array.from(document.querySelectorAll(r.sel)) : [document.querySelector(r.sel)];
      nodes.forEach(function (el, i) {
        if (!el) return;
        let v = r[lang];
        if (Array.isArray(v)) v = v[i];
        if (v == null) return;
        if (r.attr) el.setAttribute(r.attr, v);
        else if (r.html) el.innerHTML = v;
        else el.textContent = v;
      });
    });

    /* Location show-more label reflects current expanded state */
    const moreBtn = document.getElementById('locationShowMore');
    if (moreBtn) {
      const lbl = (lang === 'th') ? ['ดูเพิ่มเติม','ดูน้อยลง'] : ['Show More','Show Less'];
      const span = moreBtn.querySelector('span');
      if (span) span.textContent = moreBtn.classList.contains('expanded') ? lbl[1] : lbl[0];
    }

    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    window.HH_LANG = lang;
    try { localStorage.setItem('hh_lang', lang); } catch (e) {}
  }

  /* Wire the TH / EN buttons */
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.dataset.lang); });
  });

  /* Always start in English on every page load (toggle still works in-session) */
  applyLang('en');
})();

/* --- Gallery: two opposing marquee rows (Rekha-style continuous scroll) --- */
window.addEventListener('load', function () {
  if (typeof Swiper === 'undefined') return;

  function makeMarquee(selector, reverse) {
    const el = document.querySelector(selector);
    if (!el) return;

    const sw = new Swiper(selector, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      speed: 9000,                 /* slow, continuous glide (higher = slower) */
      allowTouchMove: true,
      grabCursor: true,
      autoplay: {
        delay: 0,                  /* 0 = never stop → continuous marquee */
        disableOnInteraction: false,
        reverseDirection: reverse, /* bottom row scrolls the opposite way */
        pauseOnMouseEnter: true,
      },
    });

    /* Drag guard so a swipe-release doesn't trigger the lightbox */
    sw.on('sliderFirstMove', () => el.classList.add('swiper-was-dragging'));
    sw.on('touchEnd', () => setTimeout(() => el.classList.remove('swiper-was-dragging'), 50));
  }

  makeMarquee('#galleryRowTop', false);    /* scrolls left  */
  makeMarquee('#galleryRowBottom', true);  /* scrolls right */
});

/* --- Smooth scroll --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   LUXURY PARALLAX ENGINE
   ============================================= */
(function () {
  /* Collect all elements that declare a parallax speed */
  const pxItems = Array.from(document.querySelectorAll('[data-parallax]')).map(el => ({
    el,
    rate: parseFloat(el.dataset.parallax) || 0.1,
  }));

  if (!pxItems.length) return;

  /* Reduce-motion: skip animation for accessibility */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let rafPending = false;

  function applyParallax() {
    const vh = window.innerHeight;
    pxItems.forEach(({ el, rate }) => {
      const rect = el.getBoundingClientRect();
      /* Distance of element centre from viewport centre — 0 = perfectly centred */
      const relCentre = (rect.top + rect.height * 0.5) - vh * 0.5;
      el.style.transform = `translateY(${(relCentre * rate).toFixed(2)}px)`;
    });
    rafPending = false;
  }

  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(applyParallax);
    }
  }, { passive: true });

  window.addEventListener('resize', applyParallax, { passive: true });

  /* Run once on load so initial position is correct */
  applyParallax();
})();

/* =============================================
   GOOGLE MAPS
   ============================================= */

// Brand colors
const COLOR_VENUE   = '#1e3828';  // Brand green — Highbury Hill pin
const COLOR_NEARBY  = '#4a6880';  // Navy blue — surrounding landmarks

// Venue location
const VENUE = {
  coords: { lat: 12.8672, lng: 100.9438 },
  name: 'HIGHBURY HILL Pool Villas Pattaya',
  address: 'Chaiyapruke 2 Road, Banglamung, Chonburi 20150',
  link: 'https://maps.app.goo.gl/Sk322MG9xAeyQH8P6'
};

// Surrounding landmarks from the reference map
const LANDMARKS = [
  { name: 'Tara Pattana International School', distance: '6.9 Km.',  coords: { lat: 12.9076, lng: 100.9189 } },
  { name: 'Sukhumvit Road',                    distance: '7.1 Km.',  coords: { lat: 12.9352, lng: 100.8975 } },
  { name: 'Siam Country Club',                 distance: '8.1 Km.',  coords: { lat: 12.8891, lng: 101.0130 } },
  { name: 'Highgate International School',     distance: '8.6 Km.',  coords: { lat: 12.8783, lng: 100.9836 } },
  { name: 'Jomtien Beach',                     distance: '9.3 Km.',  coords: { lat: 12.9199, lng: 100.8700 } },
  { name: 'Ocean Marina Yacht Club',           distance: '11.2 Km.', coords: { lat: 12.8667, lng: 100.9022 } },
  { name: 'Jomtien Hospital',                  distance: '11 Km.',   coords: { lat: 12.9170, lng: 100.8800 } },
  { name: "Columbia Pictures' Aquaverse",      distance: '15 Km.',   coords: { lat: 12.8570, lng: 100.9100 } },
  { name: 'Rugby International School',        distance: '14.7 Km.', coords: { lat: 12.8590, lng: 101.0200 } },
  { name: 'Nongnooch Pattaya Garden',          distance: '17 Km.',   coords: { lat: 12.8190, lng: 100.9700 } },
  { name: 'U-Tapao Rayong-Pattaya International Airport', distance: '30 Km.', coords: { lat: 12.6790, lng: 101.0050 } },
];

// Custom SVG pin — filled circle with letter
function makePinSvg(color, letter) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="10" fill="rgba(255,255,255,0.2)"/>
      <text x="18" y="23" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#ffffff">${letter}</text>
    </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function initMap() {
  const mapEl = document.getElementById('googleMap');
  if (!mapEl) return;

  const map = new google.maps.Map(mapEl, {
    center: VENUE.coords,
    zoom: 12,
    mapTypeId: 'roadmap',
    styles: [
      { featureType: 'all',        elementType: 'geometry',       stylers: [{ saturation: -20 }] },
      { featureType: 'water',      elementType: 'geometry',       stylers: [{ color: '#c8d8e8' }] },
      { featureType: 'road',       elementType: 'geometry',       stylers: [{ color: '#f0ece5' }] },
      { featureType: 'road.highway', elementType: 'geometry',     stylers: [{ color: '#c8b48a' }] },
      { featureType: 'landscape',  elementType: 'geometry',       stylers: [{ color: '#e8e4dc' }] },
      { featureType: 'poi.park',   elementType: 'geometry',       stylers: [{ color: '#d4e4c8' }] },
      { featureType: 'all',        elementType: 'labels.text.fill', stylers: [{ color: '#2c2c2c' }] },
      { featureType: 'all',        elementType: 'labels.text.stroke', stylers: [{ color: '#f8f5f1' }] },
      { featureType: 'poi',        elementType: 'labels',         stylers: [{ visibility: 'off' }] },
      { featureType: 'transit',    elementType: 'labels',         stylers: [{ visibility: 'off' }] },
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  window._highburiMap = map;
  mapInitialized = true;

  const infoWindow = new google.maps.InfoWindow();

  // --- Venue marker (brand green, larger) ---
  const venueMarker = new google.maps.Marker({
    position: VENUE.coords,
    map,
    title: VENUE.name,
    icon: {
      url: makePinSvg(COLOR_VENUE, 'H'),
      scaledSize: new google.maps.Size(44, 58),
      anchor: new google.maps.Point(22, 58),
    },
    zIndex: 10,
  });

  venueMarker.addListener('click', () => {
    infoWindow.setContent(`
      <div style="font-family:Inter,sans-serif;padding:4px 4px 2px;max-width:220px;">
        <p style="font-weight:600;font-size:13px;color:#1e3828;margin:0 0 4px;">HIGHBURY HILL</p>
        <p style="font-size:12px;color:#5a5a5a;margin:0 0 8px;line-height:1.5;">${VENUE.address}</p>
        <a href="${VENUE.link}" target="_blank"
           style="font-size:11px;color:#1e3828;font-weight:500;letter-spacing:.05em;text-decoration:none;border-bottom:1px solid #1e3828;">
          Open in Google Maps ↗
        </a>
      </div>
    `);
    infoWindow.open(map, venueMarker);
  });

  // --- Landmark markers (navy blue) ---
  LANDMARKS.forEach((place, i) => {
    const marker = new google.maps.Marker({
      position: place.coords,
      map,
      title: place.name,
      icon: {
        url: makePinSvg(COLOR_NEARBY, String(i + 1)),
        scaledSize: new google.maps.Size(32, 42),
        anchor: new google.maps.Point(16, 42),
      },
      zIndex: 5,
    });

    marker.addListener('click', () => {
      infoWindow.setContent(`
        <div style="font-family:Inter,sans-serif;padding:4px 4px 2px;max-width:200px;">
          <p style="font-weight:600;font-size:13px;color:#4a6880;margin:0 0 4px;">${place.name}</p>
          <p style="font-size:12px;color:#5a5a5a;margin:0;">from HIGHBURY HILL: <strong>${place.distance}</strong></p>
        </div>
      `);
      infoWindow.open(map, marker);
    });
  });
}

// Expose initMap globally for the Google Maps callback
window.initMap = initMap;

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

/* --- Registration form --- */
const form = document.getElementById('registerForm');
const formSuccess = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  form.style.display = 'none';
  formSuccess.classList.add('show');
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
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

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
const locationShowMoreBtn = document.getElementById('locationShowMore');
if (locationShowMoreBtn) {
  locationShowMoreBtn.addEventListener('click', () => {
    const hidden = document.querySelectorAll('.distance-hidden');
    const isExpanded = locationShowMoreBtn.classList.contains('expanded');
    hidden.forEach(el => { el.style.display = isExpanded ? '' : 'flex'; });
    locationShowMoreBtn.classList.toggle('expanded', !isExpanded);
    locationShowMoreBtn.querySelector('span').textContent = isExpanded ? 'Show More' : 'Show Less';
  });
}

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

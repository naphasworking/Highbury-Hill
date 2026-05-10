/* =============================================
   HIGHBURY HILL — Interactions + Google Maps
   ============================================= */

/* --- YouTube hero video: inject iframe after page load (performance facade) --- */
window.addEventListener('load', function () {
  var wrap = document.getElementById('heroVideoWrap');
  var poster = document.getElementById('heroVideoPoster');
  if (!wrap) return;

  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/SEbjs0Vo6uQ?autoplay=1&mute=1&loop=1&playlist=SEbjs0Vo6uQ&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('tabindex', '-1');
  iframe.setAttribute('title', '');
  wrap.appendChild(iframe);

  // Fade the poster out once the video has had time to buffer and start
  setTimeout(function () {
    if (poster) {
      poster.style.opacity = '0';
      setTimeout(function () { if (poster.parentNode) poster.parentNode.removeChild(poster); }, 1200);
    }
  }, 3000);
});

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

/* --- Unit type tabs --- */
const unitTabs = document.querySelectorAll('.unit-tab');
const unitPanels = document.querySelectorAll('.unit-panel');

unitTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    unitTabs.forEach(t => t.classList.remove('active'));
    unitPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});

/* --- Lifestyle photo thumbnail switcher --- */
document.querySelectorAll('.unit-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const mainId = thumb.dataset.main;
    const mainImg = document.getElementById(mainId);
    if (!mainImg) return;

    // Update active thumb within same group
    const siblings = document.querySelectorAll(`[data-main="${mainId}"]`);
    siblings.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // Swap main image with fade
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = thumb.src;
      mainImg.style.opacity = '1';
    }, 200);
  });
});

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

/* --- Scroll fade-in animation --- */
const fadeEls = document.querySelectorAll(
  '.concept-grid, .fact-item, .amenity-item, .unit-grid, .location-grid, .gallery-item, .register-grid'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
fadeEls.forEach(el => observer.observe(el));

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

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let lbImages = [];
let lbIdx = 0;

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => {
    lbImages = galleryItems.map(gi => {
      const img = gi.querySelector('img');
      return { src: img.src, alt: img.alt };
    });
    openLightbox(idx);
  });
});

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

/* Gallery Show More (mobile) */
const galleryShowMoreWrap = document.getElementById('galleryShowMoreWrap');
const galleryShowMoreBtn  = document.getElementById('galleryShowMore');
if (galleryShowMoreBtn) {
  galleryShowMoreBtn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-hidden-mobile').forEach(el => {
      el.classList.remove('gallery-hidden-mobile');
    });
    galleryShowMoreWrap.style.display = 'none';
    /* Rebuild lbImages to include newly visible items */
    lbImages = Array.from(document.querySelectorAll('.gallery-item')).map(gi => {
      const img = gi.querySelector('img');
      return { src: img.src, alt: img.alt };
    });
  });
}

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

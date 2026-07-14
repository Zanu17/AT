/* =========================================================
   AutoTribe — app.js
   1:1 port of main.ts + shared.ts + booking.ts + gallery.ts
   ========================================================= */

'use strict';

// ─── TELEGRAM CONFIG ──────────────────────────────────────────────────────────
// Replace these with your real bot token and chat ID.
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID   = 'YOUR_TELEGRAM_CHAT_ID';

// ─── LOGO ANIMATION CONFIG ────────────────────────────────────────────────────
const GIF_LOGO = 'gif/logo-transform.gif';
const END_LOGO = 'img/AT_logo.png';
const ANIMATION_DURATION = 3500;

let logoState = 'start'; // 'start' | 'animating' | 'end'
let logoTimeout;

// Preload
const preloadGif = new Image(); preloadGif.src = GIF_LOGO;
const preloadEnd = new Image(); preloadEnd.src = END_LOGO;

// ─── SCROLL REVEAL (IntersectionObserver) ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

// ─── COUNTER ANIMATION ────────────────────────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count || '0');
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          if (target >= 1000) el.textContent = (target / 1000).toFixed(0) + 'K+';
          else if (target === 99) el.textContent = target + '%';
          else el.textContent = target + '+';
          clearInterval(timer);
        } else {
          const floored = Math.floor(current);
          el.textContent = floored >= 1000 ? Math.floor(floored / 1000) + 'K+' : floored + '+';
        }
      }, 20);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
window.showToast = function(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => window.closeToast(), 5000);
  }
};

window.closeToast = function() {
  const toast = document.getElementById('toast');
  if (toast) toast.classList.remove('active');
};

// ─── NAV SCROLL ───────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  const navLogo = document.getElementById('nav-logo');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Active section highlight
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });

  if (current) {
    navLinks.forEach(a => {
      a.classList.remove('nav-active');
      const href = a.getAttribute('href');
      if (href === '#' + current || href === '/' + current) {
        a.classList.add('nav-active');
      }
    });
  }

  if (!nav) return;

  if (window.scrollY > 50) {
    nav.classList.add('scrolled');

    // Logo transform
    if (navLogo && logoState === 'start') {
      logoState = 'animating';
      if (!navLogo.dataset.startSrc) {
        navLogo.dataset.startSrc = navLogo.getAttribute('src') || '';
      }
      clearTimeout(logoTimeout);
      logoTimeout = setTimeout(() => {
        if (nav.classList.contains('scrolled')) {
          // Restart GIF trick
          navLogo.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
          setTimeout(() => { navLogo.src = GIF_LOGO; }, 10);
          logoTimeout = setTimeout(() => {
            if (logoState === 'animating') {
              navLogo.src = END_LOGO;
              logoState = 'end';
            }
          }, ANIMATION_DURATION);
        } else {
          logoState = 'start';
        }
      }, 500);
    }
  } else {
    nav.classList.remove('scrolled');
    if (navLogo && logoState !== 'start') {
      logoState = 'start';
      clearTimeout(logoTimeout);
      if (navLogo.dataset.startSrc) {
        navLogo.src = navLogo.dataset.startSrc;
      }
    }
  }
});

// ─── PAGE FADE TRANSITIONS ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('fade-out');
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) document.body.classList.remove('fade-out');
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
  e.preventDefault();
  document.body.classList.add('fade-out');
  setTimeout(() => { window.location.href = href; }, 400);
});

// ─── HERO VIDEO ───────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.playbackRate = 0.85;
    const attemptPlay = () => heroVideo.play().catch(() => {});
    attemptPlay();
    ['touchstart', 'mousedown', 'scroll'].forEach(ev =>
      document.addEventListener(ev, attemptPlay, { once: true })
    );
  }
});

// ─── HOME PAGE GALLERY SLIDER ─────────────────────────────────────────────────
const homeGalleryImages = [
  { src: 'img/gallery/optimized/gal_performance.webp', label: 'Performance Build' },
  { src: 'img/gallery/optimized/gal_engine.webp', label: 'Engine Overhaul' },
  { src: 'img/gallery/optimized/ceramic_coating.webp', label: 'Ceramic Protection' },
  { src: 'img/gallery/optimized/gal_carbon_fiber_1.webp', label: 'Carbon Fiber Install' },
  { src: 'img/gallery/optimized/gal_custom_paint_1.webp', label: 'Custom Paint' },
  { src: 'img/gallery/optimized/gal_detailing_1.webp', label: 'Interior Detailing' },
  { src: 'img/gallery/optimized/gal_dyno_1.webp', label: 'Dyno Tuning' },
  { src: 'img/gallery/optimized/gal_lighting_upgrade_1.webp', label: 'Custom Lighting' },
  { src: 'img/gallery/optimized/gal_wrapping_1.webp', label: 'Vinyl Wrap' },
  { src: 'img/gallery/optimized/brake_service.webp', label: 'Brake Upgrade' },
  { src: 'img/gallery/optimized/suspension_upgrade.webp', label: 'Air Suspension' },
  { src: 'img/gallery/optimized/ac_service.webp', label: 'AC Service' },
  { src: 'img/gallery/optimized/wheel_alignment.webp', label: 'Wheel Alignment' },
  { src: 'img/gallery/optimized/transmission_repair.webp', label: 'Major Restoration' }
];

let currentSlide = 0;
let autoSlideTimer;

function initHomeGallery() {
  const slider = document.getElementById('gallerySlider');
  if (!slider) return;

  slider.innerHTML = homeGalleryImages.map(img => `
    <div class="gal-item" onclick="openLightboxSrc('${img.src}')">
      <img src="${img.src}" alt="${img.label}" class="gal-bg" loading="lazy">
      <div class="gal-overlay"></div>
      <span class="gal-label">${img.label}</span>
    </div>
  `).join('');

  updateSlider();
  startAutoSlide();
}

function updateSlider() {
  const slider = document.getElementById('gallerySlider');
  if (!slider) return;
  const itemsPerView = window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1);
  const maxSlide = homeGalleryImages.length - itemsPerView;
  if (currentSlide > maxSlide) currentSlide = 0;
  if (currentSlide < 0) currentSlide = maxSlide;
  const offset = currentSlide * (100 / itemsPerView);
  slider.style.transform = `translateX(-${offset}%)`;
}

window.nextSlide = function() { currentSlide++; updateSlider(); resetAutoSlide(); };
window.prevSlide = function() { currentSlide--; updateSlider(); resetAutoSlide(); };

function startAutoSlide() {
  autoSlideTimer = setInterval(() => { currentSlide++; updateSlider(); }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

window.addEventListener('resize', updateSlider);

// Simple lightbox for home page slider (src-based)
window.openLightboxSrc = function(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (img) img.src = src;
  if (lb) lb.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// ─── FULL GALLERY PAGE (gallery.html) ─────────────────────────────────────────
const fullGalleryImages = [
  { src: 'img/gallery/optimized/gal_performance.webp', label: 'Performance Build', category: 'engine' },
  { src: 'img/gallery/optimized/gal_engine.webp', label: 'Engine Overhaul', category: 'engine' },
  { src: 'img/gallery/optimized/ceramic_coating.webp', label: 'Ceramic Protection', category: 'styling' },
  { src: 'img/gallery/optimized/gal_carbon_fiber_1.webp', label: 'Carbon Fiber Install', category: 'styling' },
  { src: 'img/gallery/optimized/gal_custom_paint_1.webp', label: 'Custom Paint', category: 'styling' },
  { src: 'img/gallery/optimized/gal_detailing_1.webp', label: 'Interior Detailing', category: 'maintenance' },
  { src: 'img/gallery/optimized/gal_dyno_1.webp', label: 'Dyno Tuning', category: 'engine' },
  { src: 'img/gallery/optimized/gal_lighting_upgrade_1.webp', label: 'Custom Lighting', category: 'styling' },
  { src: 'img/gallery/optimized/gal_wrapping_1.webp', label: 'Vinyl Wrap', category: 'styling' },
  { src: 'img/gallery/optimized/brake_service.webp', label: 'Brake Upgrade', category: 'maintenance' },
  { src: 'img/gallery/optimized/suspension_upgrade.webp', label: 'Air Suspension', category: 'engine' },
  { src: 'img/gallery/optimized/ac_service.webp', label: 'AC Service', category: 'maintenance' },
  { src: 'img/gallery/optimized/wheel_alignment.webp', label: 'Wheel Alignment', category: 'maintenance' },
  { src: 'img/gallery/optimized/transmission_repair.webp', label: 'Major Restoration', category: 'engine' }
];

let currentLightboxIndex = 0;
let currentFilteredImages = [...fullGalleryImages];
let lbScale = 1;

function renderFullGallery(images) {
  const grid = document.getElementById('fullGalleryGrid');
  if (!grid) return;
  grid.innerHTML = images.map((img, idx) => `
    <div class="gal-item" onclick="openLightbox(${idx})" style="flex: auto; aspect-ratio: 4/5;">
      <img src="${img.src}" alt="${img.label}" class="gal-bg" loading="lazy">
      <div class="gal-overlay"></div>
      <span class="gal-label">${img.label}</span>
    </div>
  `).join('');
}

// Filter buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter;
      currentFilteredImages = filter === 'all'
        ? [...fullGalleryImages]
        : fullGalleryImages.filter(img => img.category === filter);
      renderFullGallery(currentFilteredImages);
    });
  });

  // Render full gallery if on that page
  if (document.getElementById('fullGalleryGrid')) {
    renderFullGallery(currentFilteredImages);
  }
});

// Lightbox (indexed — gallery.html)
window.openLightbox = function(idx) {
  currentLightboxIndex = typeof idx === 'number' ? idx : 0;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (img) {
    img.src = currentFilteredImages[currentLightboxIndex].src;
    lbScale = 1;
    img.style.transform = `scale(${lbScale})`;
  }
  if (lb) lb.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = 'auto';
};

window.nextLightbox = function(event) {
  if (event) event.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredImages.length;
  window.openLightbox(currentLightboxIndex);
};

window.prevLightbox = function(event) {
  if (event) event.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredImages.length) % currentFilteredImages.length;
  window.openLightbox(currentLightboxIndex);
};

// Keyboard nav
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (lb && lb.classList.contains('active')) {
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowRight') window.nextLightbox(e);
    if (e.key === 'ArrowLeft') window.prevLightbox(e);
  }
});

// Zoom on lightbox image
document.addEventListener('DOMContentLoaded', () => {
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg) {
    lightboxImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      lbScale += e.deltaY * -0.01;
      lbScale = Math.min(Math.max(1, lbScale), 4);
      lightboxImg.style.transform = `scale(${lbScale})`;
    });

    let initialDistance = null;
    lightboxImg.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      }
    });
    lightboxImg.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialDistance !== null) {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        lbScale += (dist - initialDistance) * 0.01;
        lbScale = Math.min(Math.max(1, lbScale), 4);
        lightboxImg.style.transform = `scale(${lbScale})`;
        initialDistance = dist;
      }
    });
  }
});

// ─── BOOKING LOGIC ────────────────────────────────────────────────────────────
// Supports booking.html (ids: book-*) and contact.html (ids: contact-book-*)
function setupBookingForm(prefix) {
  const dateInput = document.getElementById(prefix + 'date');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  // URL param pre-fill (booking.html only)
  if (prefix === 'book-') {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const serviceSelect = document.getElementById('book-service');
      if (serviceSelect) {
        const opt = Array.from(serviceSelect.options).find(o => o.value === serviceParam || o.text === serviceParam);
        if (opt) serviceSelect.value = opt.value;
      }
    }
  }

  const submitBtn = document.getElementById((prefix === 'book-' ? 'submit-booking' : 'contact-submit-booking'));
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => handleBooking(e, prefix));
  }
}

async function handleBooking(event, prefix = 'book-') {
  event.preventDefault();
  const btn = event.currentTarget;

  const get = (id) => {
    const el = document.getElementById(prefix + id);
    return el ? el.value : '';
  };

  const name    = get('name');
  const phone   = get('phone');
  const email   = get('email');
  const vehicle = get('vehicle');
  const service = get('service');
  const date    = get('date');
  const time    = get('time');
  const notes   = get('notes');

  if (!name || !phone || !email || !vehicle || !date || !time || time === 'Select Time') {
    window.showToast('Please fill in all required fields (Name, Phone, Email, Vehicle, Date, and Time).');
    return;
  }

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    window.showToast('Please enter a valid phone number.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    window.showToast('Please enter a valid email address.');
    return;
  }

  const selectedDateTime = new Date(`${date} ${time.split(' – ')[0]}`);
  if (selectedDateTime < new Date()) {
    window.showToast('Please select a future date and time for your appointment.');
    return;
  }

  btn.textContent = 'SENDING...';
  btn.style.opacity = '0.7';

  const message = `<b>🚗 New AutoTribe Booking 🚗</b>
------------------------------
<b>👤 Name:</b> ${name}
<b>📞 Phone:</b> ${phone}
<b>📧 Email:</b> ${email}
<b>🚘 Vehicle:</b> ${vehicle}
<b>🛠️ Service:</b> ${service}
<b>📅 Date:</b> ${date}
<b>⏰ Time:</b> ${time}
<b>📝 Notes:</b> ${notes}`;

  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes('YOUR_TELEGRAM')) {
    window.showToast('Telegram bot is not configured. Please update app.js with your bot token and chat ID.');
    btn.textContent = 'CONFIRM BOOKING →';
    btn.style.opacity = '1';
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
    });

    if (response.ok) {
      btn.textContent = '✅ BOOKING CONFIRMED!';
      btn.style.background = '#1a8a3a';
      btn.style.opacity = '1';
      // Clear fields
      ['name','phone','email','vehicle','notes','date'].forEach(id => {
        const el = document.getElementById(prefix + id);
        if (el) el.value = '';
      });
      ['service','time'].forEach(id => {
        const el = document.getElementById(prefix + id);
        if (el) el.selectedIndex = 0;
      });
      setTimeout(() => { btn.textContent = 'CONFIRM BOOKING →'; btn.style.background = ''; }, 5000);
    } else {
      throw new Error('API error');
    }
  } catch (err) {
    console.error('Booking error:', err);
    btn.textContent = '❌ ERROR! TRY AGAIN';
    btn.style.background = 'var(--red)';
    btn.style.opacity = '1';
    setTimeout(() => { btn.textContent = 'CONFIRM BOOKING →'; btn.style.background = ''; }, 3000);
  }
}

// ─── DOMContentLoaded INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Counter animation
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // Home page slider
  initHomeGallery();

  // Booking forms
  setupBookingForm('book-');         // booking.html
  setupBookingForm('contact-book-'); // contact.html
});

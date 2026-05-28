/* =============================================
   GISBEL — Modern JS: Scroll, Reveal, Counter
   ============================================= */

// ===========================
// HEADER — SCROLL EFFECT
// ===========================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===========================
// MOBILE MENU TOGGLE
// ===========================
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const updateActiveNav = () => {
  const scrollPos = window.scrollY + 130;
  sections.forEach(section => {
    const id     = section.getAttribute('id');
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
};

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); // run on load

// ===========================
// SCROLL REVEAL
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger siblings that share the same grid/flex parent
  const parent   = el.parentElement;
  const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
  const index    = siblings.indexOf(el);
  el.dataset.delay = index * 85;
  revealObserver.observe(el);
});

// ===========================
// COUNTER ANIMATION
// ===========================
const animateCounter = (el) => {
  const target   = parseInt(el.dataset.count);
  const duration = 1800;
  const start    = performance.now();

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ===========================
// CHART BAR ANIMATION DELAY
// ===========================
document.querySelectorAll('.chart-bar').forEach((bar, i) => {
  bar.style.animationDelay = `${i * 0.08}s`;
});
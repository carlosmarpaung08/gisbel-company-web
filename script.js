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
const navContainer = navLinks.parentElement; // original parent (nav-container)

// Create backdrop overlay
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
document.body.appendChild(backdrop);

// Create close button inside the drawer
const drawerClose = document.createElement('button');
drawerClose.className = 'drawer-close';
drawerClose.setAttribute('aria-label', 'Close menu');
drawerClose.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
navLinks.insertBefore(drawerClose, navLinks.firstChild);

// Move nav-links to body on mobile so it escapes header's stacking context
const mobileBreakpoint = 968;
let isMovedToBody = false;

const moveNavForMobile = () => {
  const isMobile = window.innerWidth <= mobileBreakpoint;
  if (isMobile && !isMovedToBody) {
    document.body.appendChild(navLinks);
    isMovedToBody = true;
  } else if (!isMobile && isMovedToBody) {
    // Move back to original position (before .nav-cta)
    const navCta = navContainer.querySelector('.nav-cta');
    if (navCta) {
      navContainer.insertBefore(navLinks, navCta);
    } else {
      navContainer.appendChild(navLinks);
    }
    isMovedToBody = false;
    closeMenu();
  }
};

moveNavForMobile();
window.addEventListener('resize', moveNavForMobile);

const openMenu = () => {
  navLinks.classList.add('active');
  menuToggle.classList.add('active');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
  navLinks.classList.remove('active');
  menuToggle.classList.remove('active');
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
};

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (navLinks.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close on backdrop click
backdrop.addEventListener('click', closeMenu);

// Close on drawer close button click
drawerClose.addEventListener('click', closeMenu);

// Close on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && !backdrop.contains(e.target)) {
    closeMenu();
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
// UX Enhancements for AI Resume Screener
// Handles tilt effects, scroll animations, and industry pill interactions

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    initTiltEffect();
    initScrollReveal();
    initIndustryPills();
    initFaqHelpers();
    // initHeroParallax(); // DISABLED: Static hero only
  });

  // Tilt effect for preview card
  function initTiltEffect() {
    if (prefersReducedMotion) return;

    const tiltElement = document.querySelector('.preview-tilt');
    if (!tiltElement) return;

    tiltElement.addEventListener('mousemove', handleTilt);
    tiltElement.addEventListener('mouseleave', resetTilt);
  }

  function handleTilt(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const rotateX = Math.max(-6, Math.min(6, deltaY * -6));
    const rotateY = Math.max(-6, Math.min(6, deltaX * 6));

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function resetTilt(e) {
    const element = e.currentTarget;
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }

  // Scroll reveal animation
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // If reduced motion is preferred, show all elements immediately
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => el.classList.add('reveal-in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
  }

  // Industry pill interactions
  function initIndustryPills() {
    const pills = document.querySelectorAll('.industry-pill');
    const previews = document.querySelectorAll('.industry-preview');

    pills.forEach(pill => {
      pill.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');

        // Remove active class from all pills
        pills.forEach(p => p.classList.remove('active'));

        // Add active class to clicked pill
        this.classList.add('active');

        // Hide all previews
        previews.forEach(preview => preview.classList.add('d-none'));

        // Show target preview
        const targetPreview = document.querySelector(targetId);
        if (targetPreview) {
          targetPreview.classList.remove('d-none');
        }
      });
    });
  }

  // Smooth scrolling for anchor links
  document.addEventListener('click', function (e) {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });

  // Add loading state to buttons (exclude review form buttons)
  document.addEventListener('click', function (e) {
    if (e.target.matches('.btn-brand, .btn-primary') && !e.target.closest('#reviewForm')) {
      const button = e.target;
      const originalText = button.textContent;

      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';

      // Re-enable after 2 seconds (adjust as needed)
      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
      }, 2000);
    }
  });

  // Add focus management for better accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
  });

  // Add keyboard navigation styles
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-navigation *:focus {
      outline: 2px solid var(--brand);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);

})();

// ===== FAQ: open class & auto-scroll =====
function initFaqHelpers() {
  const acc = document.getElementById('faqAcc');
  if (!acc) return;

  acc.querySelectorAll('.accordion-collapse').forEach(col => {
    col.addEventListener('show.bs.collapse', () => {
      col.closest('.faq-item')?.classList.add('open');
      setTimeout(() => col.closest('.faq-item')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    });
    col.addEventListener('hide.bs.collapse', () => {
      col.closest('.faq-item')?.classList.remove('open');
    });
  });
}

// Premium Hero Parallax & 3D Tilt Effect
/*
function initHeroParallax() {
  if (prefersReducedMotion) return;

  // Check if we're on mobile/touch device (disable parallax on small screens and touch devices)
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isMobile || isTouchDevice) return;

  const hero = document.querySelector('.hero-visual');
  const heroCard = document.querySelector('.hero-mockup');
  const floatCards = document.querySelectorAll('.float-card');

  if (!hero || !heroCard) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let targetCardX = 0;
  let targetCardY = 0;
  let targetChipX = 0;
  let targetChipY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let currentCardX = 0;
  let currentCardY = 0;
  let currentChipX = 0;
  let currentChipY = 0;
  let rafId = null;

  // Throttle mouse move events
  let lastMoveTime = 0;
  const throttleDelay = 16; // ~60fps

  function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastMoveTime < throttleDelay) return;
    lastMoveTime = now;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate normalized position (-1 to 1)
    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;

    // Target values for smooth interpolation
    // 3D Tilt: max 5.6 degrees (reduced by 20% from 7)
    targetX = normalizedX * 5.6;
    targetY = normalizedY * -5.6; // Inverted for natural feel

    // Card parallax: max 6.4px movement (reduced by 20% from 8)
    targetCardX = normalizedX * 6.4;
    targetCardY = normalizedY * 6.4;

    // Chip parallax: max 9.6px movement (reduced by 20% from 12)
    targetChipX = normalizedX * -9.6; // Inverted for depth effect
    targetChipY = normalizedY * -9.6;
  }

  function animate() {
    // Smooth interpolation (easing)
    const ease = 0.15;
    currentTiltX += (targetX - currentTiltX) * ease;
    currentTiltY += (targetY - currentTiltY) * ease;
    currentCardX += (targetCardX - currentCardX) * ease;
    currentCardY += (targetCardY - currentCardY) * ease;
    currentChipX += (targetChipX - currentChipX) * ease;
    currentChipY += (targetChipY - currentChipY) * ease;

    // Apply 3D tilt to hero container
    hero.style.transform = `perspective(1000px) rotateX(${currentTiltY}deg) rotateY(${currentTiltX}deg)`;

    // Apply parallax to card
    heroCard.style.transform = `translate3d(${currentCardX}px, ${currentCardY}px, 0)`;

    // Apply parallax to floating chips (inverted for depth)
    floatCards.forEach((chip) => {
      chip.style.transform = `translate3d(${currentChipX}px, ${currentChipY}px, 0)`;
    });

    // Continue animation if mouse is over hero
    if (Math.abs(targetX) > 0.01 || Math.abs(targetY) > 0.01) {
      rafId = requestAnimationFrame(animate);
    }
  }

  function handleMouseEnter() {
    if (rafId) return; // Already animating
    rafId = requestAnimationFrame(animate);
  }

  function handleMouseLeave() {
    // Smoothly reset to center
    targetX = 0;
    targetY = 0;
    targetCardX = 0;
    targetCardY = 0;
    targetChipX = 0;
    targetChipY = 0;

    // Continue animation until reset
    function reset() {
      const ease = 0.1;
      currentTiltX += (0 - currentTiltX) * ease;
      currentTiltY += (0 - currentTiltY) * ease;
      currentCardX += (0 - currentCardX) * ease;
      currentCardY += (0 - currentCardY) * ease;
      currentChipX += (0 - currentChipX) * ease;
      currentChipY += (0 - currentChipY) * ease;

      hero.style.transform = `perspective(1000px) rotateX(${currentTiltY}deg) rotateY(${currentTiltX}deg)`;
      hero.style.setProperty('--parallax-x', `${currentCardX}px`);
      hero.style.setProperty('--parallax-y', `${currentCardY}px`);
      heroCard.style.transform = `translate3d(${currentCardX}px, ${currentCardY}px, 0)`;
      floatCards.forEach((chip) => {
        chip.style.setProperty('--chip-parallax-x', `${currentChipX}px`);
        chip.style.setProperty('--chip-parallax-y', `${currentChipY}px`);
        chip.style.transform = `translate3d(${currentChipX}px, ${currentChipY}px, 0)`;
      });

      if (Math.abs(currentTiltX) > 0.01 || Math.abs(currentTiltY) > 0.01 ||
        Math.abs(currentCardX) > 0.01 || Math.abs(currentCardY) > 0.01 ||
        Math.abs(currentChipX) > 0.01 || Math.abs(currentChipY) > 0.01) {
        rafId = requestAnimationFrame(reset);
      } else {
        // Fully reset - clear transforms to allow CSS animations to resume
        hero.style.transform = '';
        heroCard.style.transform = '';
        floatCards.forEach((chip) => {
          chip.style.transform = '';
          chip.style.removeProperty('--chip-parallax-x');
          chip.style.removeProperty('--chip-parallax-y');
        });
        hero.style.removeProperty('--parallax-x');
        hero.style.removeProperty('--parallax-y');
        rafId = null;
      }
    }

    if (!rafId) {
      rafId = requestAnimationFrame(reset);
    }
  }

  // Event listeners
  hero.addEventListener('mousemove', handleMouseMove);
  hero.addEventListener('mouseenter', handleMouseEnter);
  hero.addEventListener('mouseleave', handleMouseLeave);
}
*/

// Hero flipper: enlarge + auto flip every 2s
document.addEventListener('DOMContentLoaded', () => {
  const flip = document.getElementById('heroFlip');
  if (!flip) return;

  const INTERVAL = 2000; // 2 seconds
  let on = false;
  let timerId = null;

  const tick = () => {
    on = !on;
    flip.classList.toggle('is-flipped', on);
  };

  const start = () => { stop(); timerId = setInterval(tick, INTERVAL); };
  const stop = () => { if (timerId) { clearInterval(timerId); timerId = null; } };

  // start
  start();

  // pause on hover
  flip.addEventListener('mouseenter', stop);
  flip.addEventListener('mouseleave', start);

  // pause when offscreen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => en.isIntersecting ? start() : stop());
    }, { threshold: 0.05 });
    io.observe(flip);
  }
});

// Resume Examples: role switching with graceful image load/fallback
(() => {
  const stack = document.getElementById('examplesRoles');
  const img = document.getElementById('examplesPreview');
  if (!stack || !img) return;

  const base = stack.dataset.base || '';
  const dflt = stack.dataset.default || 'long_resume';
  const ext = (stack.dataset.ext || 'png').replace('.', '');

  const setActive = (btn) => {
    stack.querySelectorAll('.role-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  const loadWithFallback = (name) => {
    const try1 = `${base}${name}.${ext}`;
    const try2 = `${base}${name}.${ext === 'png' ? 'jpg' : 'png'}`;

    img.style.opacity = 0;
    const probe = new Image();
    probe.onload = () => { img.src = probe.src; img.style.opacity = 1; };
    probe.onerror = () => {
      const probe2 = new Image();
      probe2.onload = () => { img.src = probe2.src; img.style.opacity = 1; };
      probe2.onerror = () => { img.src = `${base}${dflt}.${ext}`; img.style.opacity = 1; };
      probe2.src = try2;
    };
    probe.src = try1;
  };

  // Initial ensure
  loadWithFallback(dflt);

  stack.querySelectorAll('.role-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setActive(btn);
      const name = btn.dataset.img || dflt;
      loadWithFallback(name);
    });
  });
})();

// Templates rail: auto-scroll right->left every 2s
(() => {
  const track = document.getElementById('templatesTrack');
  if (!track) return;

  const INTERVAL = parseInt(track.dataset.interval || '2000', 10); // 2s
  let index = 0;
  let timerId = null;

  // Count original slides (first half). We duplicated once in HTML.
  const slides = track.querySelectorAll('.template-card');
  const total = slides.length;
  const original = total / 2;

  // Measure step width = card width + gap
  const getStep = () => {
    const first = track.querySelector('.template-card');
    if (!first) return 0;
    const rect = first.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(track).gap || track.dataset.gap || '28');
    return rect.width + gap;
  };

  let stepX = getStep();
  const setTransform = () => {
    track.style.transform = `translateX(${-index * stepX}px)`;
  };

  const next = () => {
    index++;
    track.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
    setTransform();
  };

  // Loop seamlessly: when we hit clone boundary, jump back without flicker
  track.addEventListener('transitionend', () => {
    if (index >= original) {
      track.style.transition = 'none';
      index = 0;
      setTransform();
      // force reflow before restoring transition
      void track.offsetHeight;
      track.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
    }
    updateDots();
  });

  // Controls
  const prevBtn = document.getElementById('templatesPrev');
  const nextBtn = document.getElementById('templatesNext');
  prevBtn?.addEventListener('click', () => {
    // Jump to clone side if needed for smooth prev
    if (index === 0) {
      track.style.transition = 'none';
      index = original;
      setTransform();
      void track.offsetHeight;
      track.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
    }
    index--;
    setTransform();
  });
  nextBtn?.addEventListener('click', next);

  // Dots
  const dotsWrap = document.getElementById('templatesDots');
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  const updateDots = () => {
    if (!dots.length) return;
    const i = index % original;
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  };

  // Auto-play controls
  const start = () => { stop(); timerId = setInterval(next, INTERVAL); };
  const stop = () => { if (timerId) clearInterval(timerId); timerId = null; };

  // Pause on hover and off-screen
  const viewport = track.closest('.templates-viewport') || track;
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => en.isIntersecting ? start() : stop());
    }, { threshold: 0.1 });
    io.observe(viewport);
  }

  // Handle resize for correct step width
  window.addEventListener('resize', () => { stepX = getStep(); setTransform(); });

  // Kick off
  stepX = getStep();
  setTransform();
  start();
})();

// Fixed header support + back-to-top button
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const toTop = document.getElementById('toTop');

  // 1) Ensure content isn't hidden behind the fixed navbar
  // Dynamic padding removed in favor of CSS 'body { padding-top: 72px }' for no-jump stability.

  // 2) Add solid background and shadow after slight scroll
  const onScroll = () => {
    if (nav) {
      const isScrolled = window.scrollY > 10;
      nav.classList.toggle('nav-scrolled', isScrolled);
      nav.classList.toggle('scrolled', isScrolled);
    }
    if (toTop) toTop.classList.toggle('show', window.scrollY > 400);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 3) Back to top behavior
  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Smooth anchor offset for fixed header (minimal, design-safe)
(() => {
  const nav = document.getElementById('siteNav');
  const pad = () => (nav ? nav.offsetHeight + 8 : 80);
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - pad();
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });
})();

// Auto-scrolling templates belt (rightward, seamless)
(() => {
  const belt = document.getElementById('templatesAutoBelt');
  if (!belt) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PX_PER_SEC = parseFloat(belt.dataset.pxPerSec || '120'); // tune speed

  const setVars = () => {
    // Two copies in the belt => half of scrollWidth equals one loop distance
    const half = belt.scrollWidth / 2;
    belt.style.setProperty('--loop', `${half}px`);
    // duration = distance / speed
    const duration = Math.max(12, Math.min(120, half / PX_PER_SEC));
    belt.style.setProperty('--belt-duration', `${duration}s`);
  };

  // Run after images load (for correct widths)
  const imgs = belt.querySelectorAll('img');
  let loaded = 0;
  const done = () => { loaded++; if (loaded >= imgs.length) setVars(); };
  imgs.forEach(img => img.complete ? done() : img.addEventListener('load', done, { once: true }));

  // Recompute on resize
  window.addEventListener('resize', () => setTimeout(setVars, 100));

  // Respect reduced motion
  if (prefersReduce) {
    belt.style.animation = 'none';
    belt.style.transform = 'translateX(0)';
  }
})();

// ===== Scroll Animations (AOS-like) =====
(() => {
  const els = document.querySelectorAll('.sa,[data-sa-stagger] .sa');
  if (!els.length) return;
  // Set index for stagger containers
  document.querySelectorAll('[data-sa-stagger]').forEach(cont => {
    cont.querySelectorAll('.sa').forEach((child, i) => child.style.setProperty('--i', i));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      const el = en.target;
      if (en.isIntersecting) {
        // Respect custom delay/duration on element
        const delay = el.dataset.saDelay || el.getAttribute('data-sa-delay');
        const dur = el.dataset.saDuration || el.getAttribute('data-sa-duration');
        if (delay) el.style.setProperty('--sa-delay', `${parseInt(delay, 10)}ms`);
        if (dur) el.style.setProperty('--sa-duration', `${parseInt(dur, 10)}ms`);
        el.classList.add('in');
        // default once
        if (el.dataset.saOnce !== 'false') io.unobserve(el);
      } else if (el.dataset.saOnce === 'false') {
        el.classList.remove('in');
      }
    });
  }, { threshold: 0.14 });
  els.forEach(el => io.observe(el));
})();

// ===== Cursor glow + 3D tilt on images =====
(() => {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cursor glow: update CSS vars --x / --y
  const glowEls = document.querySelectorAll('.cursor-anim');
  glowEls.forEach(box => {
    let raf;
    const update = (e) => {
      const rect = box.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        box.style.setProperty('--x', `${x}%`);
        box.style.setProperty('--y', `${y}%`);
      });
    };
    box.addEventListener('mousemove', update);
    box.addEventListener('mouseleave', () => {
      box.style.removeProperty('--x'); box.style.removeProperty('--y');
    });
  });

  // Tilt: rotate based on cursor position
  if (!prefersReduce) {
    const tilts = document.querySelectorAll('.tilt-on-cursor');
    tilts.forEach(el => {
      let raf;
      const MAX = 6; // degrees
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) translateZ(0)`;
        });
      };
      const off = () => { el.classList.add('reset'); el.style.transform = ''; requestAnimationFrame(() => el.classList.remove('reset')); };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', off);
    });
  }

  // Soft 3D tilt cap for .preview-tilt
  const previewTilt = document.querySelector('.preview-tilt');
  if (previewTilt && !prefersReduce) {
    const MAX = 4; // degrees (smaller card → gentler tilt)
    let raf;
    const onMove = (e) => {
      const r = previewTilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        previewTilt.style.transform = `perspective(1000px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) translateZ(0)`;
      });
    };
    const reset = () => { previewTilt.style.transform = 'perspective(1000px)'; };
    previewTilt.addEventListener('mousemove', onMove);
    previewTilt.addEventListener('mouseleave', reset);
    reset();
  }

})();

// ===== Snap scrolling support + Scrolling fixes =====
document.addEventListener('DOMContentLoaded', () => {
  // Keep CSS var for fixed header height in sync
  const nav = document.getElementById('siteNav');
  const setNavVar = () => {
    if (!nav) return;
    const h = nav.offsetHeight;
    document.documentElement.style.setProperty('--navH', `${h}px`);
  };
  setNavVar();
  window.addEventListener('resize', setNavVar);

  // Mark active snap section for optional subtle settle effect
  const snaps = document.querySelectorAll('.snap-section');
  if (snaps.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting && en.intersectionRatio > 0.6) {
          snaps.forEach(s => s.classList.remove('is-active'));
          en.target.classList.add('is-active');
        }
      });
    }, { threshold: [0.6] });
    snaps.forEach(s => io.observe(s));
  }

  // Prevent belts from hijacking vertical scroll (especially on touch)
  const belts = document.querySelectorAll('.resume-belt, #templatesAutoBelt, .templates-viewport, .templates-track');
  belts.forEach(b => {
    // Allow vertical wheel to bubble normally
    b.addEventListener('wheel', (e) => {
      // Only prevent default if horizontal intent is very strong
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal scrolling allowed
      // else: do nothing; let page scroll
    }, { passive: true });

    // On touch, we already set touch-action: pan-y in CSS.
    // If you had custom drag handlers, ensure they only call preventDefault while dragging.
  });
});

// ===== Scroll Down Indicator =====
(() => {
  const btn = document.getElementById('scrollDown');
  if (!btn) return;

  // Determine header height for offset
  const nav = document.getElementById('siteNav');
  const headerH = () => (nav ? nav.offsetHeight : 72);

  // Find next section after the hero (or use data-target)
  const nextSection = () => {
    const explicit = btn.dataset.target && document.querySelector(btn.dataset.target);
    if (explicit) return explicit;
    // auto-detect: nearest section ancestor then next section sibling
    const hero = btn.closest('section');
    let n = hero ? hero.nextElementSibling : null;
    while (n && n.tagName !== 'SECTION') n = n.nextElementSibling;
    return n || document.querySelector('main section, section:nth-of-type(2)');
  };

  const scrollToNext = () => {
    const target = nextSection();
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH() - 6;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Click + keyboard
  btn.addEventListener('click', scrollToNext);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToNext(); }
  });

  // Hide indicator when hero leaves viewport
  const hero = btn.closest('section');
  if (hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => btn.classList.toggle('hide', !en.isIntersecting));
    }, { threshold: 0.2 });
    io.observe(hero);
  }

  // Update offset on resize
  window.addEventListener('resize', () => { /* headerH recalculates on demand */ });
})();

// ===== CSV headers: copy to clipboard =====
(() => {
  const btn = document.getElementById('copyCsvHeaders');
  const code = document.getElementById('csvHeadersText');
  if (!btn || !code) return;

  const getHeaders = () => btn.dataset.headers || code.textContent.trim();

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getHeaders());
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 1200);
    } catch (e) {
      // Fallback
      const t = document.createElement('textarea');
      t.value = getHeaders();
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch { }
      document.body.removeChild(t);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 1200);
    }
  });
})();

// ===== Testimonials auto-scroll =====
(() => {
  const belt = document.getElementById('tBelt');
  if (!belt) return;

  // Two loops in HTML → half width is a full cycle
  const measure = () => {
    const half = belt.scrollWidth / 2;
    belt.style.setProperty('--loop', `${half}px`);
    const pxPerSec = parseFloat(belt.dataset.speed || '75'); // tune speed
    const dur = Math.max(16, Math.min(120, half / pxPerSec));
    belt.style.setProperty('--dur', `${dur}s`);
  };

  const imgs = belt.querySelectorAll('img');
  let loaded = 0;
  const done = () => { if (++loaded >= imgs.length) measure(); };
  imgs.length ? imgs.forEach(im => im.complete ? done() : im.addEventListener('load', done, { once: true })) : measure();

  window.addEventListener('resize', () => setTimeout(measure, 100));

  // Pause when not visible
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => belt.style.animationPlayState = en.isIntersecting ? 'running' : 'paused');
    }, { threshold: 0.1 });
    io.observe(belt);
  }
})();

// ===== Score Checker: verdict + context =====
(() => {
  const btn = document.getElementById('checkScoreBtn');
  const resultsSection = document.getElementById('scoreResults');
  const contextBlock = document.getElementById('contextBlock');
  if (!btn || !resultsSection) return;

  // Elements previously defined in your scoring block:
  const donut = document.getElementById('donut');
  const donutVal = document.getElementById('donutValue');
  const barATS = document.getElementById('barATS');
  const barMatch = document.getElementById('barMatch');
  const barSkills = document.getElementById('barSkills');
  const barRead = document.getElementById('barRead');
  const barStruct = document.getElementById('barStruct');
  const chipsPresent = document.getElementById('chipsPresent');
  const chipsMissing = document.getElementById('chipsMissing');

  // New elements
  const emoji3d = document.getElementById('emoji3d');
  const verdictTextEl = document.querySelector('#verdict .verdict-text');
  const analyzedList = document.getElementById('analyzedList');
  const calcList = document.getElementById('calcList');
  const improveList = document.getElementById('improveList');
  const copyBtn = document.getElementById('copyImprove');

  // Helper methods (must match your earlier scoring function)
  const ringColor = (t) => t >= 80 ? '#22c55e' : t >= 65 ? '#f59e0b' : '#ef4444';
  const verdictText = (t) => {
    if (t >= 85) return { emoji: '😄', mood: 'good', text: 'Excellent fit — ready to apply!' };
    if (t >= 75) return { emoji: '🙂', mood: 'good', text: 'Good — a few quick improvements recommended.' };
    if (t >= 60) return { emoji: '😕', mood: 'bad', text: 'Fair — add metrics and keywords to boost.' };
    return { emoji: '😬', mood: 'bad', text: 'Needs work — fix ATS issues and add impact.' };
  };

  // Wire into the existing click handler if you already have one.
  // If not, here's a simple reference you can call with the computed scores:
  window.renderScoreResults = (scores) => {
    const { total, ats, match, skills, read, struct, present, missing } = scores;

    // Donut + bars + chips
    donut.style.setProperty('--ring', ringColor(total));
    donut.style.background = `conic-gradient(${ringColor(total)} 0% ${total}%, rgba(255,255,255,.10) ${total}% 100%)`;
    donutVal.textContent = total;
    barATS.style.width = `${ats}%`;
    barMatch.style.width = `${match}%`;
    barSkills.style.width = `${skills}%`;
    barRead.style.width = `${read}%`;
    barStruct.style.width = `${struct}%`;

    chipsPresent.innerHTML = present.map(k => `<span class="k-chip k-present">${k}</span>`).join('');
    chipsMissing.innerHTML = missing.map(k => `<span class="k-chip k-missing">${k}</span>`).join('');

    // Emoji verdict (3D good/bad)
    const v = verdictText(total);
    emoji3d.classList.toggle('good', v.mood === 'good');
    emoji3d.classList.toggle('bad', v.mood === 'bad');
    emoji3d.querySelector('.emoji-char').textContent = v.emoji;
    verdictTextEl.textContent = v.text;

    // Context: What we analyzed
    analyzedList.innerHTML = `
  <li>Extracted sections: <em>experience</em>, <em>skills</em>, <em>education</em>, <em>summary</em>.</li>
  <li>Normalized structure (headings, bullets, dates), flagged ATS blockers.</li>
  <li>Detected keywords and compared with typical requirements for your title.</li>
  <li>Estimated readability and signal density (action verbs, metrics).</li>
`;

    // Context: How we calculate your score (example weights)
    calcList.innerHTML = `
  <li><strong>ATS readiness (25%)</strong> — headings, clean formatting, parsable text.</li>
  <li><strong>Match (25%)</strong> — alignment of your content to role keywords.</li>
  <li><strong>Skills (20%)</strong> — coverage of must‑have and relevant tools.</li>
  <li><strong>Readability (15%)</strong> — clarity, concision, action verbs.</li>
  <li><strong>Structure (15%)</strong> — bullet quality, tense consistency, layout.</li>
`;

    // Context: How to improve (prioritized by low subscores)
    const tips = [];
    if (ats < 75) tips.push('Fix ATS blockers: clear section headings, avoid text in images/tables, use standard fonts.');
    if (match < 75) tips.push(`Add missing must‑haves: ${missing.slice(0, 3).join(', ')}.`);
    if (skills < 75) tips.push(`Include relevant tools/skills in a dedicated Skills section (e.g., ${present.slice(0, 3).join(', ')}) and in bullets.`);
    if (read < 75) tips.push('Tighten long sentences; use "Action + result + metric" and remove filler words.');
    if (struct < 75) tips.push('Use consistent bullets and tense; keep 4–6 bullets per role with the most recent role detailed.');
    if (!tips.length) tips.push('Nice work! Consider adding 1–2 quantified wins for extra impact and tailoring to each job post.');

    improveList.innerHTML = tips.map(t => `<li>${t}</li>`).join('');

    // Reveal sections
    resultsSection.classList.remove('d-none');
    contextBlock?.classList.remove('d-none');
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Copy tips
  copyBtn?.addEventListener('click', async () => {
    const text = Array.from(improveList.querySelectorAll('li')).map(li => `• ${li.textContent}`).join('\n');
    try { await navigator.clipboard.writeText(text); copyBtn.textContent = 'Copied!'; setTimeout(() => copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy tips', 1200); }
    catch { /* ignore */ }
  });

  // If you already have a mock scoring click handler, call renderScoreResults(scores) there.
  // Otherwise, hook the button here for a demo:
  const dzInput = document.getElementById('checkerInput');
  const dzList = document.getElementById('checkerFiles');
  const enableBtn = () => { btn.disabled = !(dzInput?.files?.length || dzList?.children?.length); };
  dzInput?.addEventListener('change', enableBtn);
  enableBtn();

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    btn.disabled = true; const prev = btn.textContent; btn.textContent = 'Analyzing…';
    // Demo scores (replace with real endpoint later)
    const rand = (min, max) => Math.floor(min + Math.random() * (max - min));
    const total = rand(55, 96), ats = rand(60, 98), match = rand(total - 8, total + 4), skills = rand(total - 12, total + 2), read = rand(60, 95), struct = rand(60, 95);
    const all = ['SQL', 'Python', 'Tableau', 'A/B Testing', 'ETL', 'dbt', 'Looker', 'AWS', 'Kubernetes', 'Dashboards', 'Excel', 'Power BI'];
    const present = all.sort(() => .5 - Math.random()).slice(0, 5);
    const missing = all.filter(k => !present.includes(k)).slice(0, 4);

    window.renderScoreResults({ total, ats, match, skills, read, struct, present, missing });

    setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 900);
  });
})();

// ===== "New score" restart button =====
(() => {
  const newBtn = document.getElementById('newScoreBtn');
  const fabBtn = document.getElementById('fabNewScore');

  // Elements to reset
  const input = document.getElementById('checkerInput');
  const fileBox = document.getElementById('checkerFiles');
  const drop = document.getElementById('checkerDrop');
  const browse = document.getElementById('checkerBrowse');
  const checkBtn = document.getElementById('checkScoreBtn');

  const results = document.getElementById('scoreResults');
  const context = document.getElementById('contextBlock') || document.getElementById('score-context');

  // Diagram pieces (optional; resetting is cosmetic)
  const donut = document.getElementById('donut');
  const donutVal = document.getElementById('donutValue');
  const bars = ['barATS', 'barMatch', 'barSkills', 'barRead', 'barStruct'].map(id => document.getElementById(id));
  const chipsPresent = document.getElementById('chipsPresent');
  const chipsMissing = document.getElementById('chipsMissing');
  const insightsList = document.getElementById('insightsList');
  const verdictText = document.getElementById('verdictText') || document.querySelector('#verdict .verdict-text');
  const emoji3d = document.getElementById('emoji3d');
  const emojiChar = document.getElementById('emojiChar') || document.querySelector('#emoji3d .emoji-char');

  function resetUI() {
    // Clear file selection and list
    if (input) input.value = '';
    if (fileBox) fileBox.innerHTML = '';
    // Disable scoring until a new file is chosen
    if (checkBtn) checkBtn.disabled = true;

    // Hide results/context
    results?.classList.add('d-none');
    context?.classList.add('d-none');

    // Cosmetic reset of diagram (safe to skip if you like)
    if (donut) { donut.style.background = 'conic-gradient(#22c55e 0% 0%, rgba(255,255,255,.10) 0% 100%)'; }
    if (donutVal) donutVal.textContent = '0';
    bars.forEach(b => { if (b) b.style.width = '0%'; });
    if (chipsPresent) chipsPresent.innerHTML = '';
    if (chipsMissing) chipsMissing.innerHTML = '';
    if (insightsList) insightsList.innerHTML = '';
    if (emoji3d) {
      emoji3d.style.setProperty('--c1', '#22c55e');
      emoji3d.style.setProperty('--c2', '#16a34a');
    }
    if (emojiChar) emojiChar.textContent = '🙂';
    if (verdictText) verdictText.textContent = 'Upload a resume to check score';

    // Scroll back to the upload card and focus browse
    drop?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => browse?.focus({ preventScroll: true }), 400);
  }

  newBtn?.addEventListener('click', resetUI);
  fabBtn?.addEventListener('click', resetUI);
})();

// ===== Animated donut + bars =====
(() => {
  // Easing
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // Animate numeric value
  function animateValue(el, from, to, ms, onFrame) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { onFrame(to); if (el) el.textContent = String(to); return; }
    const t0 = performance.now();
    function frame(now) {
      const p = Math.min((now - t0) / ms, 1);
      const v = Math.round(from + (to - from) * easeOutCubic(p));
      if (el) el.textContent = String(v);
      onFrame(v);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Animate donut (conic-gradient) and number
  window.animateDonut = (donutEl, valueEl, toVal, ms = 1200, ringColor = '#22c55e') => {
    if (!donutEl) return;
    donutEl.style.setProperty('--ring', ringColor);
    animateValue(valueEl, 0, toVal, ms, (v) => {
      const pct = Math.max(0, Math.min(100, v));
      // Update gradient based on v
      donutEl.style.background = `conic-gradient(${ringColor} 0% ${pct}%, rgba(255,255,255,.10) ${pct}% 100%)`;
    });
  };

  // Animate bar width
  window.animateBar = (el, toVal, ms = 900) => {
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.style.width = `${toVal}%`; return; }
    const t0 = performance.now();
    function f(now) {
      const p = Math.min((now - t0) / ms, 1);
      const v = Math.round(easeOutCubic(p) * toVal);
      el.style.width = `${v}%`;
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  };
})();


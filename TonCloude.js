/* ═══════════════════════════════════════════
   TonCloude.js — Animations & Interactivity
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. CUSTOM CURSOR
  ──────────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    }

    // Spotlight effect via CSS variable
    document.documentElement.style.setProperty('--mx', mouseX + 'px');
    document.documentElement.style.setProperty('--my', mouseY + 'px');

    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
      spotlight.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px,
        rgba(0,230,118,0.07) 0%, transparent 60%)`;
    }
  });

  // Smooth ring lerp
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });

  /* ──────────────────────────────────────────
     2. MAGNETIC BUTTONS
  ──────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .btn-tg').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.22;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ──────────────────────────────────────────
     3. SCROLL REVEAL
  ──────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(getComputedStyle(entry.target).transitionDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────────
     4. STICKY NAV ON SCROLL
  ──────────────────────────────────────────── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  }, { passive: true });

  /* ──────────────────────────────────────────
     5. FLOATING PARTICLES
  ──────────────────────────────────────────── */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    const count = 35;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      const size  = Math.random() * 3 + 1;
      const left  = Math.random() * 100;
      const delay = Math.random() * 12;
      const dur   = Math.random() * 10 + 8;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${left}%; bottom: -10px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        opacity: 0;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ──────────────────────────────────────────
     6. COUNTER ANIMATION
  ──────────────────────────────────────────── */
  function animateCounter(el, target, suffix = '', duration = 1800) {
    let startTime = null;
    const startVal = 0;

    function tick(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Trigger counters when hero stats visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-num[data-count]').forEach(el => {
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, suffix);
          });
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: .5 });
    counterObs.observe(heroStats);
  }

  /* ──────────────────────────────────────────
     7. TILT EFFECT ON CARDS
  ──────────────────────────────────────────── */
  document.querySelectorAll('.feature-card, .reward-card, .community-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 6}deg)
        translateY(-4px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ──────────────────────────────────────────
     8. TYPEWRITER EFFECT (badge)
  ──────────────────────────────────────────── */
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const messages = [
      'LIVE ON TELEGRAM · TON ECOSYSTEM',
      'EARN TON EVERY DAY · FREE TO JOIN',
      '15 TON CONTEST PRIZE POOL · JOIN NOW',
    ];
    let mi = 0, ci = 0, deleting = false;

    function type() {
      const current = messages[mi];
      if (!deleting) {
        typeTarget.textContent = current.slice(0, ++ci);
        if (ci === current.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        typeTarget.textContent = current.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          mi = (mi + 1) % messages.length;
        }
      }
      setTimeout(type, deleting ? 30 : 55);
    }
    setTimeout(type, 1000);
  }

  /* ──────────────────────────────────────────
     9. SMOOTH ANCHOR SCROLL
  ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────
     10. RIPPLE ON CTA BUTTONS
  ──────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', e => {
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top:  ${e.clientY - rect.top  - size/2}px;
        background: rgba(255,255,255,.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim .6s ease-out forwards;
        pointer-events: none;
      `;
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ──────────────────────────────────────────
     11. PARALLAX ON HERO ORBS
  ──────────────────────────────────────────── */
  const orb1 = document.querySelector('.hero-orb');
  const orb2 = document.querySelector('.hero-orb-2');

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (orb1) {
      orb1.style.transform = `translate(calc(-50% + ${dx * 18}px), calc(-50% + ${dy * 18}px))`;
    }
    if (orb2) {
      orb2.style.transform = `translate(${dx * -12}px, ${dy * -12}px)`;
    }
  });

  console.log('%c💎 TonCloude loaded', 'color:#00e676;font-family:monospace;font-size:14px;');

})();
/* ============================================================
   BYTECRACK TRAINING INSTITUTE — SCRIPTS
   Design by Ciera Tech Services
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -------- NAVBAR: Scroll Effect -------- */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* -------- NAVBAR: Active Link Highlight -------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const activateLink = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });

  /* -------- HAMBURGER MENU -------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* -------- TESTIMONIALS SLIDER -------- */
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('testimonialDots');
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot-btn' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot-btn');

  const goTo = (n) => {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  };

  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  const startAuto = () => { autoTimer = setInterval(() => goTo(current + 1), 5000); };
  const resetAuto = () => { clearInterval(autoTimer); startAuto(); };
  startAuto();

  /* -------- CONTACT FORM -------- */
/* -------- SUPABASE CONFIG -------- */
const SUPABASE_URL = 'https://zgonsybfzekyvpvxofun.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnb25zeWJmemVreXZwdnhvZnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NDU0MzAsImV4cCI6MjA4OTMyMTQzMH0.OCDJ9LGLuf9M3MFCuQ_3sJQJyu0NQzHpe1D7iEsLDzc';

/* -------- CONTACT FORM -------- */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  const payload = {
    full_name: document.getElementById('name').value,
    email:     document.getElementById('email').value,
    phone:     document.getElementById('phone').value,
    course:    document.getElementById('course').value,
    message:   document.getElementById('message').value,
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Submission failed');

    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    form.reset();
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 5000);

  } catch (error) {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    alert('Something went wrong. Please try again or contact us on WhatsApp.');
    console.error(error);
  }
});

  /* -------- BACK TO TOP -------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -------- SMOOTH SCROLL for CTA buttons -------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -------- INTERSECTION OBSERVER: Fade-in Cards -------- */
  const fadeEls = document.querySelectorAll(
    '.course-card, .feature-item, .trainer-card, .vm-card, .highlight-card'
  );

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  /* -------- HERO: Stagger Title Animation -------- */
  const heroLines = document.querySelectorAll('.hero-title .line');
  heroLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = `opacity .6s ease ${0.2 + i * 0.15}s, transform .6s ease ${0.2 + i * 0.15}s`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 80);
  });

  const heroBadge = document.querySelector('.hero-badge');
  const heroDesc  = document.querySelector('.hero-desc');
  const heroCta   = document.querySelector('.hero-cta');
  const heroStats = document.querySelector('.hero-stats');
  const heroTagline = document.querySelector('.hero-tagline');

  [heroBadge, heroTagline, heroDesc, heroCta, heroStats].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity .5s ease ${0.7 + i * 0.12}s, transform .5s ease ${0.7 + i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });

});

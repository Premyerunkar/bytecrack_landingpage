/* =============================================
   ByteCrack Training Institute — script.js
   ============================================= */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar glass effect
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll-to-top button
  if (scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const mobileNavLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNavLinks.classList.toggle('open');
  document.body.style.overflow = mobileNavLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click (mobile)
mobileNavLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNavLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Code typer animation in Hero ----
const codeLines = [
  `<span class="cm">// Welcome to ByteCrack 🚀</span>`,
  `<span class="kw">class</span> <span class="fn">ByteCrack</span> {`,
  `  <span class="fn">mission</span> = <span class="st">"Build Future Devs"</span>;`,
  `  <span class="fn">courses</span> = [`,
  `    <span class="st">"Core Java"</span>, <span class="st">"SQL"</span>,`,
  `    <span class="st">"Selenium"</span>, <span class="st">"Web Dev"</span>`,
  `  ];`,
  `  <span class="fn">placementRate</span> = <span class="num">95</span>;`,
  `  <span class="fn">enroll</span>() {`,
  `    <span class="kw">return</span> <span class="st">"Your Future Starts Here!"</span>;`,
  `  }`,
  `}`,
];

const codeTyper = document.getElementById('codeTyper');

if (codeTyper) {
  let lineIndex = 0;
  let charIndex = 0;
  let currentHTML = '';
  let currentLineRaw = '';
  let isDeleting = false;
  let pauseCounter = 0;

  function getPlainText(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }

  function typeCode() {
    if (lineIndex >= codeLines.length) {
      // Done — show cursor and restart after pause
      codeTyper.innerHTML = currentHTML + '<span class="code-cursor"></span>';
      setTimeout(() => {
        currentHTML = '';
        lineIndex = 0;
        charIndex = 0;
        codeTyper.innerHTML = '';
        typeCode();
      }, 3500);
      return;
    }

    const currentLine = codeLines[lineIndex];
    const plainText = getPlainText(currentLine);

    if (charIndex <= plainText.length) {
      // Build partial line by revealing plain text chars and then inject full HTML when done
      if (charIndex === plainText.length) {
        // Full line reveal
        const lines = currentHTML + currentLine + '\n';
        currentHTML = lines;
        lineIndex++;
        charIndex = 0;
        codeTyper.innerHTML = currentHTML + '<span class="code-cursor"></span>';
        setTimeout(typeCode, 120);
      } else {
        // Show current partial plain text while typing
        const partialPlain = plainText.substring(0, charIndex + 1);
        codeTyper.innerHTML = currentHTML + partialPlain + '<span class="code-cursor"></span>';
        charIndex++;
        setTimeout(typeCode, 38 + Math.random() * 30);
      }
    }
  }

  // Start typing after slight delay
  setTimeout(typeCode, 1000);
}

// ---- Testimonials Slider ----
const track = document.getElementById('testTrack');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track && dotsContainer) {
  const cards = track.querySelectorAll('.test-card');
  let visibleCards = getVisibleCount();
  let currentIndex = 0;
  let autoSlideInterval;

  function getVisibleCount() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const total = cards.length - visibleCards + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function getCardWidth() {
    if (cards.length === 0) return 0;
    const gap = 28;
    const containerWidth = track.parentElement.offsetWidth;
    return (containerWidth - gap * (visibleCards - 1)) / visibleCards + gap;
  }

  function goTo(index) {
    const maxIndex = cards.length - visibleCards;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  function startAuto() {
    autoSlideInterval = setInterval(() => {
      const maxIndex = cards.length - visibleCards;
      goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }, 4500);
  }

  function resetAuto() {
    clearInterval(autoSlideInterval);
    startAuto();
  }

  // Init
  createDots();
  startAuto();

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const newVisible = getVisibleCount();
    if (newVisible !== visibleCards) {
      visibleCards = newVisible;
      currentIndex = 0;
      createDots();
      goTo(0);
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });
}

// ---- Contact form ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
        formSuccess.classList.remove('show');
      }, 4000);
    }, 1500);
  });
}

// ---- Scroll-reveal animation (Intersection Observer) ----
const revealElements = document.querySelectorAll('.course-card, .feature-item, .trainer-card, .test-card, .vm-card, .contact-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, (entry.target.dataset.delay || 0));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  el.dataset.delay = (i % 4) * 100;
  revealObserver.observe(el);
});

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Stats counter animation ----
function animateCounter(el, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const step = () => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(current) + suffix;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const match = text.match(/(\d+)([^\d]*)/);
      if (match) {
        animateCounter(el, parseInt(match[1]), match[2]);
      }
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

console.log('%cBytecrack Training Institute 🚀', 'color: #1e6fff; font-size: 16px; font-weight: bold;');
console.log('%cBuilding Future Tech Professionals', 'color: #00cfff; font-size: 12px;');

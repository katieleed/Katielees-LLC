document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

const navDropdown = document.querySelector('.nav-dropdown');
const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');

navDropdownToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = navDropdown.classList.toggle('open');
  navDropdownToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (!navDropdown.contains(event.target)) {
    navDropdown.classList.remove('open');
    navDropdownToggle.setAttribute('aria-expanded', 'false');
  }
});

navDropdown.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navDropdown.classList.remove('open');
    navDropdownToggle.setAttribute('aria-expanded', 'false');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroHeadline = document.getElementById('hero-headline');
if (heroHeadline && !prefersReducedMotion) {
  const fullText = heroHeadline.textContent;
  heroHeadline.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  heroHeadline.appendChild(cursor);

  let charIndex = 0;
  function typeNextChar() {
    if (charIndex < fullText.length) {
      cursor.insertAdjacentText('beforebegin', fullText[charIndex]);
      charIndex++;
      setTimeout(typeNextChar, 22);
    } else {
      setTimeout(() => cursor.remove(), 1200);
    }
  }
  typeNextChar();
}

const servicesStageWrap = document.querySelector('.services-stage-wrap');
const serviceCards = servicesStageWrap ? [...servicesStageWrap.querySelectorAll('.card')] : [];

if (servicesStageWrap && serviceCards.length) {
  if (prefersReducedMotion) {
    serviceCards.forEach((card) => card.classList.add('revealed'));
  } else {
    let ticking = false;
    function updateServicesReveal() {
      const rect = servicesStageWrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const hasEntered = rect.top <= 0;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      const progress = total > 0 ? scrolled / total : 1;
      const revealCount = !hasEntered
        ? 0
        : Math.min(serviceCards.length, 1 + Math.floor(progress * (serviceCards.length - 1)));
      serviceCards.forEach((card, i) => {
        card.classList.toggle('revealed', i < revealCount);
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateServicesReveal);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateServicesReveal);
    updateServicesReveal();
  }
}

document.querySelectorAll('.service-toggle').forEach((btn) => {
  const label = btn.querySelector('span');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    label.textContent = expanded ? 'See what this includes' : 'Hide details';
  });
});

const carousel = document.querySelector('.testimonial-carousel');

if (carousel) {
  const track = carousel.querySelector('.testimonial-track');
  const slides = [...track.querySelectorAll('.testimonial-slide')];
  const dotsWrap = carousel.querySelector('.carousel-dots');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let current = 0;
  let autoplayId = null;
  let userPaused = false;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show testimonial ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => {
      goTo(i);
      userPaused = true;
      stopAutoplay();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const isActive = i === current;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  prevBtn.addEventListener('click', () => {
    prev();
    userPaused = true;
    stopAutoplay();
  });
  nextBtn.addEventListener('click', () => {
    next();
    userPaused = true;
    stopAutoplay();
  });

  function startAutoplay() {
    if (prefersReducedMotion || userPaused || autoplayId) return;
    autoplayId = setInterval(next, 7000);
  }
  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  goTo(0);
  startAutoplay();
}

const form = document.querySelector('.contact-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      form.hidden = true;
      form.insertAdjacentHTML(
        'afterend',
        '<p class="form-success">Thanks — your message is in! I\'ll get back to you within a couple of days.</p>'
      );
    } else {
      throw new Error('Form submission failed');
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
    let errorEl = form.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      form.appendChild(errorEl);
    }
    errorEl.textContent = 'Something went wrong — please email katieleesanders@gmail.com directly.';
  }
});

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

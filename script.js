/* =============================================
   CoachMack — Landing Page Interactions
   ============================================= */

(() => {
  'use strict';

  /* ---------- Navbar: sticky + scroll ---------- */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---------- Mobile burger menu ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Animated counter (hero stats) ---------- */
  const animateCounter = (el, target, duration = 1600) => {
    let start = null;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .service-card');
  let countersStarted = false;

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Counter observer — triggers when hero stats section is visible
  const statNumbers = document.querySelectorAll('.stat__number');
  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(el => {
          animateCounter(el, parseInt(el.dataset.target, 10));
        });
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });

    counterObserver.observe(statNumbers[0].closest('.hero__stats'));
  }

  /* ---------- Add reveal class to section elements ---------- */
  document.querySelectorAll(
    '.section-header, .about__image-wrap, .about__content, ' +
    '.contact__info, .contact__form, .testimonial-card'
  ).forEach(el => el.classList.add('reveal'));

  // Re-observe newly classified elements
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Contact form ---------- */
  // Replace YOUR_FORM_ID with the ID from your Formspree dashboard (formspree.io)
  const FORMSPREE_ENDPOINT = 'https://formsubmit.co/ajax/rob@probotsolutions.com';

  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const showError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.add('error');
    error.textContent = message;
  };

  const clearError = (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.remove('error');
    error.textContent = '';
  };

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validate name
    if (!name) {
      showError('name', 'nameError', 'Please enter your full name.');
      valid = false;
    } else {
      clearError('name', 'nameError');
    }

    // Validate email
    if (!email) {
      showError('email', 'emailError', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email', 'emailError');
    }

    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('service', document.getElementById('service').value);
      formData.append('message', document.getElementById('message').value.trim());
      formData.append('_subject', 'New ProBot Solutions inquiry');
      formData.append('_captcha', 'false');
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.ok) {
        form.reset();
        formSuccess.classList.add('visible');
        setTimeout(() => {
          window.location.href = 'https://api.leadconnectorhq.com/widget/booking/fyAxqrvzu6wILHjAFZfW';
        }, 1500);
      } else {
        const data = await res.json();
        const msg = data.errors ? data.errors.map(err => err.message).join(', ') : 'Submission failed. Please try again.';
        showError('email', 'emailError', msg);
      }
    } catch {
      showError('email', 'emailError', 'Network error. Please try again.');
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });

  // Clear errors on input
  ['name', 'email'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const errId = id + 'Error';
      clearError(id, errId);
    });
  });

  /* ---------- Smooth active nav highlight ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.navbar__links a');

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeObserver.observe(s));
})();

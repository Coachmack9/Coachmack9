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

  // Counter observer — triggers when trust stats section enters viewport
  const statNumbers = document.querySelectorAll('.stat__number');
  if (statNumbers.length) {
    const triggerEl = statNumbers[0].closest('.hero__trust') ||
                      statNumbers[0].closest('.hero__stats') ||
                      statNumbers[0].parentElement;
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach(el => {
          animateCounter(el, parseInt(el.dataset.target, 10));
        });
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(triggerEl);
  }

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

  /* ──────────── Voice Demo Player ──────────── */
  const demoPlayBtn  = document.getElementById('demoPlayBtn');
  const demoResetBtn = document.getElementById('demoResetBtn');
  const demoChat     = document.getElementById('demoChat');
  const demoTimer    = document.getElementById('demoTimer');
  const demoDot      = document.getElementById('demoDot');
  const demoStart    = document.getElementById('demoStartScreen');

  const DEMO_SCRIPT = [
    { role: 'ai',     text: 'Thank you for calling Action Plumbing — this is Max, your AI receptionist. How can I help you today?', delay: 800 },
    { role: 'caller', text: 'Hey, my kitchen sink is completely backed up. Water is going everywhere.', delay: 2800 },
    { role: 'ai',     text: "I'm sorry to hear that — we can get a plumber out to you today. May I get your name?", delay: 2400 },
    { role: 'caller', text: 'John Martinez.', delay: 2000 },
    { role: 'ai',     text: 'Hi John! What address should I send the technician to?', delay: 1800 },
    { role: 'caller', text: '47 Oak Street, Framingham.', delay: 2000 },
    { role: 'ai',     text: 'Got it. We have a 2 PM opening today — does that work for you?', delay: 2200 },
    { role: 'caller', text: 'Yes, 2 PM is perfect.', delay: 1800 },
    { role: 'ai',     text: "You're all set, John! A plumber will be at 47 Oak Street at 2 PM. You'll get a text confirmation shortly.", delay: 2600 },
    { role: 'caller', text: "That's great. Thank you so much!", delay: 2000 },
    { role: 'ai',     text: "Have a great day, John! We'll see you at 2!", delay: 1600 },
  ];

  let demoRunning = false;
  let demoInterval = null;
  let demoSeconds = 0;

  function demoTick() {
    demoSeconds++;
    const m = Math.floor(demoSeconds / 60);
    const s = String(demoSeconds % 60).padStart(2, '0');
    if (demoTimer) demoTimer.textContent = `${m}:${s}`;
  }

  function makeDemoMsg(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `demo-msg demo-msg--${role}`;

    const av = document.createElement('div');
    av.className = 'demo-msg__avatar';
    av.textContent = role === 'ai' ? 'AI' : 'YOU';

    const bub = document.createElement('div');
    bub.className = 'demo-msg__bubble';
    bub.textContent = text;

    wrap.appendChild(av);
    wrap.appendChild(bub);
    return wrap;
  }

  function makeTypingIndicator(role) {
    const wrap = document.createElement('div');
    wrap.className = `demo-msg demo-msg--${role} demo-typing`;

    const av = document.createElement('div');
    av.className = 'demo-msg__avatar';
    av.textContent = role === 'ai' ? 'AI' : 'YOU';

    const bub = document.createElement('div');
    bub.className = 'demo-msg__bubble';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'typing-dot';
      bub.appendChild(dot);
    }

    wrap.appendChild(av);
    wrap.appendChild(bub);
    return wrap;
  }

  async function runDemo() {
    if (demoRunning || !demoPlayBtn) return;
    demoRunning = true;

    // Clear start screen, prep chat
    if (demoStart) demoStart.style.display = 'none';
    if (demoResetBtn) demoResetBtn.style.display = 'flex';
    if (demoDot) demoDot.classList.add('active');

    demoSeconds = 0;
    demoInterval = setInterval(demoTick, 1000);

    for (const line of DEMO_SCRIPT) {
      // Show typing indicator
      const typing = makeTypingIndicator(line.role);
      demoChat.appendChild(typing);
      demoChat.scrollTop = demoChat.scrollHeight;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => typing.classList.add('visible'));
      });

      await new Promise(r => setTimeout(r, line.delay));

      // Replace typing with message
      typing.remove();
      const msg = makeDemoMsg(line.role, line.text);
      demoChat.appendChild(msg);
      demoChat.scrollTop = demoChat.scrollHeight;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => msg.classList.add('visible'));
      });

      await new Promise(r => setTimeout(r, 400));
    }

    clearInterval(demoInterval);
    if (demoDot) demoDot.classList.remove('active');

    // Show "call ended" message
    const ended = document.createElement('div');
    ended.style.cssText = 'text-align:center;font-size:0.8rem;color:rgba(255,255,255,.35);padding:12px 0;';
    ended.textContent = '— Call ended · Appointment booked ✅ —';
    demoChat.appendChild(ended);
    demoChat.scrollTop = demoChat.scrollHeight;
  }

  function resetDemo() {
    demoRunning = false;
    clearInterval(demoInterval);
    demoSeconds = 0;
    if (demoTimer) demoTimer.textContent = '0:00';
    if (demoDot) demoDot.classList.remove('active');
    if (demoResetBtn) demoResetBtn.style.display = 'none';
    if (demoChat) {
      demoChat.innerHTML = '';
      if (demoStart) {
        demoStart.style.display = 'flex';
        demoChat.appendChild(demoStart);
      }
    }
  }

  if (demoPlayBtn) demoPlayBtn.addEventListener('click', runDemo);
  if (demoResetBtn) demoResetBtn.addEventListener('click', resetDemo);

  // "Hear the AI" buttons auto-scroll to demo AND start it
  document.querySelectorAll('a[href="#demo"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const demoSection = document.getElementById('demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { if (!demoRunning) runDemo(); }, 800);
      }
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

// Accord VI — site interactions
// Mobile nav toggle, countdown, FAQ accordion, and registration form handling.
// Shared across index.html / register.html / sponsor.html — every block below
// guards for missing elements since no single page has all of them.

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    offset: 60,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu after tapping a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Countdown to Accord VI (18 Oct 2026, local time) — index.html and register.html
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  if (cdDays && cdHours && cdMins && cdSecs) {
    const countdownTarget = new Date('2026-10-18T00:00:00');

    function updateCountdown() {
      const diff = countdownTarget - new Date();
      if (diff <= 0) {
        cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '0';
        return;
      }
      const s = Math.floor(diff / 1000);
      cdDays.textContent = Math.floor(s / 86400);
      cdHours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
      cdMins.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      cdSecs.textContent = String(s % 60).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // FAQ accordion — index.html
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length) {
    faqQuestions.forEach((btn) => {
      const answer = btn.nextElementSibling;
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        faqQuestions.forEach((other) => {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // Registration form — register.html only
  const form = document.getElementById('contactForm');
  const reasonSelect = document.getElementById('reason');
  const attendeeFields = document.getElementById('attendeeFields');
  const attendeeFields2 = document.getElementById('attendeeFields2');
  const sponsorFields = document.getElementById('sponsorFields');

  if (form && reasonSelect && attendeeFields && attendeeFields2 && sponsorFields) {
    function syncReasonFields() {
      const isSponsor = reasonSelect.value === 'sponsor';
      attendeeFields.hidden = isSponsor;
      attendeeFields2.hidden = isSponsor;
      sponsorFields.hidden = !isSponsor;
    }

    // Deep link from the sponsor page: register.html?as=sponsor preselects the reason
    const params = new URLSearchParams(window.location.search);
    if (params.get('as') === 'sponsor') {
      reasonSelect.value = 'sponsor';
    }
    syncReasonFields();
    reasonSelect.addEventListener('change', syncReasonFields);

    const note = document.getElementById('formNote');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = "Thanks — this is a placeholder confirmation. Hook this form up to an email service or backend to actually receive messages.";
      form.reset();
      syncReasonFields();
    });
  }
});

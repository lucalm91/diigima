// The Death of Us Landing Page Script
// Lightweight progressive enhancement: form handling, animation triggers, focus mgmt.

(function() {
  const form = document.getElementById('rsvp-form');
  const statusEl = document.getElementById('form-status');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Intersection-based reveal for elements with [data-animate]
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = '600ms cubic-bezier(.4,0,.2,1)';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.transform = 'translateY(28px)';
    el.style.opacity = '0';
    observer.observe(el);
  });

  function validateEmail(value) {
    return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(value);
  }

  function setStatus(msg, type = 'info') {
    statusEl.textContent = msg;
    statusEl.className = '';
    if (type === 'success') statusEl.classList.add('success');
    if (type === 'error') statusEl.classList.add('error');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      setStatus('Submitting...');
      const data = new FormData(form);
      const email = (data.get('email') || '').toString().trim();
      const firstName = (data.get('firstName') || '').toString().trim();
      const lastName = (data.get('lastName') || '').toString().trim();
      const guests = data.get('guests');
      const consent = data.get('consent');

      if (!firstName || !lastName || !email || !guests || !consent) {
        setStatus('Please complete all required fields.', 'error');
        return;
      }
      if (!validateEmail(email)) {
        setStatus('Please enter a valid email.', 'error');
        return;
      }

      // Simulate async submission (replace with fetch POST to backend)
      form.querySelector('button[type=submit]').disabled = true;
      setTimeout(() => {
        try {
          const submissions = JSON.parse(localStorage.getItem('tdou_rsvps') || '[]');
          submissions.push({
            ts: Date.now(),
            firstName, lastName, email, guests, message: data.get('message') || ''
          });
          localStorage.setItem('tdou_rsvps', JSON.stringify(submissions));
          setStatus('Request received. Check your inbox soon!', 'success');
          form.reset();
        } catch (err) {
          console.error(err);
          setStatus('An unexpected error occurred. Try again.', 'error');
        } finally {
          form.querySelector('button[type=submit]').disabled = false;
        }
      }, 900);
    });
  }
})();

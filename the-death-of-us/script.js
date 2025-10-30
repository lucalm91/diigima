// The Death of Us Landing Page Script
// Form handling with Google Sheets integration

(function() {
  // Google Sheets Web App URL - YOU NEED TO REPLACE THIS WITH YOUR ACTUAL SCRIPT URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyF7Gp9cSEdEul_uToQwkfk_WlEqdyhlTDQvDKD3wka7nKlTUFadAYakI4-TgvZi91c/exec';
  
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

      // Disable submit button during submission
      const submitButton = form.querySelector('button[type=submit]');
      submitButton.disabled = true;
      document.body.classList.add('loading');

      // Submit to Google Sheets
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
          setStatus('Thanks for accepting our invitation!\nCheck your email for confirmation.', 'success');
          form.reset();
          // Optional: redirect to thank you page after 2 seconds
          // setTimeout(() => { window.location.href = '/thank-you'; }, 2000);
        })
        .catch(error => {
          console.error('Error!', error.message);
          setStatus('An error occurred. Please try again or contact us directly.', 'error');
        })
        .finally(() => {
          submitButton.disabled = false;
          document.body.classList.remove('loading');
        });
    });
  }
})();

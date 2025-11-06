// My Clinical - Lead capture form (Google Sheets integration placeholder)
(function() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwWfgGllwul8yVaG4LHomMIdVcQLS8yRXMwuCQ-2ea0dhwAM0MlRWE5K4dNybOttiti/exec';

  const form = document.getElementById('lead-form');
  const statusEl = document.getElementById('form-status');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function validateEmail(value) { return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(value); }
  function validatePhone(value) { const d = (value||'').replace(/\D+/g,''); return d.length >= 7; }
  function setStatus(msg, type='info') {
    statusEl.textContent = msg; statusEl.className = ''; if (type==='success') statusEl.classList.add('success'); if (type==='error') statusEl.classList.add('error');
  }
  function toTitleCase(str) {
    if (!str) return ''; const n = str.trim().replace(/\s+/g,' ').toLowerCase();
    return n.split(' ').map(t=>t.split(/(['’\-])/).map(p=> (p==='-'||p==="'"||p==='’')?p:(p?p.charAt(0).toUpperCase()+p.slice(1):p)).join('')).join(' ');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      setStatus('Invio in corso...');

      const data = new FormData(form);
      const email = (data.get('email')||'').toString().trim();
      const firstNameRaw = (data.get('firstName')||'').toString();
      const lastNameRaw = (data.get('lastName')||'').toString();
      const cityRaw = (data.get('city')||'').toString();
      const phone = (data.get('phone')||'').toString().trim();
      const treatment = (data.get('treatment')||'').toString();
      const contactTime = (data.get('contactTime')||'').toString();
      const contactMethod = (data.get('contactMethod')||'').toString();
  const notes = (data.get('notes')||'').toString().trim();
      const postalCodeRaw = (data.get('postalCode')||'').toString();
      const postalDigits = postalCodeRaw.replace(/\D+/g,'');

      const firstName = toTitleCase(firstNameRaw);
      const lastName = toTitleCase(lastNameRaw);
      const city = toTitleCase(cityRaw);
      const consent = data.get('consent');

      if (!firstName || !lastName || !email || !phone || !treatment || !consent || !city || !postalDigits || postalDigits.length !== 5 || !contactTime || !contactMethod) {
        setStatus('Per favore, completa tutti i campi obbligatori.', 'error');
        return;
      }
      if (!validateEmail(email)) { setStatus('Inserisci un\'email valida.', 'error'); return; }
      if (!validatePhone(phone)) { setStatus('Inserisci un numero di telefono valido.', 'error'); return; }

      if (form.elements['firstName']) form.elements['firstName'].value = firstName;
      if (form.elements['lastName']) form.elements['lastName'].value = lastName;
      if (form.elements['city']) form.elements['city'].value = city;

      const submitButton = form.querySelector('button[type=submit]');
      submitButton.disabled = true; document.body.classList.add('loading');

      // Build payload with UTM and CAP as text (preserve leading zeros)
      const payload = new FormData(form);
      if (postalDigits) payload.set('postalCode', "'" + postalDigits);
      payload.append('utm_source', 'Fiera');
      payload.append('utm_medium', 'Landing Page');
  payload.append('utm_campaign', 'MyClinical');
      payload.append('timestamp', new Date().toISOString());

      fetch(scriptURL, { method: 'POST', body: payload })
        .then(() => {
          setStatus('Richiesta inviata! Controlla la tua email per i dettagli dell\'offerta in fiera.', 'success');
          form.reset();
          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0,0); }
        })
        .catch((err) => { console.error(err); setStatus('Errore imprevisto. Riprova più tardi.', 'error'); })
        .finally(() => { submitButton.disabled = false; document.body.classList.remove('loading'); });
    });
  }
})();

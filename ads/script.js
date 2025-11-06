// Diigima Ads - Lead capture form (Google Sheets integration)
(function() {
  // Google Apps Script Web App URL (deployed)
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyf_XHG8FjlqdyyIpsLhFrqsUl9KYb3cYafc_z9KAGDhIlK-HH7aZon72LA38v7NoEUDw/exec';

  const form = document.getElementById('lead-form');
  const statusEl = document.getElementById('form-status');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function validateEmail(value) { return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(value); }
  function validatePhone(value) {
    if (!value) return false;
    const digits = value.replace(/\D+/g, '');
    return digits.length >= 7; // minimal sanity check for phone length
  }
  function setStatus(msg, type = 'info') {
    statusEl.textContent = msg;
    statusEl.className = '';
    if (type === 'success') statusEl.classList.add('success');
    if (type === 'error') statusEl.classList.add('error');
  }

  function toTitleCase(str) {
    if (!str) return '';
    const normalized = str.trim().replace(/\s+/g, ' ').toLowerCase();
    return normalized
      .split(' ')
      .map(token => token
        .split(/(['’\-])/)
        .map(part => {
          if (part === '-' || part === "'" || part === '’') return part;
          return part ? part.charAt(0).toUpperCase() + part.slice(1) : part;
        })
        .join('')
      )
      .join(' ');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      setStatus('Invio in corso...');

      const data = new FormData(form);
      const email = (data.get('email') || '').toString().trim();
      const firstNameRaw = (data.get('firstName') || '').toString();
      const lastNameRaw = (data.get('lastName') || '').toString();
      const cityRaw = (data.get('city') || '').toString();
  const phone = (data.get('phone') || '').toString().trim();
  const treatment = (data.get('treatment') || '').toString();
  const postalCodeRaw = (data.get('postalCode') || '').toString();
  const postalDigits = postalCodeRaw.replace(/\D+/g, '');
  const contactTime = (data.get('contactTime') || '').toString();
  const contactMethod = (data.get('contactMethod') || '').toString();
  const notes = (data.get('notes') || '').toString().trim();
      const firstName = toTitleCase(firstNameRaw);
      const lastName = toTitleCase(lastNameRaw);
      const city = toTitleCase(cityRaw);
      const consent = data.get('consent');

      if (!firstName || !lastName || !email || !phone || !treatment || !consent || !city || !postalDigits || postalDigits.length !== 5 || !contactTime || !contactMethod) {
        setStatus('Per favore, completa tutti i campi obbligatori.', 'error');
        return;
      }
      if (!validateEmail(email)) {
        setStatus('Inserisci un\'email valida.', 'error');
        return;
      }
      if (!validatePhone(phone)) {
        setStatus('Inserisci un numero di telefono valido.', 'error');
        return;
      }

      // write cleaned values back
      if (form.elements['firstName']) form.elements['firstName'].value = firstName;
      if (form.elements['lastName']) form.elements['lastName'].value = lastName;
      if (form.elements['city']) form.elements['city'].value = city;

      const submitButton = form.querySelector('button[type=submit]');
      submitButton.disabled = true;
      document.body.classList.add('loading');

      // Prepara payload con metadati utili (tracking)
      const payload = new FormData(form);
      // CAP: invia come testo forzando l'interpretazione in Google Sheet (preserva zeri iniziali)
      try {
        if (postalDigits) payload.set('postalCode', "'" + postalDigits);
      } catch {}
  // UTM predefiniti richiesti
  payload.append('utm_source', 'Fiera');
  payload.append('utm_medium', 'QR');
  payload.append('utm_campaign', 'Sconto20');
    payload.append('timestamp', new Date().toISOString());

      fetch(scriptURL, { method: 'POST', body: payload })
        .then(() => {
          setStatus('Richiesta inviata! Controlla la tua email per il kit e il codice sconto.', 'success');
          form.reset();
          // Torna all'inizio della pagina (senza redirect)
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch {
            window.scrollTo(0, 0);
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus('Errore imprevisto. Riprova più tardi.', 'error');
        })
        .finally(() => {
          submitButton.disabled = false;
          document.body.classList.remove('loading');
        });
    });
  }
})();

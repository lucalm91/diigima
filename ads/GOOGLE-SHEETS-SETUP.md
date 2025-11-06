# Collegare la landing /ads a Google Sheets (come "The Death of Us")

Questa guida spiega, passo dopo passo, come collegare il form della landing `ads/` a un Google Sheet usando Google Apps Script, replicando il flusso usato nella landing di "The Death of Us":
- I dati del form vengono inviati a un Web App (Apps Script)
- Il Web App scrive su Google Sheets
- (Opzionale) Il Web App invia un'email di ringraziamento usando il template `ads/email-thank-you.html`
- Il frontend reindirizza alla pagina `/thank-you/`

## Requisiti
- Account Google
- Un Google Sheet (Foglio Google) dove salvare i lead
- Permesso di deployare un Web App Apps Script con accesso "Chiunque"

## 1) Prepara il Google Sheet
1. Crea un nuovo Foglio Google e rinominalo (es. `Studio D’Uggento – Ads`)
2. Aggiungi una prima riga con le intestazioni (puoi personalizzare l'ordine, ma questo schema è già compatibile con il nostro form):
  - `Timestamp`
  - `First Name`
  - `Last Name`
  - `Email`
  - `Phone`
  - `City`
  - `Postal Code`
  - `Treatment`
  - `Contact Time`
  - `Contact Method`
  - `Notes`
  - `Consent`
  - `UTM Source`
  - `UTM Medium`
  - `UTM Campaign`
  - `Page URL`
  - `User Agent`

Annota l'ID del foglio (lo trovi nell'URL tra `/d/` e `/edit`).

## 2) Crea il progetto Google Apps Script
1. Apri `script.google.com` e crea un nuovo progetto (oppure apri il Foglio e vai su Estensioni → Apps Script per creare uno script legato al foglio)
2. Crea un file `Code.gs` e incolla il seguente codice, sostituendo `YOUR_SPREADSHEET_ID` con l'ID del tuo foglio e `SHEET_NAME` con il nome del tab (es. `Leads`):

```javascript
/**
 * Web App per ricevere submit del form e scrivere su Google Sheets
 * Opzionale: invio email di ringraziamento con template HTML
 */
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
  SHEET_NAME: 'Leads',
  SEND_EMAIL: true, // metti false se non vuoi inviare email
  SENDER_NAME: 'Studio D’Uggento',
  EMAIL_SUBJECT: 'Grazie! Il tuo kit e il codice sconto',
  // Per il template, crea un file HTML in Apps Script chiamato 'email-thank-you'
  EMAIL_TEMPLATE_FILE: 'email-thank-you'
};

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) throw new Error('Sheet non trovato: ' + CONFIG.SHEET_NAME);

  // Apps Script gestisce multipart/form-data come e.parameter
    const p = (e && e.parameter) ? e.parameter : {};

    // Normalizza campi attesi dal form /ads (vedi ads/index.html)
    const record = {
      timestamp: new Date(),
      firstName: (p.firstName || '').trim(),
      lastName: (p.lastName || '').trim(),
      email: (p.email || '').trim(),
      phone: (p.phone || '').trim(),
      city: (p.city || '').trim(),
      postalCode: (p.postalCode || '').trim(),
      treatment: (p.treatment || '').trim(),
      contactTime: (p.contactTime || '').trim(),
      contactMethod: (p.contactMethod || '').trim(),
      notes: (p.notes || '').trim(),
      consent: (p.consent ? 'yes' : ''),
      pageUrl: (p.page_url || '').trim(),
      userAgent: (p.userAgent || '').trim(),
      utmSource: (p.utm_source || '').trim(),
      utmMedium: (p.utm_medium || '').trim(),
      utmCampaign: (p.utm_campaign || '').trim()
    };

    // Scrivi su Google Sheet (adatta l'ordine alle intestazioni del tuo foglio)
    sheet.appendRow([
      record.timestamp,
      record.firstName,
      record.lastName,
      record.email,
      record.phone,
      record.city,
      record.postalCode,
      record.treatment,
      record.contactTime,
      record.contactMethod,
      record.notes,
      record.consent,
      record.utmSource,
      record.utmMedium,
      record.utmCampaign,
      record.pageUrl,
      record.userAgent
    ]);

    if (CONFIG.SEND_EMAIL && record.email) {
      sendThankYouEmail(record);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendThankYouEmail(record) {
  // Il template deve esistere come file HTML nel progetto Apps Script (vedi step 3)
  const tmpl = HtmlService.createTemplateFromFile(CONFIG.EMAIL_TEMPLATE_FILE);
  // Rendi disponibile FIRST_NAME al template (il file può usare <?= FIRST_NAME ?> o {{FIRST_NAME}} se pre-elaborato)
  tmpl.FIRST_NAME = record.firstName || '';
  const html = tmpl.evaluate().getContent();

  GmailApp.sendEmail(
    record.email,
    CONFIG.EMAIL_SUBJECT,
    'Grazie! Il tuo client non supporta HTML. Contattaci per maggiori informazioni.',
    { htmlBody: html, name: CONFIG.SENDER_NAME }
  );
}
```

3. Salva.

## 3) Aggiungi il template email (opzionale ma consigliato)
1. Nel progetto Apps Script, crea un nuovo file HTML chiamato `email-thank-you`
2. Copia il contenuto del file del repository `ads/email-thank-you.html` e incollalo nel file HTML di Apps Script
3. Se vuoi personalizzare il nome del destinatario, sostituisci nel template i placeholder con lo scriptlet di Apps Script:
   - Dove vuoi il nome: `<?= FIRST_NAME ?>`

> Nota: nel repository il coupon è già statico (es. DUGGENTO20, scadenza 28/02/2026). Puoi aggiornarlo direttamente nel template.

## 4) Deploy del Web App
1. In Apps Script: Pubblica → Distribuisci come Web App (o Distribuisci → Implementazioni → Nuova implementazione)
2. Seleziona "Chiunque" come accesso (o "Chiunque con link")
3. Copia l'URL del Web App (termina con `/exec`)

## 5) Configura il frontend
1. Apri `ads/script.js`
2. Aggiorna la costante `scriptURL` con l'URL del Web App che hai appena copiato
3. Opzionale: aggiorna `campaign` in base al naming della tua campagna

```js
const scriptURL = 'https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec';
```

Il form invia tutti i campi e, oltre ai dati utente, aggiunge anche:
- `utm_source = Fiera`
- `utm_medium = QR`
- `utm_campaign = Sconto20`
- `page_url = location.href`
- `timestamp = new Date().toISOString()` (gestito lato client; lato server scriviamo anche un `Timestamp`)

Alla conferma, il frontend mostra un messaggio di successo, resetta il form e torna all'inizio della pagina (senza redirect).

## 6) Test rapido
- Apri la pagina `/ads/` e invia un test
- Verifica che una nuova riga appaia nel foglio
- Verifica arrivo email (se `SEND_EMAIL` è true)

In alternativa, puoi testare via terminale (PowerShell su Windows) usando `curl.exe`:

```powershell
# Sostituisci <WEB_APP_URL>
$u = '<WEB_APP_URL>'

curl.exe -X POST `
  -F "firstName=Mario" `
  -F "lastName=Rossi" `
  -F "email=mario.rossi@example.com" `
  -F "phone=3331234567" `
  -F "city=Torino" `
  -F "postalCode=10121" `
  -F "treatment=Check-up" `
  -F "contactTime=Mattina" `
  -F "contactMethod=Telefono" `
  -F "notes=Test da CLI" `
  -F "consent=on" `
  -F "utm_source=Fiera" `
  -F "utm_medium=QR" `
  -F "utm_campaign=Sconto20" `
  -F "page_url=https://tuo-domino/ads" `
  $u
```

> Nota: `curl` in PowerShell è un alias di `Invoke-WebRequest`. Per usare il vero cURL, richiama `curl.exe` come nell'esempio.

## 7) Troubleshooting
- 403/401 alla POST: controlla i permessi del Web App (deve essere accessibile a chiunque)
- Dati non in colonna giusta: verifica ordine di `appendRow` e intestazioni
- Email non arriva: controlla `SEND_EMAIL`, verifica anche lo spam. Su domini Google Workspace potresti avere policy antispam.
- CORS: non è necessario configurarlo manualmente; la richiesta è cross-origin ma Apps Script risponde normalmente a `fetch`.
- Redirect frontend: assicurati che la pagina `/thank-you/` esista (nel repo è `thank-you/index.html`).

## 8) Mantenimento e versioning
- Ogni volta che modifichi lo script, crea una nuova Implementazione del Web App e aggiorna l'URL se cambia
- Valuta di proteggere il Web App con un token semplice (es. `p.secret === '...'`) se necessario; in quel caso aggiungi il token alla richiesta dal frontend

---

Con questo setup replichi il flusso della landing "The Death of Us": form → Apps Script → Google Sheet → (email) → redirect a thank-you.

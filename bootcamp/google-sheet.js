const scriptURL = 'https://script.google.com/macros/s/AKfycbyGau-E-dJTiWxaUCsg2N4YYc9JTjhabgMnzcV663oxWDGpSDSLH76I_4e5YByu6__x/exec'

const form = document.forms['form-step1']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(() => { window.location.href = '/thank-you'; })
  .catch(error => console.error('Error!', error.message))
})
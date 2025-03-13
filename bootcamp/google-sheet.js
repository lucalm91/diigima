const scriptURL = 'https://script.google.com/macros/s/AKfycbyGau-E-dJTiWxaUCsg2N4YYc9JTjhabgMnzcV663oxWDGpSDSLH76I_4e5YByu6__x/exec';
const form = document.forms['form-step1'];
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', e => {
  e.preventDefault();
  
  // Add the loading class to force the wait cursor on all elements
  document.body.classList.add('loading');
  
  // Disable the submit button to prevent additional clicks
  submitButton.disabled = true;

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(() => {
      window.location.href = '/thank-you';
    })
    .catch(error => {
      // Remove the loading class if an error occurs so the cursor returns to normal
      document.body.classList.remove('loading');
      submitButton.disabled = false;
      console.error('Error!', error.message);
    });
});

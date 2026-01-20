const scriptURL = 'https://script.google.com/macros/s/AKfycbx6ADL7gUmQSZ9bWFqVGsqnukorp5SWFrmXkXkIx9OrHTOGFscgs4OO2yDECVFFSwebCQ/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  e.preventDefault()
  const formData = new FormData(form);
  formData.append("Page URL", window.location.href);
  fetch(scriptURL, { method: 'POST', body: formData})
  .then(response => alert("Thank you! your form is submitted successfully." ))
  .then(() => { window.location.href = 'https://diigima.es'; })
  .catch(error => console.error('Error!', error.message))
})
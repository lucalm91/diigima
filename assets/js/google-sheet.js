const scriptURL = 'https://script.google.com/macros/s/AKfycbx6ADL7gUmQSZ9bWFqVGsqnukorp5SWFrmXkXkIx9OrHTOGFscgs4OO2yDECVFFSwebCQ/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("Thank you! your form is submitted successfully." ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})
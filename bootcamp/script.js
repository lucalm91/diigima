document.addEventListener('DOMContentLoaded', function() {
    // Sticky Nav: Show when scrolling past the About section
    const bootcampNav = document.getElementById('bootcamp-nav');
    const aboutSection = document.getElementById('about-workshop');
    let navVisible = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY >= aboutSection.offsetTop && !navVisible) {
        bootcampNav.classList.add('show-nav');
        navVisible = true;
      } else if (window.scrollY < aboutSection.offsetTop && navVisible) {
        bootcampNav.classList.remove('show-nav');
        navVisible = false;
      }
    });
  
    // Set Last Update date in Urgency Section
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('lastUpdate').textContent = today.toLocaleDateString('en-US', options);
  
    // Blinking effect: Find the first seat-icon that has the "available" class inside .seat-icons and toggle "blink" on it every second.
    const firstAvailable = document.querySelector('.seat-icons .seat-icon.available');
    if (firstAvailable) {
      setInterval(() => {
        if (firstAvailable.classList.contains('blink')) {
          firstAvailable.classList.remove('blink');
        } else {
          firstAvailable.classList.add('blink');
        }
      }, 1000);
    }
  
    // Modal handling (for the optional popup version)
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    function openModal() { modal.classList.add('show-modal'); }
    function closeModal() { modal.classList.remove('show-modal'); }
    if (openModalBtn) { openModalBtn.addEventListener('click', openModal); }
    if (closeModalBtn) { closeModalBtn.addEventListener('click', closeModal); }
    window.addEventListener('click', (event) => { if (event.target === modal) { closeModal(); } });
    // Bind CTA buttons to open modal (if using modal version)
    const navCtaBtn = document.getElementById('navCtaBtn');
    if (navCtaBtn) { navCtaBtn.addEventListener('click', openModal); }
    const urgencyCta = document.getElementById('sectionCtaUrgency');
    if (urgencyCta) { urgencyCta.addEventListener('click', openModal); }
    const ctaButtonNeed = document.getElementById('sectionCtaNeed');
    if (ctaButtonNeed) { ctaButtonNeed.addEventListener('click', openModal); }
  
    
  });
  
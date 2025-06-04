// =========================================================
// GLOBAL: DOMContentLoaded
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // NAVIGATION: MOBILE TOGGLE
  // =========================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // =========================================================
  // SCROLL POSITION TRACKING (FÜR ANIMATIONEN)
  // =========================================================
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
  });

  // =========================================================
  // SECTION ANIMATIONEN BEIM SCROLLEN
  // =========================================================
  const sectionObserver = new IntersectionObserver((entries) => {
    const currentScrollY = window.scrollY;
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('visible');
        el.style.transform = '';
        el.style.opacity = '';
      } else {
        el.classList.remove('visible');
        el.style.transform = (currentScrollY < lastScrollY) ? 'translateY(-20px)' : 'translateY(20px)';
        el.style.opacity = '0';
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  document.querySelectorAll('.card, .section').forEach(section => sectionObserver.observe(section));

  // =========================================================
  // FAQ: AUF-/ZUKLAPPEN (ohne Timer)
  // =========================================================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
    });
  });

  // =========================================================
  // HELPER: SCHLIESST ALLE CARDS & LÖSCHT TIMER
  // =========================================================
  function closeAllCards(cards) {
    cards.forEach(card => {
      card.classList.remove('open');
      if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
    });
  }

  // =========================================================
  // APPOINTMENT-CARD LOGIK
  // =========================================================
  const appointmentCards = document.querySelectorAll('.appointment-card');
  appointmentCards.forEach(card => {
    card.addEventListener('click', function () {
      if (card.classList.contains('open')) {
        card.classList.remove('open');
        if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
      } else {
        closeAllCards(appointmentCards);
        card.classList.add('open');
      }
    });
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (card.classList.contains('open')) {
          card.classList.remove('open');
          if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
        } else {
          closeAllCards(appointmentCards);
          card.classList.add('open');
        }
      }
    });
  });

  // =========================================================
  // PREISE-CARD LOGIK
  // =========================================================
  const preiseCards = document.querySelectorAll('.preise-card');
  preiseCards.forEach(card => {
    card.addEventListener('click', function () {
      if (card.classList.contains('open')) {
        card.classList.remove('open');
        if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
      } else {
        closeAllCards(preiseCards);
        card.classList.add('open');
      }
    });
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (card.classList.contains('open')) {
          card.classList.remove('open');
          if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
        } else {
          closeAllCards(preiseCards);
          card.classList.add('open');
        }
      }
    });
  });

  // =========================================================
  // SPRECHSTUNDE-BUTTON: TERMINKARTE ÖFFNEN MIT AUTO-CLOSE
  // =========================================================
  document.querySelectorAll('.sprechstunde-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.getElementById('sprechstundentermine');
      if (section) section.scrollIntoView({ behavior: "smooth" });
      closeAllCards(appointmentCards);
      const feldNummer = btn.getAttribute('data-open-feld');
      if (feldNummer) {
        const card = appointmentCards[parseInt(feldNummer, 10) - 1];
        if (card) {
          setTimeout(() => {
            card.classList.add('open');
            if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
            card._autoCloseTimeout = setTimeout(() => {
              card.classList.remove('open');
            }, 2000);
          }, 350);
        }
      }
    });
  });

  // =========================================================
  // PREISE-LINK IN FAQ: PREISE-KARTE MIT TIMER ÖFFNEN
  // =========================================================
  document.querySelectorAll('.preise-link[data-preise-feld]').forEach(link => {
    link.addEventListener('click', function () {
      setTimeout(() => {
        const feldNummer = link.getAttribute('data-preise-feld');
        closeAllCards(preiseCards);
        if (feldNummer && preiseCards[parseInt(feldNummer, 10) - 1]) {
          const card = preiseCards[parseInt(feldNummer, 10) - 1];
          card.classList.add('open');
          if (card._autoCloseTimeout) clearTimeout(card._autoCloseTimeout);
          card._autoCloseTimeout = setTimeout(() => {
            card.classList.remove('open');
          }, 2000);
        }
      }, 350);
    });
  });

  // =========================================================
// SPLIT-CARD: MOBIL & DESKTOP VERHALTEN
// =========================================================
const splitCard = document.querySelector('.split-card');
if (splitCard) {
  function isMobile() {
    return window.innerWidth <= 768;
  }
  let splitOpen = false;

  // DESKTOP: Direktes Scrollen bei Split-Feld-Klick
  document.querySelectorAll('.split-card .split-content .split-field').forEach(field => {
    field.addEventListener('click', function (e) {
      if (window.innerWidth > 768) {
        const target = document.querySelector(field.getAttribute('data-target'));
        if (target) {
          const offset = 220; // Desktop-Offset
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // MOBIL: Split-Card Klick-Logik (nur für das Öffnen und Schließen!)
  splitCard.addEventListener('click', function(e) {
    if (!isMobile()) return;

    // Wenn Card geschlossen: öffnen (egal wo geklickt)
    if (!splitCard.classList.contains('open-touch')) {
      splitCard.classList.add('open-touch');
      splitOpen = true;
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Wenn Card offen: Klicken außerhalb der Split-Felder schließt sie, Klick auf Split-Feld handled das Feld selbst!
    if (!e.target.classList.contains('split-field')) {
      splitCard.classList.remove('open-touch');
      splitOpen = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Split-Feld-Click handled NICHTS mehr hier!
  });

  // Split-Feld-Click: Mobil (wenn Card offen)
  document.querySelectorAll('.split-card .split-content .split-field').forEach(field => {
    field.addEventListener('click', function(e) {
      if (isMobile() && splitCard.classList.contains('open-touch')) {
        const target = document.querySelector(field.getAttribute('data-target'));
        if (target) {
          const offset = (window.innerWidth <= 600) ? 0 : 220;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
          });
        }
        splitCard.classList.remove('open-touch');
        splitOpen = false;
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // Klick außerhalb schließt die Split-Card (Mobil)
  document.addEventListener('click', function(e) {
    if (isMobile() && splitOpen && !splitCard.contains(e.target)) {
      splitCard.classList.remove('open-touch');
      splitOpen = false;
    }
  });

  // Beim Resize schließen
  window.addEventListener('resize', function() {
    if (!isMobile()) {
      splitCard.classList.remove('open-touch');
      splitOpen = false;
    }
  });
}



  // =========================================================
  // SOCIAL-CARD NAVIGATION (SCROLL MIT OFFSET)
  // =========================================================
  document.querySelectorAll('.social-card[data-target]').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(card.getAttribute('data-target'));
      if (target) {
        let offset;
        if (window.innerWidth <= 600) {
          if (target.id === 'm' || target.id === 'p') {
            offset = 22;
          } else {
            offset = 0;
          }
        } else {
          offset = 220;
        }
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    });
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = document.querySelector(card.getAttribute('data-target'));
        if (target) {
          let offset;
          if (window.innerWidth <= 600) {
            if (target.id === 'm' || target.id === 'p') {
              offset = 22;
            } else {
              offset = 0;
            }
          } else {
            offset = 220;
          }
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // =========================================================
  // EINZELBERATUNG-BUTTON: KONTAKT SCROLLEN
  // =========================================================
  document.querySelectorAll('.einzelberatung-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('kontakt');
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // =========================================================
  // HERO CTA → FAQ SCROLLEN
  // =========================================================
  const heroCtaBtn = document.getElementById('hero-cta');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('faq');
      if (target) {
        const offset = (window.innerWidth <= 600) ? 0 : 200;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    });
  }

  // =========================================================
  // SCROLL TO TOP BUTTON
  // =========================================================
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 200) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    scrollToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================
  // DATENSCHUTZ & IMPRESSUM ANZEIGEN / SCROLLEN
  // =========================================================
  const dsiBtn = document.getElementById('datenschutzImpressumBtn');
const dsiSection = document.getElementById('datenschutz-impressum');
if (dsiBtn && dsiSection) {
  dsiBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!dsiSection.classList.contains('visible')) {
      dsiSection.classList.add('visible');
      // NEU: nicht die Section, sondern die Karte scrollen
      const card = dsiSection.querySelector('.datenschutz-card, .impressum-card');
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        dsiSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      dsiSection.classList.remove('visible');
    }
  });
}


  // =========================================================
  // HEADER AUTO-HIDE wie auf der alten Website: ein-/ausblenden beim Scrollen
  // =========================================================
  const navbar = document.querySelector('.navbar');
  let prevScrollpos = window.pageYOffset;

  function headerAutoHideHandler() {
    if (!navbar) return;
    if (window.innerWidth > 1024) {
      navbar.style.top = "0";
      return;
    }
    const currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      navbar.style.top = "0";
    } else {
      navbar.style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
  }
  window.addEventListener('scroll', headerAutoHideHandler);
  window.addEventListener('resize', headerAutoHideHandler);

  // =========================================================
  // SCROLL DOWN BUTTON (Immer zur nächsten Section)
  // =========================================================
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const footer = document.querySelector('.footer');

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', function () {
      const sections = Array.from(document.querySelectorAll('.section'));
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth <= 600;
      const mobileOffsets = {
        'home': 50,
        'angebote': 40,
        's1': 18,
        's2': 18,
        's3': 18,
        'm': 18,
        'p': 18,
        'faq': 22,
        'sprechstundentermine': 14,
        'preise': 12,
        'kontakt': 10
      };
      const desktopOffset = 200;

      const nextSection = sections.find(section => {
        let offset = desktopOffset;
        if (isMobile && section.id && mobileOffsets.hasOwnProperty(section.id)) {
          offset = mobileOffsets[section.id];
        }
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
        return sectionTop > scrollY + 5;
      });

      if (nextSection) {
        let offset = desktopOffset;
        if (isMobile && nextSection.id && mobileOffsets.hasOwnProperty(nextSection.id)) {
          offset = mobileOffsets[nextSection.id];
        }
        const sectionTop = nextSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: sectionTop - offset,
          behavior: 'smooth'
        });
      }
    });
  }

  // =========================================================
  // SCROLLDOWN-BUTTON: Ausblenden wenn Footer ODER Datenschutz/Impressum sichtbar
  // =========================================================
  function updateScrollDownBtnVisibility() {
    if (!scrollDownBtn) return;
    if (dsiSection && dsiSection.classList.contains('visible')) {
      scrollDownBtn.style.display = 'none';
      return;
    }
    // Footer check handled by IntersectionObserver (s.u.)
    scrollDownBtn.style.display = '';
  }

  if (scrollDownBtn && footer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrollDownBtn.style.display = 'none';
          } else {
            updateScrollDownBtnVisibility();
          }
        });
      },
      {
        root: null,
        threshold: 0.01
      }
    );
    observer.observe(footer);
  }

  if (dsiBtn) {
    dsiBtn.addEventListener('click', function() {
      setTimeout(updateScrollDownBtnVisibility, 400);
    });
  }
  if (dsiSection) {
    const dsiObserver = new MutationObserver(updateScrollDownBtnVisibility);
    dsiObserver.observe(dsiSection, { attributes: true, attributeFilter: ['class'] });
  }
  updateScrollDownBtnVisibility();

});

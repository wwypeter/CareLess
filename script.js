var currentFetchController = null;

function initPage() {
  var navLinks = document.querySelectorAll('#nav-links a');
  navLinks.forEach(function(link) {
    link.classList.remove('active');
    if (new URL(link.href).pathname === window.location.pathname) {
      link.classList.add('active');
    }
  });
  if (window.innerWidth > 768) {
    var headerContent = document.querySelector('.header-content');
    var firstNavLink = document.querySelector('#nav-links a:first-of-type');
    var offsetLeft = firstNavLink.getBoundingClientRect().left;
    headerContent.style.marginLeft = offsetLeft + "px";

    var shift = 3;
    var marginAdjust = 20;
    var lastNavLink = document.querySelector('#nav-links a:last-of-type');
    var offsetRight = window.innerWidth - lastNavLink.getBoundingClientRect().right;
    var fadeText = document.getElementById('fadeText');
    if (fadeText) {
      fadeText.style.left = (offsetLeft - marginAdjust + shift) + "px";
      fadeText.style.right = (offsetRight - marginAdjust - shift) + "px";
      fadeText.style.transform = "translateY(-50%)";
    }
    var fadeImage = document.getElementById('fadeImage');
    if (fadeImage) {
      fadeImage.style.transition = "none";
      fadeImage.style.width = "calc(100% - " + ((offsetLeft + offsetRight) - (2 * marginAdjust)) + "px)";
      fadeImage.style.marginLeft = (offsetLeft - marginAdjust + shift) + "px";
      fadeImage.style.marginRight = (offsetRight - marginAdjust - shift) + "px";
    }
  }
}

function setupNavLinks() {
  var navLinks = document.querySelectorAll('#nav-links a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var url = link.getAttribute('href');
      loadPage(url);
      if (window.innerWidth <= 768) {
        document.getElementById('nav-links').style.display = "none";
      }
    });
  });
}

function loadPage(url) {
  if (currentFetchController) {
    currentFetchController.abort();
  }
  currentFetchController = new AbortController();
  fetch(url, { signal: currentFetchController.signal })
    .then(function(response) { return response.text(); })
    .then(function(html) {
      history.pushState({ url: url }, '', url);
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var newMain = doc.querySelector('main');
      if (newMain) {
        // Main-Inhalt ersetzen
        document.querySelector('main').innerHTML = newMain.innerHTML;
        // Titel aktualisieren
        document.title = doc.title;
        // Nach dem Austausch unerwünschte Inline-Styles entfernen,
        // außer wenn die Seite die Klasse "impressum" besitzt.
        if (!doc.body.classList.contains('impressum')) {
          document.querySelector('main').removeAttribute('style');
        }
        // Footer ersetzen, falls im neuen Dokument vorhanden
        var newFooter = doc.querySelector('footer');
        if (newFooter) {
          document.querySelector('footer').outerHTML = newFooter.outerHTML;
        }
        window.scrollTo(0, 0);
        initPage();
        setupNavLinks();
      }
      currentFetchController = null;
    })
    .catch(function(err) {
      if (err.name === 'AbortError') return;
      console.error('Error loading page:', err);
      currentFetchController = null;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  initPage();
  setupNavLinks();
});

window.addEventListener('popstate', function(event) {
  if (event.state && event.state.url) {
    loadPage(event.state.url);
  }
});

function toggleNav() {
  var navLinks = document.getElementById('nav-links');
  if (navLinks.style.display === "block") {
    navLinks.style.display = "none";
  } else {
    navLinks.style.display = "block";
  }
}

document.addEventListener('scroll', function() {
  var scrollY = window.scrollY;
  var threshold = 200;
  if (window.location.pathname.indexOf("0_pap.html") !== -1 ||
      window.location.pathname.indexOf("0_sap.html") !== -1 ||
      window.location.pathname.indexOf("index.html") !== -1 ||
      window.location.pathname.indexOf("0_kontakt.html") !== -1 ||
      window.location.pathname.indexOf("0_map.html") !== -1) {
    threshold = 200;
  }
  var image = document.getElementById('fadeImage');
  var text = document.getElementById('fadeText');
  var footer = document.getElementById('footer');
  var imageOpacity = 1 - Math.min(scrollY / threshold, 1);
  var textOpacity = Math.min(scrollY / threshold, 1);
  if (image) image.style.opacity = imageOpacity;
  
  // Bei mobilen Ansichten den Textfade deaktivieren:
  if (window.innerWidth <= 768) {
    if (text) text.style.opacity = 1;
    footer.style.bottom = scrollY >= threshold ? '0' : '-50px';
  } else {
    if (text) text.style.opacity = textOpacity;
    footer.style.bottom = scrollY >= threshold ? '0' : '-60px';
  }
});

window.addEventListener('resize', function() {
  initPage();
});



document.addEventListener("DOMContentLoaded", function () {
    const languageSelector = document.getElementById("languageSelector");

    // --- NEW: flag to prevent animation on first load ---
    let isFirstLoad = true;

    function getDynamicLanguage() {
        const supportedLanguages = ['fa', 'en', 'ru', 'fr', 'ar', 'pl', 'ja', 'zh'];
        let browserLang = navigator.language || navigator.userLanguage;
        browserLang = browserLang.substring(0, 2);
        return supportedLanguages.includes(browserLang) ? browserLang : 'en';
    }

    function changeLanguage(language, animate = true) {
        fetch(`langs/${language}.json`)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load langs/${language}.json`);
                return response.json();
            })
            .then(data => {
                document.querySelectorAll("[data-key]").forEach(element => {
                    const key = element.getAttribute("data-key");
                    const newText = data[key];
                    if (!newText) return;

                    if (element.tagName.toLowerCase() === 'title') {
                        document.title = newText;
                    } else {
                        // --- Only animate if allowed ---
                        if (animate) {
                            element.style.transition = "opacity 0.6s ease";
                            element.style.opacity = "0";
                            setTimeout(() => {
                                element.innerText = newText;
                                element.style.opacity = "1";
                            }, 600);
                        } else {
                            // Instant change, no animation
                            element.innerText = newText;
                        }
                    }
                });
            })
            .catch(error => console.error("Error loading language file:", error));
    }

    // INITIAL LOAD without animation
    const detectedLanguage = getDynamicLanguage();
    changeLanguage(detectedLanguage, false);   // ← animation disabled here
    languageSelector.value = detectedLanguage;

    // MANUAL CHANGE with animation
    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value, true);      // ← animation enabled here
    });
});

(function() {
  // 1. Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
  .transition-overlay {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:black;
    opacity:1;
    pointer-events:none;
    transition: opacity 0.5s;
    z-index:9999;
  }
  .transition-overlay.active {
    opacity:1;
    pointer-events:all;
  }
  .transition-overlay.fade-out {
    opacity:0;
  }
  `;
  document.head.appendChild(style);

  // 2. Inject overlay HTML
  const overlay = document.createElement('div');
  overlay.className = 'transition-overlay';
  overlay.id = 'overlay';
  document.body.appendChild(overlay);

  // 3. Fade-in on page load
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => overlay.classList.add('fade-out'), 10);
  });

  // 4. Fade-out on link click
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.href;
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    e.preventDefault();
    overlay.classList.remove('fade-out'); // fade back in
    overlay.classList.add('active');
    setTimeout(() => window.location = href, 500); // match transition duration
  });
})();

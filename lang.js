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

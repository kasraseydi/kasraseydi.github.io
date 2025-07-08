document.addEventListener("DOMContentLoaded", function () {
    const languageSelector = document.getElementById("languageSelector");

    function getDynamicLanguage() {
        const supportedLanguages = ['fa', 'en', 'ru', 'fr', 'ar', 'pl', 'ja', 'zh'];
        let browserLang = navigator.language || navigator.userLanguage;
        browserLang = browserLang.substring(0, 2);
        return supportedLanguages.includes(browserLang) ? browserLang : 'en';
    }

    function changeLanguage(language) {
        fetch(`langs/${language}.json`) // Updated path to reference the "langs" folder
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load langs/${language}.json`);
                }
                return response.json();
            })
            .then(data => {
    document.querySelectorAll("[data-key]").forEach(element => {
        const key = element.getAttribute("data-key");
        const newText = data[key];
        if (!newText) return;

        if (element.tagName.toLowerCase() === 'title') {
            document.title = newText; // set the document title directly
        } else {
            element.style.transition = "opacity 0.6s ease";
            element.style.opacity = "0";
            setTimeout(() => {
                element.innerText = newText;
                element.style.opacity = "1";
            }, 600);
        }
    });
})

            .catch(error => console.error("Error loading language file:", error));
    }

    // Detect and apply language on page load
    const detectedLanguage = getDynamicLanguage();
    changeLanguage(detectedLanguage);
    languageSelector.value = detectedLanguage;

    // Apply fade effect when changing languages manually
    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value);
    });
});
// Inject menu HTML automatically
document.body.insertAdjacentHTML("beforeend", `
<div id="custom-menu" class="context-menu hidden">

  <div class="item" data-action="copy"><i class="bi bi-clipboard2"></i> Copy</div>
  <div class="item disabled" data-disabled="copy"><i class="bi bi-exclamation-lg"></i> Select a text to Copy</div>

  <div class="item" data-action="search"><i class="bi bi-search"></i> Search</div>
  <div class="item disabled" data-disabled="search"><i class="bi bi-exclamation-lg"></i> Select a text to Search</div>

  <div class="item" data-action="select"><i class="bi bi-input-cursor-text"></i> Select All</div>
  <div class="item" data-action="save"><i class="bi bi-floppy"></i> Save Image</div>

</div>
`);

const menu = document.getElementById("custom-menu");

const btnCopy = menu.querySelector('[data-action="copy"]');
const disCopy = menu.querySelector('[data-disabled="copy"]');

const btnSearch = menu.querySelector('[data-action="search"]');
const disSearch = menu.querySelector('[data-disabled="search"]');

const btnSelect = menu.querySelector('[data-action="select"]');
const btnSave = menu.querySelector('[data-action="save"]');

let targetElement = null;

// Light-follow effect
menu.addEventListener("mousemove", (e) => {
    const rect = menu.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    menu.style.setProperty("--mx", x + "px");
    menu.style.setProperty("--my", y + "px");
});

// Smooth closing animation
document.addEventListener("click", (e) => {
    if (!menu.classList.contains("show")) return;

    menu.classList.remove("show");
    menu.classList.add("hiding");

    setTimeout(() => {
        menu.classList.remove("hiding");
    }, 180); // matches CSS animation
});

function closeMenu() {
    if (!menu.classList.contains("show")) return;

    menu.classList.remove("show");
    menu.classList.add("hiding");

    setTimeout(() => {
        menu.classList.remove("hiding");
        menu.style.opacity = 0;     // stays invisible
        menu.style.pointerEvents = "none";
    }, 200); // match CSS duration
}

document.addEventListener("click", closeMenu);

menu.addEventListener("mouseleave", () => {
    menu.style.setProperty("--mx", "-9999px");
    menu.style.setProperty("--my", "-9999px");
});



document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    targetElement = e.target;

    // Reset state before showing animation
    menu.classList.remove("show");

    // Position menu immediately
    menu.style.top = e.clientY + "px";
    menu.style.left = e.clientX + "px";

    // Force reflow so the animation restarts cleanly
    void menu.offsetWidth;

    // Show with animation
    menu.classList.add("show");

    const selectedText = window.getSelection().toString().trim();
    const isImage = targetElement.tagName === "IMG";

    // COPY
    if (selectedText.length > 0) {
        btnCopy.style.display = "block";
        disCopy.style.display = "none";
    } else {
        btnCopy.style.display = "none";
        disCopy.style.display = "block";
    }

    // SEARCH
    if (selectedText.length > 0) {
        btnSearch.style.display = "block";
        disSearch.style.display = "none";
    } else {
        btnSearch.style.display = "none";
        disSearch.style.display = "block";
    }

    // SELECT ALL is always visible
    btnSelect.style.display = "block";

    // IMAGE SAVE
    btnSave.style.display = isImage ? "block" : "none";

    // Position menu
    menu.style.top = e.clientY + "px";
    menu.style.left = e.clientX + "px";
    menu.classList.add("show");
});

document.addEventListener("click", () => {
    menu.classList.remove("show");
});

menu.addEventListener("click", async (e) => {
    const action = e.target.dataset.action;
    if (!action || e.target.classList.contains("disabled")) return;

    if (action === "copy") {
        const selected = window.getSelection().toString();
        await navigator.clipboard.writeText(selected);
    }

    if (action === "search") {
        const selected = window.getSelection().toString();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(selected)}`, "_blank");
    }

    if (action === "select") {
        const range = document.createRange();
        range.selectNodeContents(document.body);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    if (action === "save" && targetElement.tagName === "IMG") {
        const a = document.createElement("a");
        a.href = targetElement.src;
        a.download = "image";
        a.click();
    }

    menu.classList.remove("show");
});

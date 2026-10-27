const text = "People still have personal websites?? In 2026?";
const element = document.getElementById("typed-text");
const navigationType = performance.getEntriesByType("navigation")[0]?.type;
const typedStateKey = "home-typed-text-shown";
let index = 0;

if (navigationType === "reload") {
  sessionStorage.removeItem(typedStateKey);
}

const shouldAnimate = !sessionStorage.getItem(typedStateKey);

if (shouldAnimate) {
  sessionStorage.setItem(typedStateKey, "true");
} else {
  element.textContent = text;
}

function type() {
  if (index >= text.length) {
    return;
  }

  element.textContent += text[index];
  index += 1;
  setTimeout(type, 65);
}

if (shouldAnimate) {
  type();
}
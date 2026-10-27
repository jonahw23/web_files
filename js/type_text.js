const text = "People still have personal websites?? In 2026?";
const element = document.getElementById("typed-text");
let index = 0;

function type() {
  if (index >= text.length) {
    return;
  }

  element.textContent += text[index];
  index += 1;
  setTimeout(type, 65);
}

type();
const themeStylesheet = document.getElementById("theme");
const switchThemeButton = document.getElementById("switch-theme");
const homeHeading = document.getElementById("typed-text");
const homeMain = homeHeading?.parentElement;
const themeCount = 25;
const themePhrases = [
  "Still not impressed",
  "I want more website",
  "Let's see it in another color",
  "Meh, could be cleaner",
  "I hate websites",
  "I hate YOUR website",
  "Seen it before",
  "THIS is the UI you chose?",
  "Not exactly inspired",
  "Styles are for losers anyways",
  "Feels... derivative",
  "I can see why you stuck with the inital theme",
];
let homeButtonPlaceholder;
let homeHero;

function isTheme(value) {
  return /^style(?:[1-9]|1\d|2[0-5])$/.test(value);
}

function enableHomeHero() {
  if (!homeHeading || !homeMain || !switchThemeButton || homeHero) {
    return;
  }

  homeHero = document.createElement("section");
  homeHero.className = "home-hero";
  homeButtonPlaceholder = switchThemeButton.parentNode.insertBefore(
    document.createComment("theme button position"),
    switchThemeButton
  );
  homeHeading.before(homeHero);
  homeHero.append(homeHeading, switchThemeButton);
}

function createThemeQueue(currentTheme) {
  const queue = Array.from({ length: themeCount }, (_, index) => `style${index + 1}`)
    .filter((theme) => theme !== currentTheme);

  for (let index = queue.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
  }

  return queue;
}

function getNextTheme(currentTheme) {
  const savedQueue = localStorage.getItem("themeQueue");
  let queue = savedQueue
    ? savedQueue.split(",").filter((theme, index, themes) =>
        isTheme(theme) && theme !== currentTheme && themes.indexOf(theme) === index
      )
    : [];

  if (queue.length === 0) {
    queue = createThemeQueue(currentTheme);
  }

  const nextTheme = queue.shift();
  localStorage.setItem("themeQueue", queue.join(","));
  return nextTheme;
}

const savedTheme = localStorage.getItem("theme");
if (isTheme(savedTheme)) {
  themeStylesheet.href = `css/${savedTheme}.css`;
  enableHomeHero();
}

if (switchThemeButton) {
  switchThemeButton.addEventListener("click", () => {
    const currentTheme = themeStylesheet.getAttribute("href").match(/style\d+/)?.[0] ?? "style0";
    const nextTheme = getNextTheme(currentTheme);
    const phraseIndex = Number(localStorage.getItem("themePhraseIndex")) || 0;

    themeStylesheet.href = `css/${nextTheme}.css`;
    localStorage.setItem("theme", nextTheme);
    localStorage.setItem("themePhraseIndex", String((phraseIndex + 1) % themePhrases.length));
    switchThemeButton.textContent = themePhrases[phraseIndex % themePhrases.length];
    enableHomeHero();
  });
}

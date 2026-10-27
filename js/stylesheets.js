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
  "Real developers use markdown",
  "I hate websites",
  "I hate YOUR website",
  "Seen it before",
  "THIS is the UI you chose?",
  "Not exactly inspired",
  "Nice CSS bro",
  "Styles are for bums anyways",
  "Feels... derivative",
  "Unstyled was better",
];
const themeStylesheetLoads = new Map();
const preloadedThemeStylesheets = new Map();
let homeButtonPlaceholder;
let homeHero;

// check whether a style is within the 1-25 range of completed styles
function isTheme(value) {
  return /^style(?:[1-9]|1\d|2[0-5])$/.test(value);
}

// add a hero before the theme-switch button
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

// make a len 25 queue from the styles, then randomly shuffle each element
function createThemeQueue(currentTheme) {
  const queue = Array.from({ length: themeCount }, (_, index) => `style${index + 1}`)
    .filter((theme) => theme !== currentTheme);

  for (let index = queue.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
  }

  return queue;
}

// get the next theme from the queue, or make a new queue if empty
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

// try to load the last theme, set it as current
const savedTheme = localStorage.getItem("theme");
if (isTheme(savedTheme)) {
  themeStylesheet.href = `/css/${savedTheme}.css`;
  enableHomeHero();
}

if (switchThemeButton) {
  // try to load stored label onto the button text
  const savedButtonLabel = localStorage.getItem("themeButtonLabel");
  if (themePhrases.includes(savedButtonLabel)) {
    switchThemeButton.textContent = savedButtonLabel;
  }

  let activeTheme = themeStylesheet.getAttribute("href").match(/style\d+/)?.[0] ?? "style0";
  let activeThemeStylesheet = themeStylesheet;

  // for each theme, store it as a stylesheet for quick access
  for (let index = 1; index <= themeCount; index += 1) {
    const theme = `style${index}`;
    if (theme === activeTheme) {
      continue;
    }

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.media = "not all";
    stylesheet.href = `/css/${theme}.css`;
    const loaded = new Promise((resolve) => {
      stylesheet.addEventListener("load", () => resolve(true), { once: true });
      stylesheet.addEventListener("error", () => resolve(false), { once: true });
    });
    document.head.append(stylesheet);
    themeStylesheetLoads.set(theme, loaded);
    preloadedThemeStylesheets.set(theme, stylesheet);
  }

  // when the switch button is clicked, get the next theme from the queue,
  // access its saved stylesheet above, and enable it as the active stylesheet
  switchThemeButton.addEventListener("click", async () => {
    const nextTheme = getNextTheme(activeTheme);
    const phraseIndex = Number(localStorage.getItem("themePhraseIndex")) || 0;

    switchThemeButton.disabled = true;
    try {
      const stylesheetLoaded = await themeStylesheetLoads.get(nextTheme);
      if (!stylesheetLoaded) {
        throw new Error(`Unable to load /css/${nextTheme}.css`);
      }

      const nextThemeStylesheet = preloadedThemeStylesheets.get(nextTheme);
      nextThemeStylesheet.media = "all";
      activeThemeStylesheet.media = "not all";
      activeThemeStylesheet = nextThemeStylesheet;
      activeTheme = nextTheme;
      localStorage.setItem("theme", nextTheme);
      localStorage.setItem("themePhraseIndex", String((phraseIndex + 1) % themePhrases.length));
      switchThemeButton.textContent = themePhrases[phraseIndex % themePhrases.length];
      localStorage.setItem("themeButtonLabel", switchThemeButton.textContent);
      enableHomeHero();
    } catch (error) {
      console.error(error);
    } finally {
      switchThemeButton.disabled = false;
    }
  });
}

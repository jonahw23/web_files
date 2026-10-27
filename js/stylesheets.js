const themeStylesheet = document.getElementById("theme");
const switchThemeButton = document.getElementById("switch-theme");
const themeCount = 30;
let currentTheme = 0;

switchThemeButton.addEventListener("click", () => {
  let nextTheme;

  do {
    nextTheme = Math.floor(Math.random() * themeCount) + 1;
  } while (nextTheme === currentTheme);

  currentTheme = nextTheme;
  themeStylesheet.href = `css/style${currentTheme}.css`;
});
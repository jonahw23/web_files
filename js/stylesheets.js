const themeStylesheet = document.getElementById("theme");
const switchThemeButton = document.getElementById("switch-theme");
const savedTheme = localStorage.getItem("theme");
const homeHeading = document.getElementById("typed-text");
const homeMain = homeHeading?.parentElement;
let homeButtonPlaceholder;
let homeHero;

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

function disableHomeHero() {
  if (!homeHero || !homeHeading || !switchThemeButton) {
    return;
  }

  homeHero.before(homeHeading);
  homeHero.remove();
  homeHero = undefined;
}

if (savedTheme === "style1") {
  themeStylesheet.href = "css/style1.css";
  enableHomeHero();

  if (switchThemeButton) {
    switchThemeButton.textContent = "Restore original style";
  }
}

if (switchThemeButton) {
  switchThemeButton.addEventListener("click", () => {
    const useNewStyle = themeStylesheet.getAttribute("href") !== "css/style1.css";
    const nextTheme = useNewStyle ? "style1" : "style0";

    themeStylesheet.href = `css/${nextTheme}.css`;
    localStorage.setItem("theme", nextTheme);

    if (useNewStyle) {
      enableHomeHero();
    } else {
      disableHomeHero();
      if (homeButtonPlaceholder) {
        homeButtonPlaceholder.replaceWith(switchThemeButton);
        homeButtonPlaceholder = undefined;
      }
    }

    switchThemeButton.textContent = useNewStyle
      ? "Restore original style"
      : "You call this a website?";
  });
}
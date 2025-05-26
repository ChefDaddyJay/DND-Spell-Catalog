const themeTab = document.querySelector(".theme-tab");
const themeLight = document.querySelector(".theme-buttons .light");
const themeDark = document.querySelector(".theme-buttons .dark");
const themeToggle = document.querySelector(".theme-tab i");

root.setAttribute("data-theme", localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click", () => {
  if (themeTab.classList.contains("open")) {
    themeTab.classList.remove("open");
  } else {
    themeTab.classList.add("open");
  }
});

themeLight.addEventListener("click", () => {
  root.dataset.theme = "light";
  localStorage.setItem("theme", "light");
  themeTab.classList.remove("open");
});

themeDark.addEventListener("click", () => {
  root.dataset.theme = "dark";
  localStorage.setItem("theme", "dark");
  themeTab.classList.remove("open");
});

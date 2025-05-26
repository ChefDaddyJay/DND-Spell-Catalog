const myHeaders = new Headers();
const api = "https://www.dnd5eapi.co";
const spellsUrl = "/api/2014/spells/?level=0";
const spellList = document.querySelector(".spells");
const spellListControls = document.querySelector(".spell-list-controls");
const main = document.querySelector(".site-wrapper");
const themeTab = document.querySelector(".theme-tab");
const themeLight = document.querySelector(".theme-buttons .light");
const themeDark = document.querySelector(".theme-buttons .dark");
const themeToggle = document.querySelector(".theme-tab i");
const root = document.documentElement;
let pageContent = [];

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

function buildSpellBlock(spell) {
  const spellBlock = document.createElement("div");
  const fav = document.createElement("div");
  const name = document.createElement("h3");
  const lvl = document.createElement("div");
  const school = document.createElement("div");

  spellBlock.classList.add("spell-block");
  spellBlock.setAttribute("data-toggle", spell.index);

  fav.classList.add("fav");
  fav.innerHTML = '<i class="fas fa-star"></i>';

  name.innerText = spell.name;

  lvl.classList.add("spell-level");
  lvl.innerText = `Lv. ${spell.level}`;

  school.classList.add("spell-school");
  school.classList.add("round-pill");
  school.innerText = spell.school.name;

  spellBlock.addEventListener("click", () => {
    const modal = document.getElementById(spell.index) || buildModal(spell);
    setTimeout(() => {
      if (modal.classList.contains("open")) {
        modal.classList.remove("open");
      } else {
        modal.classList.add("open");
      }
    }, 100);
  });

  spellBlock.append(fav, name, lvl, school);
  return spellBlock;
}

async function fetchSpell(spell) {
  try {
    const response = await fetch(api + spell.url);
    if (response.ok) {
      const result = await response.text();
      return JSON.parse(result);
    } else {
      console.log(response.status);
      return null;
    }
  } catch (error) {
    console.log("Fetch error:", error);
    return null;
  }
}

myHeaders.append("Accept", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(api + spellsUrl, requestOptions)
  .then((response) => response.text())
  .then((result) => JSON.parse(result))
  .then((data) => Promise.all(data.results.map((res) => fetchSpell(res))))
  .then((spells) => {
    pageContent = spells.map((spell) => buildSpellBlock(spell));
    const pagination = new Pagination(spellList, spellListControls);
    const filters = new Filters(
      spells,
      pagination,
      document.querySelector(".class-filters"),
      document.querySelector(".level-filter")
    );

    filters.render();
    pagination.render();
  })
  .catch((error) => console.error(error));

const headers = new Headers();
const api = "https://www.dnd5eapi.co";
const spellsUrl = "/api/2014/spells/";
const spellList = document.querySelector(".spells");
const spellListControls = document.querySelector(".spell-list-controls");
const schoolFilters = document.querySelector(".school-filters");
const levelFilter = document.querySelector(".level-filter");
const filtersMenu = document.querySelector(".filters-menu");
const sidebar = document.querySelector(".sidebar");
const favorites = document.querySelector(".favorites-filter");
const searchbar = document.querySelector(".searchbar");
const main = document.querySelector(".site-wrapper");
const root = document.documentElement;
const media = {
  isPhone: window.matchMedia("(max-width: 767px)").matches,
  isTablet: window.matchMedia("(max-width: 1023px)").matches,
  isDesktop: window.matchMedia("(min-width: 1024px)").matches,
  checkMedia: () => {
    this.isPhone = window.matchMedia("(max-width: 767px)").matches;
    this.isTablet = window.matchMedia("(max-width: 1023px)").matches;
    this.isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  },
};

async function fetchSpell(spellIndex) {
  try {
    const response = await fetch(`${api}${spellsUrl}${spellIndex}`);
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

headers.append("Accept", "application/json");

const requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

filtersMenu.addEventListener("click", () => {
  if (filtersMenu.classList.contains("open")) {
    filtersMenu.classList.remove("open");
    sidebar.classList.remove("open");
  } else {
    filtersMenu.classList.add("open");
    sidebar.classList.add("open");
  }
});
const filters = new Filters(
  `${api}${spellsUrl}`,
  spellList,
  spellListControls,
  schoolFilters,
  levelFilter,
  favorites,
  searchbar
);
filters.fetchContent().then(() => {
  filters.render();
  window.addEventListener("change", () => {
    media.checkMedia();
    filters.render();
  });
});

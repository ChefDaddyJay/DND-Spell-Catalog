const myHeaders = new Headers();
const api = "https://www.dnd5eapi.co";
const spellsUrl = "/api/2014/spells/";
const spellList = document.querySelector(".spells");
const spellListControls = document.querySelector(".spell-list-controls");
const schoolFilters = document.querySelector(".school-filters");
const levelFilter = document.querySelector(".level-filter");
const favorites = document.querySelector(".favorites-filter");
const main = document.querySelector(".site-wrapper");
const root = document.documentElement;

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

myHeaders.append("Accept", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

const filters = new Filters(
  `${api}${spellsUrl}`,
  spellList,
  spellListControls,
  schoolFilters,
  levelFilter,
  favorites
);
filters.fetchContent().then(() => filters.render());

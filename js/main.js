const myHeaders = new Headers();
const api = "https://www.dnd5eapi.co";
const spellsUrl = "/api/2014/spells/";
const spellList = document.querySelector(".spells");
const spellListControls = document.querySelector(".spell-list-controls");
const schoolFilters = document.querySelector(".school-filters");
const levelFilter = document.querySelector(".level-filter");
const main = document.querySelector(".site-wrapper");
const root = document.documentElement;

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

const filters = new Filters(
  `${api}${spellsUrl}`,
  spellList,
  spellListControls,
  schoolFilters,
  levelFilter
);
filters.fetchContent().then(() => filters.render());

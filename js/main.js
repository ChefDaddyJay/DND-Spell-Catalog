const myHeaders = new Headers();
const api = "https://www.dnd5eapi.co";
const spellsUrl = "/api/2014/spells/";
const spellList = document.querySelector(".spells");
const spellsPerPage = 6;
const currentSpells = {};
const main = document.querySelector(".site-wrapper");
const themeTab = document.querySelector(".theme-tab");
const themeOptions = document.querySelectorAll("[data-theme]");
const themeToggle = document.querySelector(".theme-tab i");

themeToggle.addEventListener("click", () => {
  if (themeTab.classList.contains("open")) {
    themeTab.classList.remove("open");
  } else {
    themeTab.classList.add("open");
  }
});

async function buildSpellBlock(spell) {
  return fetch(api + spell.url)
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .then((spellData) => {
      const spellBlock = document.createElement("div");
      const fav = document.createElement("div");
      const name = document.createElement("h3");
      const lvl = document.createElement("div");
      const school = document.createElement("div");

      spellBlock.classList.add("spell-block");
      spellBlock.setAttribute("data-toggle", spellData.index);

      fav.classList.add("fav");
      fav.innerHTML = '<i class="fas fa-star"></i>';

      name.innerText = spellData.name;

      lvl.classList.add("spell-level");
      lvl.innerText = `Lv. ${spellData.level}`;

      school.classList.add("spell-school");
      school.classList.add("round-pill");
      school.innerText = spellData.school.name;

      spellBlock.addEventListener("click", () => {
        const modal =
          document.getElementById(spell.index) || buildModal(spellData);
        setTimeout(() => {
          if (modal.classList.contains("open")) {
            modal.classList.remove("open");
          } else {
            modal.classList.add("open");
          }
        }, 100);
      });

      spellBlock.append(fav, name, lvl, school);
      currentSpells[spell.index] = spellData;
      return spellBlock;
    })
    .catch((error) => console.error(error));
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
  .then((data) => {
    const spells = data.results;
    const spellBlocks = [];
    for (let i = 0; i < spellsPerPage; i++) {
      spellBlocks.push(buildSpellBlock(spells[i]));
    }

    return Promise.all(spellBlocks);
  })
  .then((blocks) => {
    blocks.forEach((block) => spellList.appendChild(block));
  })
  .catch((error) => console.error(error));

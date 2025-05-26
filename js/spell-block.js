class SpellBlock {
  constructor(spell) {
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
    this.element = spellBlock;
    this.spell = spell;
  }
}

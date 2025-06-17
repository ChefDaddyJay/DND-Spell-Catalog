class SpellBlock {
  constructor(spell, filters) {
    this.spell = spell;
    this.filters = filters;
    this.element = document.createElement("div");
    this.buildElement();
  }
  buildElement() {
    this.element.innerHTML = "";
    const fav = document.createElement("div");
    const name = document.createElement("h3");
    const lvl = document.createElement("div");
    const school = document.createElement("div");

    this.element.classList.add("spell-block");
    this.element.setAttribute("data-toggle", this.spell.index);

    fav.classList.add("fav");
    fav.innerHTML = this.filters.isFavorite(this.spell.index)
      ? '<i class="fas fa-star"></i>'
      : '<i class="fa-regular fa-star"></i>';
    fav.addEventListener("click", () => {
      this.filters.updateFavorites(this.spell.index);
      this.buildElement();
    });

    name.innerText = this.spell.name;

    lvl.classList.add("spell-level");
    lvl.innerText = `Lv. ${this.spell.level}`;

    school.classList.add("spell-school");
    school.classList.add("round-pill");
    school.innerText = this.spell.school.name;

    this.element.addEventListener("click", () => {
      const modal =
        document.getElementById(this.spell.index) || buildModal(this.spell);
      setTimeout(() => {
        if (modal.classList.contains("open")) {
          modal.classList.remove("open");
        } else {
          modal.classList.add("open");
        }
      }, 100);
    });

    this.element.append(fav, name);
    if (!media.isPhone) this.element.appendChild(lvl);
    this.element.appendChild(school);
  }
}

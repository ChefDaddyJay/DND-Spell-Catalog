class SpellBlock {
  constructor(spell, filters) {
    this.spell = spell;
    this.filters = filters;
    this.element = createElement("div", ["spell-block"]);
    this.element.setAttribute("data-toggle", this.spell.index);
    this.modal = new Modal(main, this.spell);
    this.buildElement();
  }
  buildElement() {
    this.element.innerHTML = "";
    const fav = createElement("div", ["fav"]);
    const name = createElement("h3", [], this.spell.name);
    const lvl = createElement(
      "div",
      ["spell-level"],
      `Lv. ${this.spell.level}`
    );
    const school = createElement(
      "div",
      ["spell-school", "round-pill"],
      this.spell.school.name
    );

    fav.innerHTML = this.filters.isFavorite(this.spell.index)
      ? '<i class="fas fa-star"></i>'
      : '<i class="fa-regular fa-star"></i>';
    fav.addEventListener("click", (e) => {
      this.filters.updateFavorites(
        this.spell.index,
        e.target.classList.contains("fas")
      );
      this.buildElement();
    });

    this.element.addEventListener("click", () => {
      setTimeout(() => {
        if (this.modal.isOpen()) {
          this.modal.close();
        } else {
          this.modal.open();
        }
      }, 100);
    });

    this.element.append(fav, name);
    if (!media.isPhone) this.element.appendChild(lvl);
    this.element.appendChild(school);
  }
}

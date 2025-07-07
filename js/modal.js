class Modal {
  constructor(container, spell) {
    this.container = container;
    this.spell = spell;
    this.element = this.#buildElement();
  }
  isOpen() {
    return this.element.classList.contains("open");
  }
  open() {
    this.element.classList.add("open");
    this.render();
  }
  close(event) {
    if (!document.body.contains(this.element)) return;
    if (
      event.key === "Escape" ||
      event.target === this.element ||
      event.target.classList.contains("fa-times")
    ) {
      this.element.classList.remove("open");
      this.container.removeChild(this.element);
      document.removeEventListener("click", this.close.bind(this));
      document.removeEventListener("keydown", this.close.bind(this));
    }
  }
  #buildElement() {
    const modal = createElement("div", ["modal"], "", this.spell.index);
    const body = createElement("div", ["modal-body"]);
    const close = createElement("i", ["fas", "fa-times"]);
    const header = createElement("div", ["modal-header"]);
    const name = createElement("h2", [], this.spell.name);
    const levelAndSchool = createElement("div", ["level-and-school"]);
    const level = createElement("p", [], `Lv. ${this.spell.level}`);
    const school = createElement(
      "div",
      ["spell-school", "round-pill"],
      this.spell.school.name
    );
    const divider = createElement("div", ["horizontal-divider"]);
    const descWrapper = createElement("div", ["desc-wrapper"]);
    const desc = createElement("div", ["spell-description"]);
    const statsTable = createElement("table", ["spell-stats"]);

    close.addEventListener("click", this.close.bind(this));

    this.spell.desc.forEach((line) =>
      desc.appendChild(createElement("p", [], line))
    );
    spellStats.forEach((stat, i) => {
      const row = createElement("tr");
      const label = createElement("th", [], spellStatLabels[i]);
      const data = createElement("td");

      row.appendChild(label);
      if (this.spell[stat]) {
        switch (spellStatLabels[i]) {
          case "Damage":
            this.#buildDamageStat(
              this.spell[stat],
              Object.keys(
                this.spell[stat].damage_at_slot_level ||
                  this.spell[stat].damage_at_character_level
              )[0],
              data
            );
            break;
          case "Classes":
            data.innerText = this.spell[stat].map((c) => c.name).join(", ");
            break;
          default:
            data.innerText = this.spell[stat];
        }
        row.appendChild(data);
        statsTable.appendChild(row);
      }
    });

    levelAndSchool.append(level, school);
    header.append(name, levelAndSchool);
    descWrapper.appendChild(desc);
    body.append(
      close,
      header,
      divider,
      descWrapper,
      divider.cloneNode(),
      statsTable
    );
    header.append(name, levelAndSchool);
    modal.appendChild(body);

    document.addEventListener("click", this.close.bind(this));
    document.addEventListener("keydown", this.close.bind(this));

    return modal;
  }
  #buildDamageStat(stat, slot, cell) {
    const controls = createElement("div", ["slot-controls"]);
    const minus = createElement("div", ["level-control"]);
    const current = createElement("div", ["current-level"], slot);
    const plus = createElement("div", ["level-control"]);
    const dmg = createElement(
      "p",
      [],
      stat.damage_at_slot_level
        ? stat.damage_at_slot_level[slot]
        : stat.damage_at_character_level[slot]
    );

    cell.classList.add("damage");
    minus.innerHTML = `<i class="fa fa-minus"></i>`;
    plus.innerHTML = `<i class="fa fa-plus"></i>`;

    controls.append(minus, current, plus);
    cell.append(controls, dmg);
  }
  render() {
    this.container.appendChild(this.element);
    this.element.classList.add("open");
  }
}

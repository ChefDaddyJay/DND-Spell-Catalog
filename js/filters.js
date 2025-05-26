class Filters {
  schoolsList = [
    "Evocation",
    "Conjuration",
    "Divination",
    "Abjuration",
    "Enchantment",
    "Necromancy",
    "Transmutation",
    "Illusion",
  ];
  constructor(
    srcURL,
    contentContainer,
    pageControls,
    schoolControls,
    levelConrols,
    activeLevel = 0,
    favorites = []
  ) {
    this.src = srcURL;
    this.pagination = new Pagination(contentContainer, pageControls);
    this.schoolControls = schoolControls;
    this.levelControls = levelConrols;
    this.activeLevel = activeLevel;
    this.activeFilter = "";
    this.schools = {};
    this.schoolsList.forEach((school) => (this.schools[school] = 0));

    this.favorites = favorites;
    this.filterElements = [];
  }
  setActiveFilter(school) {
    const elm = this.filterElements.find(
      (elm) => elm.school === school
    ).element;
    if (this.activeFilter === school) {
      elm.classList.remove("active");
      this.activeFilter = "";
    } else {
      const active = this.filterElements.find(
        (elm) => elm.school === this.activeFilter
      )?.element;
      active?.classList.remove("active");
      elm.classList.add("active");
      this.activeFilter = school;
    }
    this.fetchContent().then(() => this.pagination.render());
  }
  setActiveLevel(lvl) {
    if (lvl < 0 || lvl > 9) return;

    this.activeLevel = lvl;
    this.fetchContent().then(() => {
      this.renderSchoolsList();
      this.renderLevelFilter();
      this.pagination.render();
    });
  }
  getSchoolCounts() {
    this.schoolsList.forEach((school) => (this.schools[school] = 0));
    this.pagination.pageContent.forEach(
      (block) => this.schools[block.spell.school.name]++
    );
  }
  buildLevelControl(dir) {
    const control = document.createElement("div");
    control.classList.add("level-control");
    control.appendChild(faIcon(dir));
    control.addEventListener("click", () => {
      this.setActiveLevel(
        dir === "minus" ? this.activeLevel - 1 : this.activeLevel + 1
      );
    });
    return control;
  }
  render() {
    this.renderSchoolsList();
    this.renderLevelFilter();
    this.pagination.render();
  }
  renderSchoolsList() {
    this.schoolControls.innerHTML = "";
    Object.entries(this.schools).forEach((school) => {
      const filter = document.createElement("li");
      const name = document.createElement("p");
      name.innerText = school[0];
      const num = document.createElement("p");
      num.innerText = `(${school[1]})`;
      filter.addEventListener("click", () => this.setActiveFilter(school[0]));
      filter.append(name, num);
      this.filterElements.push({
        school: school[0],
        element: filter,
      });
      this.schoolControls.appendChild(filter);
    });
  }
  renderLevelFilter() {
    const currentLevel = document.createElement("div");
    currentLevel.classList.add("current-level");
    currentLevel.innerText = this.activeLevel;

    this.levelControls.innerHTML = "";
    this.levelControls.append(
      this.buildLevelControl("minus"),
      currentLevel,
      this.buildLevelControl("plus")
    );
  }
  renderFavoritesButton() {}

  async fetchContent() {
    const response = await fetch(
      `${this.src}?level=${this.activeLevel}&school=${this.activeFilter}`,
      requestOptions
    );
    const text = await response.text();
    const results = JSON.parse(text).results;
    const spells = await Promise.all(results.map((res) => fetchSpell(res)));
    this.pagination.updateContent(spells.map((spell) => new SpellBlock(spell)));
    this.getSchoolCounts();
  }
}

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
    favoritesContainer,
    activeLevel = 0
  ) {
    this.src = srcURL;
    this.pagination = new Pagination(contentContainer, pageControls);
    this.schoolControls = schoolControls;
    this.levelControls = levelConrols;
    this.favoritesContainer = favoritesContainer;
    this.activeLevel = activeLevel;
    this.activeFilter = "";
    this.activeFavorites = false;
    this.schools = {};
    this.schoolsList.forEach((school) => (this.schools[school] = 0));
    this.readFavorites();
  }
  isFavorite(spellIndex) {
    return this.favorites.includes(spellIndex);
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
  updateSchoolCounts() {
    this.schoolsList.forEach((school) => (this.schools[school] = 0));
    this.pagination.pageContent.forEach(
      (block) => this.schools[block.spell.school.name]++
    );
  }
  readFavorites() {
    this.favorites = localStorage.getItem("favorites")?.split(",") || [];
  }
  toggleFavorites(filter) {
    this.activeFavorites = !this.activeFavorites;
    if (this.activeFavorites) {
      this.favoritesContainer.classList.add("active");
      this.readFavorites();
      this.fetchFavorites().then(() => this.pagination.render());
    } else {
      this.favoritesContainer.classList.remove("active");
      this.fetchContent().then(() => this.pagination.render());
    }
  }
  updateFavorites(spellIndex) {
    const i = this.favorites.indexOf(spellIndex);
    this.favorites =
      i === -1
        ? [...this.favorites, spellIndex]
        : [...this.favorites.slice(0, i), ...this.favorites.slice(i + 1)];
    localStorage.setItem("favorites", this.favorites);
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
    this.renderLevelFilter();
    this.renderFavoritesButton();
    this.renderSchoolsList();
    this.pagination.render();
  }
  renderSchoolsList() {
    this.schoolControls.innerHTML = "";
    this.filterElements = [];
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

  renderFavoritesButton() {
    const button = document.createElement("h2");
    button.innerText = "Favorites";
    button.addEventListener("click", () => this.toggleFavorites(this));
    this.favButton = button;
    this.favoritesContainer.appendChild(button);
  }

  async fetchContent() {
    const response = await fetch(
      `${this.src}?level=${this.activeLevel}&school=${this.activeFilter}`,
      requestOptions
    );
    const text = await response.text();
    const results = JSON.parse(text).results;
    const spells = await Promise.all(
      results.map((res) => fetchSpell(res.index))
    );
    this.pagination.updateContent(
      spells.map((spell) => new SpellBlock(spell, this))
    );
    this.updateSchoolCounts();
  }

  async fetchFavorites() {
    const spells = await Promise.all(
      this.favorites.map((fav) => fetchSpell(fav))
    );
    this.pagination.updateContent(
      spells.map((spell) => new SpellBlock(spell, this))
    );
    this.updateSchoolCounts();
  }
}

class Filters {
  constructor(
    srcURL,
    contentContainer,
    pageControls,
    schoolControls,
    levelConrols,
    favoritesContainer,
    searchbarContainer,
    activeLevel = 0
  ) {
    this.src = srcURL;
    this.content = [];
    this.pagination = new Pagination(contentContainer, pageControls);
    this.schoolControls = schoolControls;
    this.levelControls = levelConrols;
    this.favoritesContainer = favoritesContainer;
    this.searchbar = new Searchbar(
      searchbarContainer,
      this.searchContent.bind(this)
    );
    this.activeLevel = activeLevel;
    this.activeFilter = "";
    this.activeFavorites = false;
    this.schools = {};
    schoolsList.forEach((school) => (this.schools[school] = 0));
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
    schoolsList.forEach((school) => (this.schools[school] = 0));
    this.pagination.pageContent.forEach(
      (block) => this.schools[block.spell.school.name]++
    );
  }
  readFavorites() {
    this.favorites = localStorage.getItem("favorites")?.split(",") || [];
  }
  toggleFavorites() {
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
  updateFavorites(spellIndex, remove = false) {
    const i = this.favorites.indexOf(spellIndex);

    if (i === -1 && !remove) {
      this.favorites.push(spellIndex);
    } else if (i !== -1 && remove) {
      this.favorites.splice(i, 1);
      this.content.splice(i, 1);
      this.updateContent(this.content);
    }
    localStorage.setItem("favorites", this.favorites.join(","));
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
  searchContent(query) {
    console.log(this.content);
    const res =
      query !== ""
        ? this.content.filter((block) =>
            block.spell.name.toLowerCase().includes(query.toLowerCase())
          )
        : this.content;
    this.pagination.updateContent(res);
  }
  render() {
    this.renderLevelFilter();
    this.renderFavoritesButton();
    this.renderSchoolsList();
    this.searchbar.render();
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
    this.favoritesContainer.innerHTML = "";
    const button = document.createElement("h2");
    button.innerText = "Favorites";
    button.addEventListener("click", () => this.toggleFavorites(this));
    this.favButton = button;
    this.favoritesContainer.appendChild(button);
  }
  updateContent(content) {
    this.content = content;
    this.pagination.updateContent(this.content);
    this.updateSchoolCounts();
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
    this.updateContent(spells.map((spell) => new SpellBlock(spell, this)));
  }
  async fetchFavorites() {
    const spells = await Promise.all(
      this.favorites.map((fav) => fetchSpell(fav))
    );
    this.updateContent(spells.map((spell) => new SpellBlock(spell, this)));
  }
}

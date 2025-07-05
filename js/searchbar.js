class Searchbar {
  constructor(container, searchFunction = () => {}, activeSearch = "") {
    this.container = container;
    this.search = searchFunction;
    this.activeSearch = activeSearch;
    this.input = this.#buildInput();
    this.icon = this.#buildIcon();
  }
  #buildInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "search";
    input.placeholder = "search spells...";
    input.value = this.activeSearch;

    input.addEventListener("keyup", (e) => {
      this.activeSearch = e.target.value;
      this.search(this.activeSearch);
      this.render();
    });
    return input;
  }
  #buildIcon() {
    const icon = this.activeSearch === "" ? faIcon("search") : faIcon("times");
    icon.addEventListener("click", () => {
      this.render(true);
      this.search("");
    });
    return icon;
  }
  render(clear = false) {
    this.activeSearch = clear ? "" : this.input.value;
    const focus = document.activeElement === this.input;
    this.container.innerHTML = "";
    this.input = this.#buildInput();
    this.icon = this.#buildIcon();
    this.container.append(this.input, this.icon);
    if (focus) {
      this.input.focus();
    }
  }
}

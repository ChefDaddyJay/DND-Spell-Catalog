class Pagination {
  constructor(
    pageContainer,
    controls,
    content = [],
    currentPage = 1,
    itemsPerPage = 7
  ) {
    this.pageContainer = pageContainer;
    this.pageContent = content;
    this.totalPages = this.pageContent.length / itemsPerPage;
    this.controls = controls;
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
  }

  setPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
    this.render();
  }

  updateContent(content) {
    this.pageContent = content;
    this.totalPages = Math.ceil(this.pageContent.length / this.itemsPerPage);
    this.setPage(1);
  }

  sortContent(dir) {
    this.updateContent(
      this.pageContent.sort((a, b) => {
        if (dir === "asc") {
          return a.spell.name > b.spell.name ? 1 : -1;
        } else {
          return a.spell.name < b.spell.name ? 1 : -1;
        }
      })
    );
  }

  toggleSortTab() {
    const wrapper = this.parentElement;
    if (wrapper.classList.contains("active")) {
      wrapper.classList.remove("active");
    } else {
      wrapper.classList.add("active");
    }
  }

  render() {
    if (media.isDesktop) {
      this.renderPage();
      this.renderButtons();
    } else {
      this.renderAll();
    }
    this.renderSortTab();
  }

  renderAll() {
    this.pageContainer.innerHTML = "";
    this.pageContent.forEach((elm) =>
      this.pageContainer.appendChild(elm.element)
    );
  }

  renderPage() {
    this.pageContainer.innerHTML = "";
    for (
      let i = (this.currentPage - 1) * this.itemsPerPage;
      i < this.currentPage * this.itemsPerPage && i < this.pageContent.length;
      i++
    ) {
      this.pageContainer.appendChild(this.pageContent[i].element);
    }
  }

  renderButtons() {
    const prevButton = this.prevButton(this.currentPage > 1);
    const prevPage =
      this.currentPage > 1
        ? this.pageButton(this.currentPage - 1)
        : document.createElement("li");
    const current = this.pageButton(this.currentPage, false);
    const nextPage =
      this.currentPage < this.totalPages
        ? this.pageButton(this.currentPage + 1)
        : document.createElement("li");
    const nextButton = this.nextButton(this.currentPage < this.totalPages);

    this.controls.innerHTML = "";
    this.controls.append(prevButton, prevPage, current, nextPage, nextButton);
  }

  renderSortTab() {
    const wrapper = document.createElement("div");
    const tab = document.createElement("div");
    const icon = document.createElement("i");
    const panel = document.createElement("div");
    const buttons = document.createElement("ul");
    const asc = this.sortButton("asc");
    const desc = this.sortButton("desc");

    wrapper.classList.add("sort-wrapper");
    tab.classList.add("sort-tab");
    tab.addEventListener("click", this.toggleSortTab);
    icon.classList.add("fa-solid");
    icon.classList.add("fa-ellipsis-vertical");
    tab.appendChild(icon);
    panel.classList.add("sort-panel");
    buttons.classList.add("sort-buttons");
    buttons.append(asc, desc);
    panel.appendChild(buttons);

    wrapper.append(tab, panel);
    this.pageContainer.appendChild(wrapper);
  }

  pageButton(page, active = true) {
    const button = document.createElement("li");
    button.setAttribute("data-page", "next");
    button.innerText = page;
    if (active) {
      button.classList.add("page");
      button.addEventListener("click", () => this.setPage(page));
    } else {
      button.classList.add("current-page");
    }
    return button;
  }

  nextButton = (active) => {
    const button = document.createElement("li");
    button.setAttribute("data-page", "next");
    button.appendChild(faIcon("chevron-right"));
    if (active) {
      button.classList.add("page");
      button.addEventListener("click", () =>
        this.setPage(this.currentPage + 1)
      );
    } else {
      button.classList.add("inactive");
    }
    return button;
  };

  prevButton = (active) => {
    const button = document.createElement("li");
    button.setAttribute("data-page", "prev");
    button.appendChild(faIcon("chevron-left"));
    if (active) {
      button.classList.add("page");
      button.addEventListener("click", () =>
        this.setPage(this.currentPage - 1)
      );
    } else {
      button.classList.add("inactive");
    }
    return button;
  };

  sortButton(dir) {
    const btn = document.createElement("li");

    btn.classList.add("sort-option");
    btn.appendChild(
      dir === "asc" ? faIcon("chevron-up") : faIcon("chevron-down")
    );
    btn.addEventListener("click", () => this.sortContent(dir));
    return btn;
  }
}

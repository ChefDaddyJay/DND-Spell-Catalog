class Pagination {
  constructor(
    pageContainer,
    controls,
    content = [],
    currentPage = 1,
    itemsPerPage = 6
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

  render() {
    this.renderPage();
    this.renderButtons();
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
}

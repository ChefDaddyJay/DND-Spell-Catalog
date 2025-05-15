const toggles = document.querySelectorAll("[data-toggle]");

toggles.forEach((elm) => {
  elm.addEventListener("click", () => {
    const target = document.getElementById(elm.dataset.toggle);
    if (target.classList.contains("open")) {
      target.classList.remove("open");
    } else {
      target.classList.add("open");
    }
  });
});

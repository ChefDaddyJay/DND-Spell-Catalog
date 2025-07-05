const faIcon = (icon) => {
  const res = document.createElement("i");
  res.classList.add("fas");
  res.classList.add(`fa-${icon}`);
  return res;
};

const createElement = (elm, classList = [], text = "") => {
  const element = document.createElement(elm);
  element.classList.add(...classList);
  element.innerText = text;
  return element;
};

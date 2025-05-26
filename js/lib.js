const faIcon = (icon) => {
  const res = document.createElement("i");
  res.classList.add("fas");
  res.classList.add(`fa-${icon}`);
  return res;
};

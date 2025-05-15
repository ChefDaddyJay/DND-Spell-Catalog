function buildDamageStat(stat, slot, cell) {
  const controls = document.createElement("div");
  const minus = document.createElement("div");
  const current = document.createElement("div");
  const plus = document.createElement("div");
  const dmg = document.createElement("p");

  cell.classList.add("damage");
  controls.classList.add("slot-controls");

  minus.classList.add("level-control");
  minus.innerHTML = `<i class="fa fa-minus"></i>`;

  current.classList.add("current-level");
  current.innerText = slot;

  plus.classList.add("level-control");
  plus.innerHTML = `<i class="fa fa-plus"></i>`;

  dmg.innerText = stat.damage_at_slot_level
    ? stat.damage_at_slot_level[slot]
    : stat.damage_at_character_level[slot];

  controls.append(minus, current, plus);
  cell.append(controls, dmg);
}

function buildModal(spell) {
  const modal = document.createElement("div");
  const modalBody = document.createElement("div");
  const close = document.createElement("i");
  const modalHeader = document.createElement("div");
  const name = document.createElement("h2");
  const levelAndSchool = document.createElement("div");
  const level = document.createElement("p");
  const school = document.createElement("div");
  const divider = document.createElement("div");
  const desc = document.createElement("div");
  const statsTable = document.createElement("table");
  const labels = [
    "Casting Time",
    "Duration",
    "Range",
    "Damage",
    "Classes",
    "Materials",
  ];
  const stats = [
    spell.casting_time,
    spell.duration,
    spell.range,
    spell.damage,
    spell.classes,
    spell.materials,
  ];

  modal.classList.add("modal");
  modal.id = spell.index;

  modalBody.classList.add("modal-body");

  close.classList.add("fas");
  close.classList.add("fa-times");
  close.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  modalHeader.classList.add("modal-header");

  name.innerText = spell.name;

  levelAndSchool.classList.add("level-and-school");
  level.innerText = `Lv. ${spell.level}`;
  school.classList.add("spell-school");
  school.classList.add("round-pill");
  school.innerText = spell.school.name;
  levelAndSchool.append(level, school);

  modalHeader.append(name, levelAndSchool);

  divider.classList.add("horizontal-divider");

  desc.classList.add("spell-description");
  desc.innerText = spell.desc;

  stats.forEach((stat, i) => {
    const row = document.createElement("tr");
    const label = document.createElement("th");
    const data = document.createElement("td");

    label.innerText = labels[i];
    row.appendChild(label);

    if (stat) {
      switch (labels[i]) {
        case "Damage":
          console.log(
            Object.keys(
              stat.damage_at_slot_level || stat.damage_at_character_level
            )
          );
          buildDamageStat(
            stat,
            Object.keys(
              stat.damage_at_slot_level || stat.damage_at_character_level
            )[0],
            data
          );
          break;
        case "Classes":
          data.innerText = stat.map((c) => c.name);
          break;
        default:
          data.innerText = stat;
      }
      row.appendChild(data);
      statsTable.appendChild(row);
    }
  });
  statsTable.classList.add("spell-stats");

  modalBody.append(
    close,
    modalHeader,
    divider,
    desc,
    divider.cloneNode(),
    statsTable
  );
  modal.appendChild(modalBody);
  main.appendChild(modal);
  return modal;
}

/* =========================================================================
   Shared renderer for massage routine cheat sheets.

   Each routine page defines a `routine` object and calls renderRoutine(routine).

   Data shape:
   {
     title: "50 Min Relaxation Massage Routine",
     subtitle: "50 minutes",                 // optional line under the title
     positions: [
       {
         name: "Prone",
         time: "30 min",
         regions: [
           {
             name: "Foot",
             time: "2 min x2",                // optional
             items: [ <item>, <item>, ... ]
           }
         ]
       }
     ]
   }

   An <item> is either:
     - a string            -> rendered as a step pill
     - { group, time?, items: [...] } -> a labeled sub-group (recursive)
   Order is preserved exactly as listed.
   ========================================================================= */

function renderRoutine(routine, mountId) {
  const mount = document.getElementById(mountId || "routine");
  if (!mount) return;

  document.title = routine.title;
  const titleEl = document.querySelector("[data-title]");
  if (titleEl) titleEl.textContent = routine.title;
  const subEl = document.querySelector("[data-subtitle]");
  if (subEl && routine.subtitle) subEl.textContent = routine.subtitle;

  mount.innerHTML = "";
  routine.positions.forEach((position) => {
    mount.appendChild(renderPosition(position));
  });
}

function renderPosition(position) {
  const section = el("section", "position");

  const head = el("div", "position__head");
  head.appendChild(el("span", "name", position.name));
  if (position.time) head.appendChild(el("span", "time", position.time));
  section.appendChild(head);

  const regions = el("div", "regions");
  (position.regions || []).forEach((region) => {
    regions.appendChild(renderRegion(region));
  });
  section.appendChild(regions);
  return section;
}

function renderRegion(region) {
  const card = el("article", "region");

  const head = el("div", "region__head");
  head.appendChild(el("span", "name", region.name));
  if (region.time) head.appendChild(el("span", "time", region.time));
  card.appendChild(head);

  renderItems(region.items || [], card);
  return card;
}

/* Render an ordered list of items into `container`, grouping consecutive
   string steps into a single .pills row and recursing into sub-groups. */
function renderItems(items, container) {
  let pills = null;
  const flush = () => { pills = null; };

  items.forEach((item) => {
    if (typeof item === "string") {
      if (!pills) {
        pills = el("div", "pills");
        container.appendChild(pills);
      }
      pills.appendChild(el("span", "pill", item));
    } else if (item && item.group) {
      flush();
      const sub = el("div", "subgroup");
      const label = el("span", "subgroup__label", item.group);
      sub.appendChild(label);
      renderItems(item.items || [], sub);
      container.appendChild(sub);
    }
  });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

(() => {
  const panel = document.querySelector("#arrivalPanel");
  const routeEl = document.querySelector("#arrivalRoute");
  const nextHookEl = document.querySelector("#arrivalNextHook");
  const encounterTitleEl = document.querySelector("#arrivalEncounterTitle");
  const encounterTextEl = document.querySelector("#arrivalEncounterText");

  if (!panel || !routeEl || !nextHookEl || !encounterTitleEl || !encounterTextEl) return;

  const ENCOUNTERS = {
    "Tidewalk Coast": {
      storageKey: "codexgame.edge.tidewalk-coast.docking-rights",
      actionLabel: "Secure docking rights",
      pendingNote: "Ask Tidelantern Quay to open limited docking and confirm the archive route is stable.",
      resolvedTitle: "Dock Steward Compact",
      resolvedText: "The stewards open limited docking and hand over a tide map marking two drowned warehouses.",
      resolvedNote: "Consequence: the hamlet now accepts the route and allows salvage traffic.",
      resolvedHook: "Active hook: survey the drowned warehouses along the coast."
    }
  };

  const actionBlock = document.createElement("div");
  actionBlock.className = "arrival-block arrival-action is-hidden";

  const actionLabel = document.createElement("span");
  actionLabel.className = "arrival-label";
  actionLabel.textContent = "Playable edge encounter";

  const actionButton = document.createElement("button");
  actionButton.className = "arrival-action-button";
  actionButton.type = "button";

  const actionNote = document.createElement("span");
  actionNote.className = "arrival-action-note";

  actionBlock.append(actionLabel, actionButton, actionNote);
  panel.append(actionBlock);

  let lastKey = "";

  function currentDestination() {
    if (panel.classList.contains("is-hidden")) return null;
    const routeText = routeEl.textContent.trim();
    if (!routeText) return null;
    const [destinationName] = routeText.split("·").map((part) => part.trim());
    return destinationName || null;
  }

  function render() {
    const destination = currentDestination();
    const encounter = destination ? ENCOUNTERS[destination] : null;

    if (!encounter) {
      lastKey = "";
      actionBlock.classList.add("is-hidden");
      return;
    }

    const resolved = localStorage.getItem(encounter.storageKey) === "resolved";
    const key = `${destination}|${resolved}`;
    if (key === lastKey) return;
    lastKey = key;

    actionBlock.classList.remove("is-hidden");

    if (!resolved) {
      actionButton.disabled = false;
      actionButton.textContent = encounter.actionLabel;
      actionNote.textContent = encounter.pendingNote;
      return;
    }

    actionButton.disabled = true;
    actionButton.textContent = "Docking rights secured";
    actionNote.textContent = encounter.resolvedNote;
    encounterTitleEl.textContent = encounter.resolvedTitle;
    encounterTextEl.textContent = encounter.resolvedText;
    nextHookEl.textContent = encounter.resolvedHook;
  }

  actionButton.addEventListener("click", () => {
    const destination = currentDestination();
    const encounter = destination ? ENCOUNTERS[destination] : null;
    if (!encounter) return;

    localStorage.setItem(encounter.storageKey, "resolved");
    lastKey = "";
    render();
  });

  const observer = new MutationObserver(() => {
    lastKey = "";
    render();
  });

  observer.observe(panel, { attributes: true, childList: true, subtree: true, characterData: true });
  render();
})();

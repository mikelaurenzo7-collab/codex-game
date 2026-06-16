(() => {
  const DOSSIERS = {
    "Tidewalk Coast": {
      title: "Raised Dock Hamlet",
      summary:
        "Beyond the archive lift, the coast opens into a lantern-strung salvage hamlet balanced over black tidewater and broken piers.",
      encounterTitle: "First arrival encounter",
      encounterText:
        "Dock stewards demand proof that the archive route is stable before they trade batteries or sound the deeper marsh bells.",
      settlementName: "Tidelantern Quay",
      settlementText:
        "A practical fishing and salvage post built on pylons, eager for archive metal and desperate for reliable inland signal routes.",
      resourceTitle: "Immediate resource",
      resourceText:
        "Salt-proof cable, brine lantern oil, and one serviceable tide map that marks two drowned warehouses further downshore.",
      nextHook:
        "Negotiate docking rights, then survey the drowned warehouses to learn who has been stripping the coast ahead of the hamlet."
    },
    "Deep Green Verge": {
      title: "Fenward Ranger Enclave",
      summary:
        "The relay fen gives way to rootbound wilds where ranger posts cling to giant mangrove ribs above luminous green water.",
      encounterTitle: "First arrival encounter",
      encounterText:
        "A ranger outrider mistakes the archive signal for a hostile lure and forces a tense standoff at spear range before letting you speak.",
      settlementName: "Vergewatch Platforms",
      settlementText:
        "A sparse defensive enclave of scouts and reedwrights that survives by reading predator movement and burning back growth at dusk.",
      resourceTitle: "Immediate resource",
      resourceText:
        "Spore-charms, reed resin, and a partial migration sketch showing where the root canyons open into safer high ground.",
      nextHook:
        "Earn the enclave's trust by tracing the false signal source drawing predators toward Vergewatch after dark."
    },
    "Bell March": {
      title: "Stoneward Bastion",
      summary:
        "Past the cairn steps, the bell marches widen into wind-cut terraces guarded by signal fires and stacked grave-stone redoubts.",
      encounterTitle: "First arrival encounter",
      encounterText:
        "A watch captain halts the crossing and insists the bell route is cursed unless the archive witness can prove the marches are not already lost.",
      settlementName: "Stoneward Gatehouse",
      settlementText:
        "A hard frontier bastion built from collapsed cairns, where wardens ration rope, water, and high-ground shelter to proven travelers only.",
      resourceTitle: "Immediate resource",
      resourceText:
        "Wind charts, cairn rope, and a sealed ledger describing vanished patrols on the upper terraces after the last bell storm.",
      nextHook:
        "Climb with a patrol to the upper terraces and determine whether the vanished wardens were taken by revenants or something using the bell as cover."
    }
  };

  const panel = document.querySelector("#arrivalPanel");
  const routeList = document.querySelector("#routeList");
  if (!panel || !routeList) {
    return;
  }

  const routeEl = document.querySelector("#arrivalRoute");
  const titleEl = document.querySelector("#arrivalTitle");
  const summaryEl = document.querySelector("#arrivalSummary");
  const encounterTitleEl = document.querySelector("#arrivalEncounterTitle");
  const encounterTextEl = document.querySelector("#arrivalEncounterText");
  const settlementNameEl = document.querySelector("#arrivalSettlementName");
  const settlementTextEl = document.querySelector("#arrivalSettlementText");
  const resourceTitleEl = document.querySelector("#arrivalResourceTitle");
  const resourceTextEl = document.querySelector("#arrivalResourceText");
  const nextHookEl = document.querySelector("#arrivalNextHook");

  let lastKey = "";

  function hidePanel() {
    panel.classList.add("is-hidden");
  }

  function readLinkedRoute() {
    const linkedItem = Array.from(routeList.querySelectorAll("li")).find((item) => {
      const status = item.querySelector(".route-status");
      return status && status.textContent.trim() === "Linked";
    });

    if (!linkedItem) {
      return null;
    }

    const destination = linkedItem.querySelector(".route-destination")?.textContent.trim() || "";
    const [destinationName, destinationBiome] = destination.split("·").map((part) => part.trim());
    return { destinationName, destinationBiome };
  }

  function render() {
    const linked = readLinkedRoute();
    if (!linked || !linked.destinationName || !DOSSIERS[linked.destinationName]) {
      lastKey = "";
      hidePanel();
      return;
    }

    const dossier = DOSSIERS[linked.destinationName];
    const key = `${linked.destinationName}|${linked.destinationBiome}|${dossier.title}`;
    if (key === lastKey) {
      return;
    }
    lastKey = key;

    routeEl.textContent = `${linked.destinationName} · ${linked.destinationBiome}`;
    titleEl.textContent = dossier.title;
    summaryEl.textContent = dossier.summary;
    encounterTitleEl.textContent = dossier.encounterTitle;
    encounterTextEl.textContent = dossier.encounterText;
    settlementNameEl.textContent = dossier.settlementName;
    settlementTextEl.textContent = dossier.settlementText;
    resourceTitleEl.textContent = dossier.resourceTitle;
    resourceTextEl.textContent = dossier.resourceText;
    nextHookEl.textContent = dossier.nextHook;
    panel.classList.remove("is-hidden");
  }

  const observer = new MutationObserver(render);
  observer.observe(routeList, { childList: true, subtree: true, characterData: true });
  render();
})();

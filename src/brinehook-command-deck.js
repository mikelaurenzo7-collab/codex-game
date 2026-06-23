import { getBrinehookCommandBrief } from "./brinehook-command-brief.js";

const deck = document.querySelector("#brinehookCommandDeck");
const eyebrow = document.querySelector("#brinehookCommandEyebrow");
const title = document.querySelector("#brinehookCommandTitle");
const condition = document.querySelector("#brinehookCommandCondition");
const objective = document.querySelector("#brinehookCommandObjective");
const instruction = document.querySelector("#brinehookCommandInstruction");
const locationReadout = document.querySelector("#fragmentReadout");
const statusReadout = document.querySelector("#statusReadout");
const objectiveReadout = document.querySelector("#objectiveReadout");

function render() {
  const brief = getBrinehookCommandBrief({
    location: locationReadout?.textContent,
    status: statusReadout?.textContent,
    objective: objectiveReadout?.textContent
  });

  deck.classList.toggle("is-hidden", !brief.active);
  deck.dataset.tone = brief.tone;
  eyebrow.textContent = brief.eyebrow;
  title.textContent = brief.title;
  condition.textContent = brief.condition;
  objective.textContent = brief.objective;
  instruction.textContent = brief.instruction;
}

const observer = new MutationObserver(render);
for (const node of [locationReadout, statusReadout, objectiveReadout]) {
  if (node) {
    observer.observe(node, { childList: true, characterData: true, subtree: true });
  }
}

render();
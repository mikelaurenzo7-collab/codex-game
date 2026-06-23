export const CONTACT_RADIUS = 86;
export const CONTACT_HOLD_SECONDS = 1.45;

export const CONTACT_CHOICES = [
  {
    id: "quay-safe-lantern-line",
    label: "Lantern Tender",
    contactName: "Ivara, Brinehook Lantern Tender",
    target: { x: 690, y: 245 },
    visualTone: "warm lantern chain, safer silhouettes, amber decision ring",
    prompt: "Hold E near the tender to stabilize the lantern line and protect Tidelantern Quay.",
    reward: "Reliable batteries and a safer return path to the archive lift.",
    consequence: "The quay trusts the route, but rival salvagers gain time to erase their next mark."
  },
  {
    id: "black-keel-countermark",
    label: "Black-Keel Scout",
    contactName: "Venn, Black-Keel Countermark Scout",
    target: { x: 1040, y: 500 },
    visualTone: "cold underpier paint, angular wake marks, red-black suspicion ring",
    prompt: "Hold E near the scout to follow the hostile countermark before the tide erases it.",
    reward: "A direct lead toward the Black-Keel crew and their hidden salvage cache.",
    consequence: "The player becomes visible to a hostile salvage network before the coast is secure."
  }
];

export function createContactChoiceState() {
  return {
    player: { x: 210, y: 560 },
    selectedChoiceId: null,
    holdProgress: {},
    log: ["Warehouse survey complete: choose the coastal line in the world, not the dossier."]
  };
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getContactChoiceStatus(state) {
  const selectedChoice = CONTACT_CHOICES.find((choice) => choice.id === state.selectedChoiceId) || null;
  return {
    active: !selectedChoice,
    complete: Boolean(selectedChoice),
    selectedChoice,
    choices: CONTACT_CHOICES.map((choice) => {
      const inRange = distance(state.player, choice.target) <= CONTACT_RADIUS;
      return {
        ...choice,
        inRange,
        selected: choice.id === state.selectedChoiceId,
        progress: state.holdProgress?.[choice.id] || 0,
        required: CONTACT_HOLD_SECONDS
      };
    })
  };
}

export function updateContactChoiceState(state, input, deltaSeconds) {
  if (state.selectedChoiceId) {
    return state;
  }

  const dt = Math.min(Math.max(deltaSeconds, 0), 0.05);
  const holding = Boolean(input?.analyze);
  const status = getContactChoiceStatus(state);
  let committedChoice = null;

  for (const choice of status.choices) {
    const current = state.holdProgress[choice.id] || 0;
    const canCommit = holding && choice.inRange;
    const nextProgress = canCommit
      ? Math.min(CONTACT_HOLD_SECONDS, current + dt)
      : Math.max(0, current - dt * 0.75);
    state.holdProgress[choice.id] = nextProgress;

    if (nextProgress >= CONTACT_HOLD_SECONDS && !committedChoice) {
      committedChoice = choice;
    }
  }

  if (committedChoice) {
    state.selectedChoiceId = committedChoice.id;
    state.log.push(`Tidewalk route chosen in-world: ${committedChoice.label}`);
    state.log.push(committedChoice.consequence);
  }

  return state;
}

export function moveContactChoicePlayer(state, input, deltaSeconds) {
  const dt = Math.min(Math.max(deltaSeconds, 0), 0.05);
  let dx = Number(Boolean(input?.right)) - Number(Boolean(input?.left));
  let dy = Number(Boolean(input?.down)) - Number(Boolean(input?.up));
  const mag = Math.hypot(dx, dy);
  if (mag > 0) {
    dx /= mag;
    dy /= mag;
  }

  const speed = 260;
  state.player.x = clamp(state.player.x + dx * speed * dt, 52, 1228);
  state.player.y = clamp(state.player.y + dy * speed * dt, 52, 668);
  return state;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

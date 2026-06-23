import { getTidewalkContactField } from "./tidewalk-contact-field.js";

function drawLanternGlyph(ctx, active, time) {
  const flicker = 0.72 + Math.sin(time * 5) * 0.16;
  ctx.fillStyle = active ? `rgba(255, 239, 166, ${flicker})` : "rgba(232, 196, 109, 0.64)";
  ctx.fillRect(-5, -9, 10, 16);
  ctx.strokeStyle = "rgba(243, 240, 220, 0.82)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -10, 6, Math.PI, 0);
  ctx.stroke();
}

function drawCountermarkGlyph(ctx, active) {
  ctx.strokeStyle = active ? "rgba(243, 240, 220, 0.94)" : "rgba(217, 102, 102, 0.76)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-10, -10);
  ctx.lineTo(10, 10);
  ctx.moveTo(10, -10);
  ctx.lineTo(-10, 10);
  ctx.stroke();
}

function drawContactLabel(ctx, contact, active) {
  ctx.fillStyle = active ? "#f3f0dc" : "rgba(243, 240, 220, 0.78)";
  ctx.font = "700 13px system-ui, sans-serif";
  ctx.fillText(contact.label, 32, -10);
  ctx.fillStyle = active ? "#e8c46d" : "rgba(243, 240, 220, 0.58)";
  ctx.font = "700 11px system-ui, sans-serif";
  ctx.fillText(active ? "Hold E to commit" : contact.visual.hierarchy, 32, 8);
}

export function drawTidewalkContacts(ctx, state) {
  const field = getTidewalkContactField(state);
  if (!field.active) {
    return field;
  }

  for (const contact of field.contacts) {
    const active = field.actionableContact?.id === contact.id;
    const focused = field.focusContact?.id === contact.id;
    const pulse = 1 + Math.sin((state.time || 0) * 3 + contact.target.x) * 0.06;

    ctx.save();
    ctx.translate(contact.target.x, contact.target.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = contact.visual.fill;
    ctx.strokeStyle = contact.visual.stroke;
    ctx.lineWidth = active ? 6 : focused ? 4 : 3;
    ctx.beginPath();
    ctx.arc(0, 0, contact.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = active ? "rgba(243, 240, 220, 0.92)" : contact.visual.stroke;
    ctx.lineWidth = 2;
    ctx.setLineDash(active ? [8, 5] : [4, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, contact.radius + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (contact.visual.glyph === "lantern") {
      drawLanternGlyph(ctx, active, state.time || 0);
    } else {
      drawCountermarkGlyph(ctx, active);
    }

    drawContactLabel(ctx, contact, active);
    ctx.restore();
  }

  return field;
}

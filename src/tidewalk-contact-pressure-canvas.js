import { getTidewalkContactPressure } from "./tidewalk-contact-pressure.js";

function getAuraPalette(pressure) {
  if (pressure.focusContact?.id === "black-keel-scout") {
    return {
      stroke: `rgba(217, 102, 102, ${0.2 + pressure.tension * 0.42})`,
      fill: `rgba(4, 8, 13, ${0.08 + pressure.tension * 0.18})`,
      dash: [6, 10]
    };
  }

  return {
    stroke: `rgba(232, 196, 109, ${0.22 + pressure.tension * 0.38})`,
    fill: `rgba(232, 196, 109, ${0.06 + pressure.tension * 0.14})`,
    dash: [12, 8]
  };
}

export function drawTidewalkContactPressureAura(ctx, state) {
  const pressure = getTidewalkContactPressure(state);
  if (!pressure.active || !pressure.focusContact?.target) {
    return pressure;
  }

  const palette = getAuraPalette(pressure);
  const contact = pressure.focusContact;
  const radius = contact.radius + 34 + pressure.tension * 42;
  const wobble = Math.sin((state.time || 0) * 4 + contact.target.x * 0.01) * 7;

  ctx.save();
  ctx.translate(contact.target.x, contact.target.y);
  ctx.fillStyle = palette.fill;
  ctx.strokeStyle = palette.stroke;
  ctx.lineWidth = pressure.band === "ready" ? 5 : 3;
  ctx.setLineDash(palette.dash);
  ctx.beginPath();
  ctx.arc(0, 0, radius + wobble, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(243, 240, 220, 0.82)";
  ctx.font = "700 11px system-ui, sans-serif";
  ctx.fillText(pressure.band.toUpperCase(), 28, contact.radius + 24);
  ctx.restore();

  return pressure;
}

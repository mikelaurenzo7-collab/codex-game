import { getTidewalkWorldPulse } from "./tidewalk-world-pulse.js";

function paletteForPulse(pulse) {
  if (pulse.tideColor === "black-red") {
    return {
      fill: `rgba(4, 8, 13, ${0.18 + pulse.heat * 0.24})`,
      stroke: `rgba(217, 102, 102, ${0.22 + pulse.heat * 0.34})`,
      label: "BLACK TIDE"
    };
  }

  return {
    fill: `rgba(232, 196, 109, ${0.06 + pulse.trust * 0.14})`,
    stroke: `rgba(232, 196, 109, ${0.18 + pulse.trust * 0.3})`,
    label: "LANTERN WAKE"
  };
}

export function drawTidewalkWorldPulseOverlay(ctx, state, bounds = {}) {
  const pulse = getTidewalkWorldPulse(state);
  if (!pulse.active) {
    return pulse;
  }

  const width = bounds.width || 1920;
  const height = bounds.height || 1080;
  const palette = paletteForPulse(pulse);
  const drift = Math.sin((state.time || 0) * 0.8) * 28;

  ctx.save();
  ctx.fillStyle = palette.fill;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = palette.stroke;
  ctx.lineWidth = pulse.hazardPosture === "surging" ? 6 : 3;

  for (let y = 90; y < height; y += 160) {
    ctx.beginPath();
    ctx.moveTo(0, y + drift);
    ctx.bezierCurveTo(width * 0.25, y - 80, width * 0.7, y + 95, width, y - drift);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(243, 240, 220, 0.76)";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.fillText(`${palette.label} / ${pulse.mood.toUpperCase()}`, 28, 34);
  ctx.restore();

  return pulse;
}

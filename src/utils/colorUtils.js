// src/utils/colorUtils.js

export function getStatusColor(value, thresholds) {
    if (value < thresholds.SAFE) return "#00ff00"; // green
    if (value < thresholds.WARNING) return "#ffa500"; // orange
    return "#ff0000"; // red
  }
  
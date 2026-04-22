const HDRI_BACKGROUNDS = [
  {
    name: "Clear Night",
    file: "rogland_clear_night_4k.exr",
  },
  {
    name: "Belfast Sunset 4k",
    file: "belfast_sunset_4k.exr",
  },
  {
    name: "Drakensberg Solitary Mountain 4k",
    file: "drakensberg_solitary_mountain_4k.exr",
  },
];

const GRADIENT_PRESETS = [
  {
    id: "immersive-night",
    name: "Immersive Night",
    colors: ["#09111f", "#16365e", "#7cb3ff"],
  },
  {
    id: "aurora-drift",
    name: "Aurora Drift",
    colors: ["#07151e", "#0f5b56", "#74f7d4"],
  },
  {
    id: "ember-haze",
    name: "Ember Haze",
    colors: ["#150b14", "#6e2e46", "#ffb36c"],
  },
  {
    id: "dusk-violet",
    name: "Dusk Violet",
    colors: ["#0d1224", "#3e3f84", "#e29fff"],
  },
];

const BACKGROUND_STORAGE_KEY = "sceneBackgroundConfig";
const LEGACY_BACKGROUND_STORAGE_KEY = "selectedEnv";

const DEFAULT_BACKGROUND_CONFIG = {
  type: "hdri",
  hdriFile: HDRI_BACKGROUNDS[0].file,
  gradientPresetId: GRADIENT_PRESETS[0].id,
  gradientColors: [...GRADIENT_PRESETS[0].colors],
  motion: "subtle",
};

function createDefaultBackgroundConfig() {
  return {
    ...DEFAULT_BACKGROUND_CONFIG,
    gradientColors: [...DEFAULT_BACKGROUND_CONFIG.gradientColors],
  };
}

function isValidHexColor(value) {
  return typeof value === "string" && /^#[\da-fA-F]{6}$/.test(value);
}

function sanitizeGradientColors(colors) {
  if (!Array.isArray(colors) || colors.length !== 3) {
    return [...DEFAULT_BACKGROUND_CONFIG.gradientColors];
  }

  return colors.map((color, index) =>
    isValidHexColor(color) ? color : DEFAULT_BACKGROUND_CONFIG.gradientColors[index]
  );
}

function getValidHdriFile(file) {
  return HDRI_BACKGROUNDS.some((background) => background.file === file)
    ? file
    : DEFAULT_BACKGROUND_CONFIG.hdriFile;
}

function getValidPresetId(presetId) {
  if (presetId === "custom") {
    return presetId;
  }

  return GRADIENT_PRESETS.some((preset) => preset.id === presetId)
    ? presetId
    : DEFAULT_BACKGROUND_CONFIG.gradientPresetId;
}

function normalizeBackgroundConfig(config = {}) {
  const hdriFile = getValidHdriFile(config.hdriFile);
  const gradientPresetId = getValidPresetId(config.gradientPresetId);
  const gradientColors = sanitizeGradientColors(config.gradientColors);

  return {
    type: config.type === "gradient" ? "gradient" : "hdri",
    hdriFile,
    gradientPresetId,
    gradientColors,
    motion: config.motion === "subtle" ? "subtle" : DEFAULT_BACKGROUND_CONFIG.motion,
  };
}

function readStoredBackgroundConfig() {
  if (typeof window === "undefined") {
    return createDefaultBackgroundConfig();
  }

  try {
    const storedConfig = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);

    if (storedConfig) {
      return normalizeBackgroundConfig(JSON.parse(storedConfig));
    }
  } catch (error) {
    console.warn("Unable to parse stored scene background config.", error);
  }

  const legacySelection = window.localStorage.getItem(LEGACY_BACKGROUND_STORAGE_KEY);

  if (legacySelection) {
    return normalizeBackgroundConfig({
      ...DEFAULT_BACKGROUND_CONFIG,
      hdriFile: legacySelection,
    });
  }

  return createDefaultBackgroundConfig();
}

function persistBackgroundConfig(config) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedConfig = normalizeBackgroundConfig(config);
  window.localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify(normalizedConfig));

  if (normalizedConfig.type === "hdri") {
    window.localStorage.setItem(LEGACY_BACKGROUND_STORAGE_KEY, normalizedConfig.hdriFile);
    return;
  }

  window.localStorage.removeItem(LEGACY_BACKGROUND_STORAGE_KEY);
}

export {
  BACKGROUND_STORAGE_KEY,
  DEFAULT_BACKGROUND_CONFIG,
  GRADIENT_PRESETS,
  HDRI_BACKGROUNDS,
  LEGACY_BACKGROUND_STORAGE_KEY,
  normalizeBackgroundConfig,
  persistBackgroundConfig,
  readStoredBackgroundConfig,
};

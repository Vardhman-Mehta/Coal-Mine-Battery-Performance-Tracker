import { useEffect, useState } from "react";
import {
  persistBackgroundConfig,
  readStoredBackgroundConfig,
} from "../utils/backgroundConfig.js";

export function useBackgroundConfig() {
  const [backgroundConfig, setBackgroundConfig] = useState(() =>
    readStoredBackgroundConfig()
  );

  useEffect(() => {
    persistBackgroundConfig(backgroundConfig);
  }, [backgroundConfig]);

  return [backgroundConfig, setBackgroundConfig];
}

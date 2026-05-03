import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type AppearanceMode = "light" | "dark" | "device";

let _mode: AppearanceMode = "device";
const _listeners = new Set<() => void>();

export function getAppearanceMode(): AppearanceMode {
  return _mode;
}

export async function setAndSaveAppearanceMode(mode: AppearanceMode) {
  _mode = mode;
  _listeners.forEach((fn) => fn());
  await AsyncStorage.setItem("schoolo_appearance", mode);
}

export async function loadAppearanceMode() {
  try {
    const saved = await AsyncStorage.getItem("schoolo_appearance");
    if (saved === "light" || saved === "dark" || saved === "device") {
      _mode = saved;
      _listeners.forEach((fn) => fn());
    }
  } catch {}
}

export function useAppearanceMode(): [AppearanceMode, (mode: AppearanceMode) => Promise<void>] {
  const [, tick] = useState(0);

  useEffect(() => {
    const cb = () => tick((n) => n + 1);
    _listeners.add(cb);
    return () => {
      _listeners.delete(cb);
    };
  }, []);

  return [_mode, setAndSaveAppearanceMode];
}

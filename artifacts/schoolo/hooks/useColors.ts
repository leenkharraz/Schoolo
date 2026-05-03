import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useAppearanceMode } from "@/store/theme";

export function useColors() {
  const [mode] = useAppearanceMode();
  const systemScheme = useColorScheme();

  const effective =
    mode === "dark"
      ? "dark"
      : mode === "light"
      ? "light"
      : (systemScheme ?? "light");

  const palette = effective === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}

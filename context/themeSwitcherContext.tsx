import type { Theme } from "@/types/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { Appearance, useColorScheme } from "react-native";

const ThemeSwitcherContext = createContext<{
  toggleTheme: () => void;
}>({
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = "default_app_theme";

export function useThemeSwitcher() {
  const value = useContext(ThemeSwitcherContext);
  if (!value) {
    throw new Error("useUser must be wrapped in a <ThemeSwitcherProvider />");
  }

  return value;
}

export function ThemeSwitcherProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme) {
        Appearance.setColorScheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = systemColorScheme === "light" ? "dark" : "light";
    Appearance.setColorScheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <ThemeSwitcherContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeSwitcherContext.Provider>
  );
}

import { useEffect, useState } from "react";

type ColorMode = "light" | "dark";

const colorSchemeQuery = "(prefers-color-scheme: dark)";

function readExplicitColorMode(): ColorMode | null {
  const mode = document.documentElement.dataset.theme;

  return mode === "light" || mode === "dark" ? mode : null;
}

function readSystemDarkMode() {
  return window.matchMedia?.(colorSchemeQuery).matches ?? false;
}

export function useColorMode() {
  const [colorMode, setColorMode] = useState(readExplicitColorMode);
  const [systemDarkMode, setSystemDarkMode] = useState(readSystemDarkMode);
  const darkMode = colorMode === null ? systemDarkMode : colorMode === "dark";

  useEffect(() => {
    if (colorMode !== null) {
      document.documentElement.dataset.theme = colorMode;
      return;
    }

    const systemPreference = window.matchMedia?.(colorSchemeQuery);

    if (!systemPreference) {
      return;
    }

    function handleSystemChange(event: MediaQueryListEvent) {
      setSystemDarkMode(event.matches);
    }

    systemPreference.addEventListener("change", handleSystemChange);

    return () => {
      systemPreference.removeEventListener("change", handleSystemChange);
    };
  }, [colorMode]);

  function handleDarkModeChange(nextDarkMode: boolean) {
    setColorMode(nextDarkMode ? "dark" : "light");
  }

  return { darkMode, onDarkModeChange: handleDarkModeChange };
}

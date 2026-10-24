import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Switch } from "@portfolio/ui-react";

import { useColorMode } from "./useColorMode";

export function ColorModeSwitch() {
  const { darkMode, onDarkModeChange } = useColorMode();

  return (
    <Switch
      aria-label="Dark mode"
      checked={darkMode}
      onCheckedChange={onDarkModeChange}
      presentation="icon"
      uncheckedState={{
        label: "Light",
        icon: <SunIcon aria-hidden="true" focusable="false" />,
      }}
      checkedState={{
        label: "Dark",
        icon: <MoonIcon aria-hidden="true" focusable="false" />,
      }}
    />
  );
}

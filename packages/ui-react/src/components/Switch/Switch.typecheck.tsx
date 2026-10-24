import { Switch, type SwitchProps, type SwitchState } from "../../index";

// Compiled by the existing library type check; never imported into the bundle.
export function switchTypeChecks() {
  const off: SwitchState = { label: "Off" };
  const props: SwitchProps = {
    "aria-label": "Notifications",
    checked: false,
    onCheckedChange: (checked) => {
      const value: boolean = checked;
      return value;
    },
    uncheckedState: off,
    checkedState: { label: "On" },
  };
  const text = <Switch {...props} />;
  const iconText = (
    <Switch
      {...props}
      presentation="icon-text"
      checkedState={{ label: "On", icon: <svg /> }}
    />
  );
  const icons = (
    <Switch
      {...props}
      presentation="icon"
      uncheckedState={{ label: "Off", icon: <svg /> }}
      checkedState={{ label: "On", icon: <svg /> }}
    />
  );
  const accent = <Switch {...props} color="#ffcc00" />;

  // @ts-expect-error Checked is a boolean, not a string.
  const invalidChecked = <Switch {...props} checked="on" />;
  const stringCallback = (value: string) => value;
  const invalidCallback = (
    // @ts-expect-error Callbacks receive the requested boolean.
    <Switch {...props} onCheckedChange={stringCallback} />
  );
  // @ts-expect-error Choose exactly one accessible naming method.
  const bothNames = <Switch {...props} aria-labelledby="label" />;
  // @ts-expect-error Icon-only mode requires icons for both states.
  const missingIcons = <Switch {...props} presentation="icon" />;
  const anonymous = {
    checked: false,
    onCheckedChange: () => {},
    uncheckedState: off,
    checkedState: off,
  };
  // @ts-expect-error An accessible naming method is required.
  const unnamed = <Switch {...anonymous} />;

  return [
    text,
    iconText,
    icons,
    accent,
    invalidChecked,
    invalidCallback,
    bothNames,
    missingIcons,
    unnamed,
  ];
}

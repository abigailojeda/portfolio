import type { ChangeEvent, CSSProperties, ReactNode } from "react";

import "./Switch.css";

export type SwitchState = {
  label: string;
  icon?: ReactNode;
};

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

type IconState = SwitchState & {
  icon: Exclude<ReactNode, null | undefined | boolean>;
};

type Presentation =
  | {
      presentation?: "text" | "icon-text";
      uncheckedState: SwitchState;
      checkedState: SwitchState;
    }
  | {
      presentation: "icon";
      uncheckedState: IconState;
      checkedState: IconState;
    };

export type SwitchProps = AccessibleName &
  Presentation & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    className?: string;
    /** Opaque, absolute CSS accent; unsupported engines retain semantic defaults. */
    color?: CSSProperties["color"];
  };

export function Switch({
  checked,
  onCheckedChange,
  uncheckedState,
  checkedState,
  presentation = "text",
  disabled = false,
  id,
  className,
  color,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SwitchProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onCheckedChange(event.currentTarget.checked);
  }

  return (
    <label
      className={`ui-switch relative inline-grid min-w-0 max-w-full align-middle ${className ?? ""}`}
      data-custom-color={color === undefined ? undefined : ""}
      style={
        color === undefined
          ? undefined
          : ({ "--switch-color": color } as CSSProperties)
      }
    >
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="peer absolute inset-0 z-20 m-0 size-full cursor-pointer opacity-0 outline-none disabled:cursor-not-allowed"
      />
      <span
        aria-hidden="true"
        className="switch-track grid min-w-0 grid-cols-2 rounded-full border border-border bg-surface p-1 text-sm transition-colors duration-150 peer-enabled:peer-hover:bg-muted peer-disabled:opacity-50 motion-reduce:transition-none"
      >
        <span
          className={`switch-thumb col-start-1 row-start-1 rounded-full bg-foreground transition-transform duration-150 motion-reduce:transition-none ${checked ? "translate-x-full" : "translate-x-0"}`}
        />
        {[uncheckedState, checkedState].map((state, index) => {
          const active = checked === (index === 1);

          return (
            <span
              key={index}
              data-active={active ? "" : undefined}
              className={`switch-state relative row-start-1 flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full text-center wrap-anywhere transition-colors duration-150 motion-reduce:transition-none ${presentation === "icon" ? "size-11" : "px-4 py-2"} ${index === 0 ? "col-start-1" : "col-start-2"} ${active ? "font-medium text-background" : "text-muted-foreground"}`}
            >
              {presentation !== "text" && state.icon != null && (
                <span className="inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-full">
                  {state.icon}
                </span>
              )}
              {presentation !== "icon" && (
                <span className="min-w-0">{state.label}</span>
              )}
            </span>
          );
        })}
      </span>
    </label>
  );
}

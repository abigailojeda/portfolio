import { useId, useRef, type CSSProperties } from "react";

import { useHorizontalDragScroll } from "../../hooks/useHorizontalDragScroll";
import { useRadioGroupFocus } from "./useRadioGroupFocus";

import "./SegmentedControl.css";

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
  onSelect?: (value: T) => void;
};

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

export type SegmentedControlProps<T extends string> = AccessibleName & {
  options: readonly SegmentedControlOption<T>[];
  value: NoInfer<T>;
  onValueChange: (value: T) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Opaque, absolute CSS accent; unsupported engines retain semantic defaults. */
  color?: CSSProperties["color"];
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  disabled = false,
  id,
  className,
  color,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SegmentedControlProps<T>) {
  const name = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const dragHandlers = useHorizontalDragScroll();
  const radioFocusHandlers = useRadioGroupFocus(groupRef);

  function handleSelection(option: SegmentedControlOption<T>) {
    if (disabled || option.disabled || option.value === value) {
      return;
    }

    onValueChange(option.value);
    option.onSelect?.(option.value);
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      data-custom-color={color === undefined ? undefined : ""}
      style={
        color === undefined
          ? undefined
          : ({ "--segmented-control-color": color } as CSSProperties)
      }
      className={`segmented-control inline-flex min-w-0 max-w-full scroll-px-1 gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1 text-sm text-surface-foreground ${className ?? ""}`}
      {...dragHandlers}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="relative flex min-w-0 max-w-full shrink-0"
        >
          <input
            className="peer absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled || option.disabled}
            {...radioFocusHandlers}
            onChange={() => handleSelection(option)}
          />
          <span className="flex min-h-11 max-w-64 items-center justify-center rounded-full px-4 py-2 text-center wrap-anywhere text-muted-foreground peer-checked:bg-foreground peer-checked:font-medium peer-checked:text-background peer-enabled:peer-not-checked:peer-hover:bg-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

import {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlOption,
} from "../../index";

// Compiled by the existing library type check; never imported into the bundle.
export function segmentedControlTypeChecks() {
  type Period = "week" | "month";
  const options = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ] as const;
  const typed: readonly SegmentedControlOption<Period>[] = options;
  const props: SegmentedControlProps<Period> = {
    "aria-label": "Period",
    options: typed,
    value: "week",
    onValueChange: () => {},
  };
  const inferred = (
    <SegmentedControl
      options={options}
      aria-label="Period"
      value="week"
      onValueChange={(value) => {
        const period: Period = value;
        return period;
      }}
    />
  );
  const explicit = <SegmentedControl<Period> {...props} />;
  const accent = <SegmentedControl {...props} color="#ffcc00" />;
  // @ts-expect-error Color uses the CSS color type, not a numeric value.
  const invalidColor = <SegmentedControl {...props} color={123} />;
  // @ts-expect-error The selected value must belong to the option union.
  const invalidValue = <SegmentedControl {...props} value="year" />;
  const anonymous = {
    options,
    value: "week" as const,
    onValueChange: () => {},
  };
  // @ts-expect-error An accessible naming method is required.
  const unnamed = <SegmentedControl {...anonymous} />;
  // @ts-expect-error Choose exactly one accessible naming method.
  const bothNames = <SegmentedControl {...props} aria-labelledby="label" />;
  const numeric = (value: number) => value;
  // @ts-expect-error Selection callbacks receive the option value, not a number.
  const wrongCallback = <SegmentedControl {...props} onValueChange={numeric} />;
  const wrongOption: SegmentedControlOption<Period> = {
    value: "week",
    label: "Week",
    // @ts-expect-error Individual callbacks use the same value union.
    onSelect: numeric,
  };
  return [
    inferred,
    explicit,
    accent,
    invalidColor,
    invalidValue,
    unnamed,
    bothNames,
    wrongCallback,
    wrongOption,
  ];
}

import { useState } from "react";

import { SegmentedControl, type SegmentedControlProps } from "../../index";

export const options = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export function Controlled(props: SegmentedControlProps<string>) {
  const [value, setValue] = useState(props.value);

  function handleValueChange(nextValue: string) {
    props.onValueChange(nextValue);
    setValue(nextValue);
  }

  return (
    <SegmentedControl
      {...props}
      value={value}
      onValueChange={handleValueChange}
    />
  );
}

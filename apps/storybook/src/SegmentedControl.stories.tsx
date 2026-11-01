import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

import {
  SegmentedControl,
  type SegmentedControlProps,
} from "@portfolio/ui-react";

type StoryArgs = Omit<
  SegmentedControlProps<string>,
  "aria-label" | "aria-labelledby"
> & {
  "aria-label": string;
  previewColorMode: "light" | "dark";
};

function ControlledStory({
  previewColorMode: _previewColorMode,
  ...args
}: StoryArgs) {
  // The decorator consumes this setting; never forward it to the component.
  void _previewColorMode;
  const [, updateArgs] = useArgs();
  return (
    <SegmentedControl<string>
      {...args}
      onValueChange={(value) => {
        args.onValueChange(value);
        updateArgs({ value });
      }}
    />
  );
}

const periods = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl<string>,
  render: ControlledStory,
  decorators: [
    (Story, { args }) => (
      <div
        data-theme={args.previewColorMode}
        className="min-w-0 max-w-full rounded-xl bg-background p-4 text-foreground"
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    color: {
      control: "color",
      description:
        "Optional opaque CSS accent. Transparency and CSS-variable references are unsupported. Omit to use semantic defaults; older browsers without native CSS contrast retain those defaults.",
    },
    previewColorMode: {
      name: "Preview color mode",
      description:
        "Storybook-only shared color-mode preview; not a SegmentedControl prop.",
      options: ["light", "dark"],
      control: {
        type: "inline-radio",
        labels: { light: "Light", dark: "Dark" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A controlled single-selection radio group with dynamically provided options. Tab enters/leaves; arrow keys select enabled choices; Space selects the focused choice. onValueChange runs before the optional option onSelect, once per changed user selection. Re-selecting the selected option does nothing. Values must be unique strings, labels nonempty text, and exactly one accessible group naming method supplied. Empty options render nothing; a missing value selects nothing. Light/dark previews use the shared tokens; glass integration is deferred until shared visual-style themes exist.",
      },
    },
    controls: {
      include: [
        "value",
        "color",
        "disabled",
        "options",
        "aria-label",
        "Preview color mode",
      ],
    },
  },
  args: {
    "aria-label": "Reporting period",
    options: periods,
    value: "week",
    onValueChange: fn(),
    disabled: false,
    color: undefined,
    previewColorMode: "light",
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomColor: Story = { args: { color: "#ffcc00" } };
export const Usage: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-lg space-y-4 text-foreground">
        <h2 className="text-lg font-semibold">Controlled single selection</h2>
        <Story />
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium">options</dt>
            <dd>
              A dynamic readonly array of unique string values, text labels,
              optional disabled flags, and optional onSelect callbacks.
            </dd>
          </div>
          <div>
            <dt className="font-medium">value and onValueChange</dt>
            <dd>
              The parent owns selection. A changed user selection calls
              onValueChange, then the option onSelect. Re-selecting the current
              value does nothing.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Accessible naming</dt>
            <dd>
              Provide exactly one of aria-label or aria-labelledby. Tab
              enters/leaves, arrows select enabled choices, and Space selects a
              focused option.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Other props</dt>
            <dd>
              disabled disables the group; id identifies it; className
              integrates layout. Empty options render nothing, and a missing
              value selects nothing.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Shared styling</dt>
            <dd>
              Real shared light/dark tokens determine appearance. An optional
              opaque color accent customizes selection with native contrasting
              text; use the color picker independently of Preview color mode.
              Glass integration is deferred; no theme props or persistence are
              included.
            </dd>
          </div>
        </dl>
      </div>
    ),
  ],
};
export const MultipleOptions: Story = {
  args: {
    "aria-label": "Category",
    value: "all",
    options: [
      { value: "all", label: "All" },
      { value: "design", label: "Design" },
      { value: "engineering", label: "Engineering" },
      { value: "research", label: "Research" },
      { value: "writing", label: "Writing" },
    ],
  },
};
export const OptionActions: Story = {
  args: {
    options: periods.map((option) => ({
      ...option,
      onSelect: fn().mockName(`${option.label} selected`),
    })),
  },
};
export const DisabledOption: Story = {
  args: {
    options: periods.map((option) => ({
      ...option,
      disabled: option.value === "month",
    })),
  },
};
export const Disabled: Story = { args: { disabled: true } };

function IndependentExamples() {
  const [period, setPeriod] = useState("week");
  const [category, setCategory] = useState("week");
  return (
    <div className="flex max-w-full flex-wrap gap-4">
      <SegmentedControl<string>
        aria-label="Time period"
        options={periods}
        value={period}
        onValueChange={setPeriod}
      />
      <SegmentedControl<string>
        aria-label="Collection"
        options={[
          { value: "week", label: "Featured" },
          { value: "month", label: "Recent" },
          { value: "year", label: "Archived" },
        ]}
        value={category}
        onValueChange={setCategory}
      />
    </div>
  );
}
export const IndependentInstances: Story = { render: IndependentExamples };

export const ConstrainedWidth: Story = {
  args: {
    "aria-label": "Available periods",
    value: "period-0",
    options: Array.from({ length: 25 }, (_, index) => ({
      value: `period-${index}`,
      label:
        index === 1
          ? "An exceptionally long period label with several descriptive words"
          : index === 2
            ? "AReallyLongUnbrokenPeriodLabelThatMustRemainReadableAndReachable"
            : `Period ${index + 1}`,
    })),
  },
  decorators: [
    (Story) => (
      <div className="w-64 max-w-full">
        <Story />
      </div>
    ),
  ],
};

function ColorModeExamples({
  previewColorMode: _previewColorMode,
  ...args
}: StoryArgs) {
  void _previewColorMode;
  const [lightValue, setLightValue] = useState(args.value);
  const [darkValue, setDarkValue] = useState(args.value);
  return (
    <div className="flex max-w-full flex-wrap gap-4">
      <div
        data-theme="light"
        className="min-w-0 rounded-xl bg-background p-4 text-foreground"
      >
        <p className="mb-3">Light color mode</p>
        <SegmentedControl<string>
          {...args}
          aria-label="Light preview period"
          aria-labelledby={undefined}
          value={lightValue}
          onValueChange={(value) => {
            args.onValueChange(value);
            setLightValue(value);
          }}
        />
      </div>
      <div
        data-theme="dark"
        className="min-w-0 rounded-xl bg-background p-4 text-foreground"
      >
        <p className="mb-3">Dark color mode</p>
        <SegmentedControl<string>
          {...args}
          aria-label="Dark preview period"
          aria-labelledby={undefined}
          value={darkValue}
          onValueChange={(value) => {
            args.onValueChange(value);
            setDarkValue(value);
          }}
        />
      </div>
    </div>
  );
}
export const ColorModes: Story = {
  render: ColorModeExamples,
  parameters: { controls: { exclude: ["Preview color mode"] } },
};
export const NestedColorModes: Story = {
  parameters: { controls: { exclude: ["Preview color mode"] } },
  render: (args) => (
    <div className="flex max-w-full flex-col gap-4">
      <div data-theme="light" className="min-w-0 rounded-xl bg-background p-2">
        <ColorModeExamples {...args} />
      </div>
      <div data-theme="dark" className="min-w-0 rounded-xl bg-background p-2">
        <ColorModeExamples {...args} />
      </div>
    </div>
  ),
};

export const DeclinedSelection: Story = {
  render: ({ previewColorMode: _previewColorMode, ...args }) => {
    void _previewColorMode;
    return <SegmentedControl<string> {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "The parent logs selection requests but does not update value. The checked value stays controlled; onSelect is still a request notification.",
      },
    },
  },
};

function DynamicExample() {
  const [options, setOptions] = useState(periods);
  const [value, setValue] = useState("week");
  return (
    <div className="flex max-w-full flex-col items-start gap-4">
      <SegmentedControl<string>
        aria-label="Dynamic periods"
        options={options}
        value={value}
        onValueChange={setValue}
      />
      <button
        type="button"
        className="rounded border border-border px-3 py-2"
        onClick={() => {
          window.setTimeout(
            () =>
              setOptions((current) =>
                current.filter((option) => option.value !== value),
              ),
            3000,
          );
        }}
      >
        Remove selected option in 3 seconds
      </button>
      <button
        type="button"
        className="rounded border border-border px-3 py-2"
        onClick={() => {
          window.setTimeout(
            () =>
              setOptions((current) =>
                current.map((option) => ({
                  ...option,
                  disabled: option.value === value,
                })),
              ),
            3000,
          );
        }}
      >
        Disable selected option in 3 seconds
      </button>
      <button
        type="button"
        className="rounded border border-border px-3 py-2"
        onClick={() => setOptions(periods)}
      >
        Reset options
      </button>
      <p>
        After scheduling removal, focus an option to inspect dynamic focus
        recovery.
      </p>
    </div>
  );
}
export const DynamicOptions: Story = { render: DynamicExample };

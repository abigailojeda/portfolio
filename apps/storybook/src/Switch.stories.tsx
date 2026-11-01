import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

import {
  Switch,
  type SwitchProps,
  type SwitchState,
} from "@portfolio/ui-react";

// Storybook controls use a flat shape; every selectable presentation has icons.
type StoryArgs = Omit<
  SwitchProps,
  | "aria-label"
  | "aria-labelledby"
  | "presentation"
  | "uncheckedState"
  | "checkedState"
> & {
  "aria-label": string;
  presentation: "text" | "icon-text" | "icon";
  uncheckedState: SwitchState & {
    icon: Exclude<ReactNode, null | undefined | boolean>;
  };
  checkedState: SwitchState & {
    icon: Exclude<ReactNode, null | undefined | boolean>;
  };
  previewColorMode: "light" | "dark";
};

function OffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="m8 8 8 8" />
    </svg>
  );
}

function OnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function ControlledStory({
  previewColorMode: _previewColorMode,
  ...args
}: StoryArgs) {
  // Preview color mode belongs to Storybook, never to the component.
  void _previewColorMode;
  const [, updateArgs] = useArgs();

  function handleCheckedChange(checked: boolean) {
    args.onCheckedChange(checked);
    updateArgs({ checked });
  }

  return <Switch {...args} onCheckedChange={handleCheckedChange} />;
}

const meta = {
  title: "Components/Switch",
  component: Switch,
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
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    presentation: {
      options: ["text", "icon-text", "icon"],
      control: "inline-radio",
    },
    uncheckedState: { control: false },
    checkedState: { control: false },
    color: {
      control: "color",
      description:
        "Optional opaque absolute CSS accent, matching SegmentedControl. Transparency and CSS-variable references are unsupported. Unsupported browsers retain semantic defaults.",
    },
    previewColorMode: {
      name: "Preview color mode",
      description:
        "Storybook-only shared color-mode preview; not a Switch prop.",
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
          "A controlled binary switch using a native checkbox with switch semantics. Clicking anywhere toggles; Tab enters/leaves and Space toggles. The parent owns checked; onCheckedChange requests the next boolean once per user change. Supply exactly one stable aria-label or aria-labelledby and nonempty labels for both states. presentation defaults to text; icon-text adds optional icons, and icon requires icons for both states while hiding text. Supply noninteractive ReactNode icons using currentColor. State contents are decorative to assistive technology. disabled preserves state and skips keyboard focus. id identifies the input; className integrates layout. The sliding highlight respects reduced motion, and keyboard focus uses a subtle border/shadow. Shared light/dark tokens and optional color determine appearance; visual-style themes remain deferred.",
      },
    },
    controls: {
      include: [
        "checked",
        "disabled",
        "presentation",
        "color",
        "aria-label",
        "Preview color mode",
      ],
    },
  },
  args: {
    "aria-label": "Notifications",
    checked: false,
    onCheckedChange: fn(),
    uncheckedState: { label: "Off", icon: <OffIcon /> },
    checkedState: { label: "On", icon: <OnIcon /> },
    presentation: "text",
    disabled: false,
    color: undefined,
    previewColorMode: "light",
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const IconAndText: Story = { args: { presentation: "icon-text" } };
export const IconOnly: Story = { args: { presentation: "icon" } };
export const CustomColor: Story = { args: { color: "#ffcc00" } };

function StateExample({
  previewColorMode,
  checked: initialChecked,
  ...args
}: StoryArgs) {
  const [checked, setChecked] = useState(initialChecked);

  function handleCheckedChange(nextChecked: boolean) {
    args.onCheckedChange(nextChecked);
    setChecked(nextChecked);
  }

  return (
    <div
      data-theme={previewColorMode}
      className="min-w-0 max-w-full rounded-xl bg-background p-4 text-foreground"
    >
      <Switch
        {...args}
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}

function BothStates(args: StoryArgs) {
  return (
    <div className="flex max-w-full flex-wrap gap-4">
      <StateExample {...args} checked={false} aria-label="Initially off" />
      <StateExample {...args} checked aria-label="Initially on" />
    </div>
  );
}

export const Disabled: Story = { args: { disabled: true }, render: BothStates };

export const ColorModes: Story = {
  render: (args) => (
    <div className="flex max-w-full flex-wrap gap-4">
      <section
        data-theme="light"
        className="min-w-0 rounded-xl bg-background p-4 text-foreground"
      >
        <h2 className="mb-3 text-sm font-medium">Light</h2>
        <BothStates {...args} previewColorMode="light" />
      </section>
      <section
        data-theme="dark"
        className="min-w-0 rounded-xl bg-background p-4 text-foreground"
      >
        <h2 className="mb-3 text-sm font-medium">Dark</h2>
        <BothStates {...args} previewColorMode="dark" />
      </section>
    </div>
  ),
  parameters: { controls: { exclude: ["checked", "Preview color mode"] } },
};

export const ConstrainedWidth: Story = {
  args: {
    uncheckedState: { label: "Disabled", icon: <OffIcon /> },
    checkedState: { label: "Enabled for all notifications", icon: <OnIcon /> },
  },
  decorators: [
    (Story) => (
      <div className="w-48 max-w-full">
        <Story />
      </div>
    ),
  ],
};

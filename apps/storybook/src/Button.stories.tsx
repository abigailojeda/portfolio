import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, type ButtonProps } from "@portfolio/ui-react";

// Storybook-only color mode is kept out of the native Button props.
type StoryArgs = Extract<ButtonProps, { href?: never }> & {
  previewColorMode: "light" | "dark";
};

function ArrowIcon() {
  return (
    <svg
      className="translate-y-px"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      focusable="false"
    >
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

const variants = ["filled", "outlined", "bottom-border", "text"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
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
  parameters: {
    docs: {
      description: {
        component:
          "A native button (default type=button), or a native anchor when href is supplied. Icon-only controls must supply aria-label or aria-labelledby. Icons should use currentColor. Custom colors accept opaque absolute CSS colors, matching Switch; unsupported browsers retain semantic defaults. Choose transparent-variant accents with sufficient contrast against their surface, including hover. Tab to inspect keyboard focus; hover to see gentle lightening. Transitions respect reduced motion.",
      },
    },
    controls: {
      include: [
        "children",
        "variant",
        "disabled",
        "icon",
        "iconPosition",
        "radius",
        "color",
        "padding",
        "paddingX",
        "paddingY",
        "Preview color mode",
      ],
    },
  },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    disabled: { control: "boolean" },
    iconPosition: {
      if: { arg: "icon", neq: "none" },
      control: "inline-radio",
      options: ["start", "end"],
    },
    icon: {
      options: ["none", "arrow"],
      mapping: { none: undefined, arrow: <ArrowIcon /> },
      control: {
        type: "inline-radio",
        labels: { none: "None", arrow: "Arrow" },
      },
    },
    radius: {
      if: { arg: "variant", neq: "bottom-border" },
      options: ["0", "0.25rem", "0.5rem", "0.75rem", "9999px"],
      control: {
        type: "inline-radio",
        labels: {
          "0": "None (0)",
          "0.25rem": "Small (0.25rem)",
          "0.5rem": "Medium (0.5rem)",
          "0.75rem": "Large (0.75rem)",
          "9999px": "Pill (9999px)",
        },
      },
      description:
        "Storybook presets; the Button API accepts custom CSS radii. Bottom-border always stays square.",
    },
    color: { if: { arg: "disabled", neq: true }, control: "color" },
    padding: { control: "inline-radio", options: ["normal", "none"] },
    paddingX: {
      control: "text",
      description:
        "Horizontal CSS padding: 0, 24px, 1rem. Empty uses the padding preset.",
    },
    paddingY: {
      control: "text",
      description:
        "Vertical CSS padding: 0, 12px, 0.5rem. Empty uses the padding preset.",
    },
    previewColorMode: {
      name: "Preview color mode",
      control: "inline-radio",
      options: ["light", "dark"],
      description: "Storybook-only color mode, not a Button prop.",
    },
  },
  args: {
    children: "Continue",
    variant: "filled",
    disabled: false,
    padding: "normal",
    radius: "0.5rem",
    icon: "none",
    iconPosition: "start",
    paddingX: "",
    paddingY: "",
    previewColorMode: "light",
    onClick: fn(),
  },
  render: ({ previewColorMode: _previewColorMode, ...args }) => {
    void _previewColorMode;
    return (
      <Button
        {...args}
        children={args.children === "" ? undefined : args.children}
        aria-label={args.children ? undefined : "Button action"}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = { args: { variant: "filled" } };
export const Outlined: Story = { args: { variant: "outlined" } };
export const BottomBorder: Story = {
  args: { variant: "bottom-border", padding: "none" },
};
export const BottomBorderWithIcon: Story = {
  name: "Bottom Border & Icon",
  args: {
    variant: "bottom-border",
    padding: "none",
    icon: "arrow",
    iconPosition: "end",
  },
};
export const Text: Story = { args: { variant: "text" } };
export const Disabled: Story = { args: { disabled: true } };
export const IconOnly: Story = {
  args: { children: undefined, icon: <ArrowIcon /> },
  parameters: { controls: { exclude: ["children", "icon", "iconPosition"] } },
};

export const Padding: Story = {
  parameters: {
    controls: { exclude: ["children", "padding", "paddingX", "paddingY"] },
  },
  render: ({ previewColorMode, ...args }) => {
    void previewColorMode;

    return (
      <div className="grid justify-items-start gap-4">
        <Button {...args} padding="none" paddingX={0} paddingY={0}>
          No padding
        </Button>
        <Button {...args} padding="none" paddingX="1rem" paddingY={0}>
          Horizontal only
        </Button>
        <Button {...args} padding="none" paddingX={0} paddingY="0.75rem">
          Vertical only
        </Button>
        <Button {...args} padding="none" paddingX="1rem" paddingY="0.75rem">
          Both axes
        </Button>
      </div>
    );
  },
};

export const ThemesAndStates: Story = {
  parameters: { controls: { exclude: ["variant", "Preview color mode"] } },
  render: ({ previewColorMode, ...args }) => {
    void previewColorMode;

    return (
      <div className="grid max-w-full gap-4">
        {(["light", "dark"] as const).map((theme) => (
          <section
            key={theme}
            data-theme={theme}
            className="rounded-xl bg-background p-4 text-foreground"
          >
            <h2 className="mb-4 font-medium">
              {theme}: hover or Tab to inspect focus
            </h2>
            <div className="flex flex-wrap items-start gap-6">
              {variants.map((variant) => (
                <div key={variant} className="grid justify-items-start gap-2">
                  <h3 className="font-medium">{variant}</h3>
                  <Button
                    {...args}
                    variant={variant}
                    children={args.children === "" ? undefined : args.children}
                    aria-label={
                      args.children
                        ? undefined
                        : theme + " " + variant + " action"
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

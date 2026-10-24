import { useState, type MouseEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

import { NavLink, type NavLinkProps } from "@portfolio/ui-react";

type StoryArgs = NavLinkProps & { previewColorMode: "light" | "dark" };

function InteractiveStory({
  previewColorMode: _previewColorMode,
  ...args
}: StoryArgs) {
  // Color mode belongs to the preview, not the component.
  void _previewColorMode;
  const [, updateArgs] = useArgs();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    args.onClick?.(event);
    event.preventDefault();
    updateArgs({ "aria-current": "location" });
  }

  return <NavLink {...args} onClick={handleClick} />;
}

const meta = {
  title: "Components/NavLink",
  component: NavLink,
  render: InteractiveStory,
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
    children: { control: "text" },
    href: { control: "text" },
    color: {
      control: "color",
      description:
        "Optional CSS accent for hover/current text and underline. Omit for semantic defaults; choose a color with readable contrast against the preview background.",
    },
    variant: { options: ["simple", "underline"], control: "inline-radio" },
    "aria-current": {
      options: [undefined, "page", "location", false],
      control: "select",
      description:
        "Native current destination; omitted or false is inactive. Use page for a page and location for a section.",
    },
    previewColorMode: {
      name: "Preview color mode",
      description:
        "Storybook-only shared color-mode preview; not a NavLink prop.",
      options: ["light", "dark"],
      control: {
        type: "inline-radio",
        labels: { light: "Light", dark: "Dark" },
      },
    },
  },
  parameters: {
    controls: {
      include: [
        "children",
        "href",
        "variant",
        "color",
        "aria-current",
        "Preview color mode",
      ],
    },
    docs: {
      description: {
        component:
          "A native navigation anchor with required href, standard anchor props, and simple (default) or underline styling. aria-current is the single source of current styling; omitted or false means inactive. Simple links brighten on hover/current. Underline links reveal a subdued line on hover and a solid line when current, without changing dimensions. Keyboard focus uses a subtle 1px shadow and transitions respect reduced motion. color optionally accents hover/current text and the inherited underline; choose readable contrast for the surrounding theme. Omitting color retains semantic defaults. className adds consumer layout classes. Supply meaningful children or an accessible name. The component has no routing, selection state, disabled behavior, or theme logic. Examples prevent navigation and update their own current state only to keep Storybook interactive; production links retain native navigation.",
      },
    },
  },
  args: {
    children: "Home",
    href: "#home",
    variant: "simple",
    color: undefined,
    "aria-current": undefined,
    onClick: fn(),
    previewColorMode: "light",
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Underline: Story = { args: { variant: "underline" } };
export const CustomColor: Story = {
  args: { color: "#006c73", variant: "underline", "aria-current": "page" },
};

const destinations = [
  { href: "#home", label: "Home" },
  { href: "#journey", label: "Journey" },
  { href: "#stack", label: "Stack" },
];

function NavigationExample({
  variant,
  previewColorMode,
  onClick,
  color,
}: StoryArgs) {
  const [currentHref, setCurrentHref] = useState("#home");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    event.preventDefault();
    setCurrentHref(event.currentTarget.getAttribute("href") ?? "#home");
  }

  return (
    <nav
      aria-label={`${previewColorMode} ${variant} example`}
      className="flex max-w-full flex-wrap gap-x-8 gap-y-2"
    >
      {destinations.map((destination) => (
        <NavLink
          key={destination.href}
          href={destination.href}
          variant={variant}
          color={color}
          aria-current={
            currentHref === destination.href ? "location" : undefined
          }
          onClick={handleClick}
        >
          {destination.label}
        </NavLink>
      ))}
    </nav>
  );
}

export const ColorModes: Story = {
  render: (args) => (
    <div className="flex max-w-full flex-wrap gap-4">
      {(["light", "dark"] as const).map((mode) => (
        <section
          key={mode}
          data-theme={mode}
          className="min-w-0 max-w-full space-y-3 rounded-xl bg-background p-4 text-foreground"
        >
          <h2 className="text-sm font-medium">
            {mode === "light" ? "Light" : "Dark"}
          </h2>
          <NavigationExample
            {...args}
            previewColorMode={mode}
            variant="simple"
          />
          <NavigationExample
            {...args}
            previewColorMode={mode}
            variant="underline"
          />
        </section>
      ))}
    </div>
  ),
  parameters: {
    controls: {
      exclude: [
        "children",
        "href",
        "variant",
        "aria-current",
        "Preview color mode",
      ],
    },
  },
};

export const ConstrainedWidth: Story = {
  args: {
    children: "Explore projects and frontend architecture",
    variant: "underline",
    "aria-current": "page",
  },
  decorators: [
    (Story) => (
      <div className="w-40 max-w-full">
        <Story />
      </div>
    ),
  ],
};

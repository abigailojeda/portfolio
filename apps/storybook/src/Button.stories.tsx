import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "@portfolio/ui-react";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    controls: { include: ["children", "disabled", "type"] },
  },
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
  },
  args: {
    children: "Continue",
    disabled: false,
    type: "button",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

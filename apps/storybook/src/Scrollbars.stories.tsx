import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Scrollbars",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SharedThemes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(["light", "dark"] as const).map((mode) => (
        <section
          key={mode}
          data-theme={mode}
          className="w-64 max-w-full rounded-xl bg-background p-4 text-foreground"
        >
          <h2 className="mb-3 font-semibold">
            {mode === "light" ? "Light" : "Dark"} scrollbars
          </h2>
          <p className="mb-3 text-sm">
            Shared native styling, including plain scrollable content.
          </p>
          <div
            className="max-h-32 overflow-y-auto rounded border border-border bg-surface p-2"
            tabIndex={0}
            role="region"
            aria-label={`${mode} vertical scrolling`}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index}>Scrollable item {index + 1}</p>
            ))}
          </div>
          <div
            className="mt-4 overflow-x-auto rounded border border-border bg-surface p-2"
            tabIndex={0}
            role="region"
            aria-label={`${mode} horizontal scrolling`}
          >
            <p className="w-max">
              Horizontal content uses the same shared scrollbar foundation.
            </p>
          </div>
        </section>
      ))}
    </div>
  ),
};

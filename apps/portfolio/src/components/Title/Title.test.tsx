import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Title } from "./Title";

describe("Title", () => {
  it.each([
    ["h1", 1, "hero"],
    ["h2", 2, "section"],
    ["h3", 3, "section"],
  ] as const)(
    "renders %s with the requested heading level",
    (as, level, size) => {
      render(
        <Title as={as} size={size}>
          Section title
        </Title>,
      );

      expect(
        screen.getByRole("heading", { level, name: "Section title" }),
      ).toBeInTheDocument();
    },
  );
});

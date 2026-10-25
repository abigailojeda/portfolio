import { Button } from "../../index";

// Compiled by the library type check, never included in the bundle.
export function buttonTypeChecks() {
  const button = (
    <Button
      onClick={(event) => {
        const element: HTMLButtonElement = event.currentTarget;
        return element;
      }}
    >
      Save
    </Button>
  );
  const link = (
    <Button
      href="/contact"
      onClick={(event) => {
        const element: HTMLAnchorElement = event.currentTarget;
        return element;
      }}
    >
      Contact
    </Button>
  );
  const icon = (
    <Button icon={<svg />} aria-label="Close" paddingX={12} paddingY="0.5rem" />
  );
  const disabledLink = (
    // @ts-expect-error Disabled is a native button attribute, not a link attribute.
    <Button href="/contact" disabled>
      Contact
    </Button>
  );
  const linkForm = (
    // @ts-expect-error Form association belongs to buttons.
    <Button href="/contact" form="form">
      Contact
    </Button>
  );
  // @ts-expect-error Unsupported appearance.
  const variant = <Button variant="ghost">Save</Button>;

  return [button, link, icon, disabledLink, linkForm, variant];
}

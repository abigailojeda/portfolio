import {
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type RefObject,
} from "react";

export function useRadioGroupFocus(groupRef: RefObject<HTMLDivElement | null>) {
  const focusedInput = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    const previousInput = focusedInput.current;

    if (
      !previousInput ||
      (previousInput.isConnected && !previousInput.disabled)
    ) {
      return;
    }

    const ownerDocument = previousInput.ownerDocument;
    const activeElement = ownerDocument.activeElement;

    focusedInput.current = null;

    if (
      activeElement !== previousInput &&
      activeElement !== ownerDocument.body
    ) {
      return;
    }

    // Browsers drop focus when a radio is removed or disabled; recover locally.
    const enabledInputs = Array.from(
      groupRef.current?.querySelectorAll<HTMLInputElement>(
        'input[type="radio"]:not(:disabled)',
      ) ?? [],
    );
    const replacementInput =
      enabledInputs.find((input) => input.checked) ?? enabledInputs[0];

    if (replacementInput) {
      replacementInput.focus();
    } else if (activeElement === previousInput) {
      previousInput.blur();
    }
  });

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget;

    focusedInput.current = input;

    // Native radio arrows can leave long segments only partly visible.
    input.scrollIntoView?.({
      block: "nearest",
      inline: "nearest",
    });
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget;

    if (input.isConnected && !input.disabled) {
      focusedInput.current = null;
    }
  }

  return { onFocus: handleFocus, onBlur: handleBlur };
}

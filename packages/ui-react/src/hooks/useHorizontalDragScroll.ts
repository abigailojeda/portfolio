import {
  useRef,
  type MouseEvent,
  type PointerEvent,
  type FocusEvent,
} from "react";

type DragGesture = {
  pointerId: number;
  startX: number;
  scrollLeft: number;
  dragging: boolean;
};

const DRAG_THRESHOLD = 6;

export function useHorizontalDragScroll() {
  const dragGesture = useRef<DragGesture | null>(null);
  const suppressClick = useRef(false);

  function updateScrollable(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const container = event.currentTarget;

    container.toggleAttribute(
      "data-scrollable",
      container.scrollWidth > container.clientWidth,
    );
  }

  function finishDrag(event: PointerEvent<HTMLElement>) {
    if (dragGesture.current?.pointerId !== event.pointerId) {
      return;
    }

    dragGesture.current = null;
    event.currentTarget.removeAttribute("data-dragging");

    // Normal release loses capture before click; keep suppression until that click.
    if (event.type === "pointercancel") {
      suppressClick.current = false;
    }

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.isPrimary) {
      suppressClick.current = false;
    }

    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      !event.isPrimary
    ) {
      return;
    }

    const container = event.currentTarget;

    updateScrollable(event);

    const contentBottom =
      container.getBoundingClientRect().top +
      container.clientTop +
      container.clientHeight;

    // Leave presses in the native horizontal scrollbar to the browser.
    if (
      container.scrollWidth <= container.clientWidth ||
      event.clientY >= contentBottom
    ) {
      return;
    }

    dragGesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
      dragging: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    updateScrollable(event);

    const gesture = dragGesture.current;

    if (!gesture || gesture.pointerId !== event.pointerId) {
      return;
    }

    if (!(event.buttons & 1)) {
      finishDrag(event);
      return;
    }

    const delta = event.clientX - gesture.startX;

    if (!gesture.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) {
        return;
      }

      gesture.dragging = true;
      suppressClick.current = true;
      event.currentTarget.setAttribute("data-dragging", "");
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = gesture.scrollLeft - delta;
  }

  function handlePointerLeave() {
    if (!dragGesture.current?.dragging) {
      dragGesture.current = null;
    }
  }

  function handleClickCapture(event: MouseEvent<HTMLElement>) {
    if (suppressClick.current && event.detail > 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    }
  }

  function handleFocus(event: FocusEvent<HTMLElement>) {
    const gesture = dragGesture.current;

    // Child focus handlers may reveal content before this event bubbles here.
    if (gesture && !gesture.dragging) {
      gesture.scrollLeft = event.currentTarget.scrollLeft;
    }
  }

  return {
    onPointerEnter: updateScrollable,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: finishDrag,
    onPointerCancel: finishDrag,
    onLostPointerCapture: finishDrag,
    onPointerLeave: handlePointerLeave,
    onClickCapture: handleClickCapture,
    onFocus: handleFocus,
  };
}

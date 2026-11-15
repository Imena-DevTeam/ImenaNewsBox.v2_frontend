import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Lightbox, type LightboxPhoto } from "./Lightbox";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  HTMLElement.prototype.setPointerCapture = () => {};
});

const photo = (n: number): LightboxPhoto => ({
  image: `/p${n}.jpg`,
  alt: `Photo ${n}`,
  date: "2026-01-01",
  event: "Fete",
  location: "Kigali",
  tagged: [],
});
const photos = [photo(1), photo(2), photo(3)];

function frame() {
  return screen.getByAltText("Photo 2").parentElement!;
}

function swipe(dx: number, dy: number) {
  const el = frame();
  const base = { pointerId: 1, pointerType: "touch" };
  fireEvent.pointerDown(el, { ...base, clientX: 200, clientY: 200 });
  fireEvent.pointerMove(el, { ...base, clientX: 200 + dx, clientY: 200 + dy });
  fireEvent.pointerUp(el, { ...base, clientX: 200 + dx, clientY: 200 + dy });
}

describe("Lightbox on a touch screen", () => {
  it("swipes left to the next photograph and right to the one before", () => {
    const onIndex = vi.fn();
    render(
      <Lightbox
        photos={photos}
        index={1}
        open
        onIndex={onIndex}
        onClose={() => {}}
      />,
    );
    swipe(-120, 5);
    expect(onIndex).toHaveBeenLastCalledWith(2);
    swipe(120, 5);
    expect(onIndex).toHaveBeenLastCalledWith(0);
  });

  it("closes on a swipe down", () => {
    const onClose = vi.fn();
    render(
      <Lightbox
        photos={photos}
        index={1}
        open
        onIndex={() => {}}
        onClose={onClose}
      />,
    );
    swipe(5, 200);
    expect(onClose).toHaveBeenCalled();
  });

  it("ignores a small wobble", () => {
    const onIndex = vi.fn();
    const onClose = vi.fn();
    render(
      <Lightbox
        photos={photos}
        index={1}
        open
        onIndex={onIndex}
        onClose={onClose}
      />,
    );
    swipe(20, 20);
    expect(onIndex).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});

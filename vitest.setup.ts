import "@testing-library/jest-dom/vitest";

/**
 * jsdom 28 builds <dialog> but implements neither showModal() nor close(),
 * so every component in this codebase that uses the native dialog — seven of
 * them — threw "showModal is not a function" the moment a test opened one.
 * That is why none of them had a test that opened one.
 *
 * This is the smallest stand-in that makes them testable: it tracks the open
 * attribute and fires the close event the components listen for. It does not
 * pretend to implement the top layer, focus trapping or inertness, which are
 * the browser's job and are not what these tests are checking.
 */
const dialog = globalThis.HTMLDialogElement?.prototype;

if (dialog && !dialog.showModal) {
  dialog.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  dialog.show = function show(this: HTMLDialogElement) {
    this.open = true;
  };
  dialog.close = function close(this: HTMLDialogElement, value?: string) {
    this.open = false;
    if (value !== undefined) this.returnValue = value;
    this.dispatchEvent(new Event("close"));
  };
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Check, Heart, PartyPopper, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const MAX_LENGTH = 280;

/** The family's own palette, so the burst looks like the site's. */
const CONFETTI_COLOURS = [
  "#5935da",
  "#bfa3d3",
  "#f26493",
  "#f2c14e",
  "#ffffff",
];

export interface WishTarget {
  name: string;
  subfamily: string;
}

const presets = (target: WishTarget) => [
  `Isabukuru nziza, ${target.name}! May this year bring you joy and peace.`,
  `Happy birthday from all of us in the ${target.subfamily} family!`,
  `Another year of laughter and light — we are proud of you, ${target.name}.`,
  `May God bless you with many more years among us. Isabukuru nziza!`,
];

/**
 * Sending a birthday wish without leaving the page: pick one of the
 * family's prepared wishes or write your own, then send — and the page
 * answers with a burst of confetti in the family's colours.
 *
 * There is no messaging service yet, so a sent wish is kept on this device
 * and the dialog says so plainly; it does not claim the wish was delivered.
 * Confetti is skipped for anyone who asked for reduced motion.
 */
export function WishDialog({
  target,
  onClose,
  onSent,
}: {
  target: WishTarget | null;
  onClose: () => void;
  onSent: (target: WishTarget, message: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState<number | "own" | null>(null);
  const [own, setOwn] = useState("");
  const [sent, setSent] = useState(false);
  const groupName = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (target && !element.open) {
      setChoice(null);
      setOwn("");
      setSent(false);
      element.showModal();
    }
    if (!target && element.open) element.close();
  }, [target]);

  if (!target) return <dialog ref={dialog} className="hidden" />;

  const options = presets(target);
  const message =
    choice === "own"
      ? own.trim()
      : choice === null
        ? ""
        : (options[choice] ?? "");

  const send = () => {
    if (!message) return;
    onSent(target, message);
    setSent(true);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const burst = (x: number, angle: number) =>
        confetti({
          particleCount: 90,
          spread: 70,
          angle,
          startVelocity: 55,
          origin: { x, y: 0.7 },
          colors: CONFETTI_COLOURS,
          zIndex: 2147483647,
        });
      burst(0.2, 60);
      burst(0.8, 120);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="wish-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      className={cn(
        "m-auto w-[min(100vw-2rem,32rem)] max-w-none rounded-3xl bg-transparent p-0",
        "backdrop:bg-member-ink/40 backdrop:backdrop-blur-sm",
        "open:animate-dialog-pop motion-reduce:animate-none",
      )}
    >
      <div className="bg-surface overflow-hidden rounded-3xl shadow-2xl">
        <header className="from-member-night to-brand text-surface relative bg-gradient-to-br px-6 pt-6 pb-5">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full hover:bg-white/15 focus-visible:outline-white"
          >
            <X aria-hidden className="size-5" />
          </button>
          <PartyPopper aria-hidden className="text-celebration-gold size-8" />
          <h2 id="wish-title" className="text-h3-m mt-3">
            {sent
              ? `Wish saved for ${target.name}`
              : `Send ${target.name} a wish`}
          </h2>
          <p className="text-body-sm text-surface/75 mt-1">
            {target.subfamily} family
          </p>
        </header>

        {sent ? (
          <div className="px-6 py-6">
            <p className="bg-member-tint text-member-ink text-body-sm rounded-2xl p-4 italic">
              &ldquo;{message}&rdquo;
            </p>
            <p className="text-body-sm text-muted mt-4 flex gap-2">
              <Check
                aria-hidden
                className="text-brand mt-0.5 size-4 shrink-0"
              />
              <span role="status">
                Kept on this device. It will reach {target.name} once family
                messaging is connected.
              </span>
            </p>
            <Button
              variant="brand"
              className="mt-6 w-full"
              onClick={() => dialog.current?.close()}
            >
              Done
            </Button>
          </div>
        ) : (
          <form
            className="px-6 py-6"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <fieldset>
              <legend className="text-body-sm text-member-ink font-semibold">
                Choose a family wish
              </legend>
              <div className="mt-3 space-y-2">
                {options.map((text, optionIndex) => (
                  <label
                    key={text}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition-colors",
                      choice === optionIndex
                        ? "border-brand bg-member-tint"
                        : "border-member-border hover:bg-member-panel",
                    )}
                  >
                    <input
                      type="radio"
                      name={groupName}
                      checked={choice === optionIndex}
                      onChange={() => setChoice(optionIndex)}
                      className="accent-brand mt-1"
                    />
                    <span className="text-body-sm text-member-ink">{text}</span>
                  </label>
                ))}

                <label
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition-colors",
                    choice === "own"
                      ? "border-brand bg-member-tint"
                      : "border-member-border hover:bg-member-panel",
                  )}
                >
                  <input
                    type="radio"
                    name={groupName}
                    checked={choice === "own"}
                    onChange={() => setChoice("own")}
                    className="accent-brand mt-1"
                  />
                  <span className="text-body-sm text-member-ink">
                    Write your own
                  </span>
                </label>
              </div>
            </fieldset>

            {choice === "own" ? (
              <div className="mt-3">
                <label htmlFor="own-wish" className="sr-only">
                  Your message to {target.name}
                </label>
                <textarea
                  id="own-wish"
                  autoFocus
                  rows={3}
                  maxLength={MAX_LENGTH}
                  value={own}
                  onChange={(event) => setOwn(event.target.value)}
                  placeholder={`Write something for ${target.name}…`}
                  className="border-member-border text-body-sm focus-visible:outline-brand w-full resize-none rounded-2xl border p-3.5"
                />
                <p className="text-caption-sm text-muted mt-1 text-right tabular-nums">
                  {own.length} / {MAX_LENGTH}
                </p>
              </div>
            ) : null}

            <Button
              type="submit"
              variant="brand"
              className="mt-6 w-full"
              disabled={!message}
            >
              <Heart aria-hidden className="size-4" />
              Send wish
            </Button>
          </form>
        )}
      </div>
    </dialog>
  );
}

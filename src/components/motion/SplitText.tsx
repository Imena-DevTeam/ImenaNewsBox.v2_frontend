"use client";

import { m, type Variants } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_OUT_SOFT, VIEWPORT } from "@/components/motion/tokens";

/* One run of text within a line, optionally in its own colour. */
export type Segment = string | { text: string; className?: string };

const TAGS = { h1: m.h1, h2: m.h2, p: m.p } as const;

/**
 * Heading text that rises into place word by word (or letter by letter),
 * each piece coming up out of a soft blur — after React Bits' BlurText.
 *
 * `lines` is a list of lines, each a list of segments, so a heading that
 * breaks onto two lines or picks one word out in colour keeps that exactly.
 *
 * Screen readers get the sentence once, from the visually hidden copy; the
 * animated pieces are hidden from them, so nobody hears it spelt out.
 */
export function SplitText({
  as = "h2",
  lines,
  by = "word",
  stagger,
  delay = 0,
  onMount = false,
  className,
}: {
  as?: keyof typeof TAGS;
  lines: Segment[][];
  by?: "word" | "char";
  stagger?: number;
  delay?: number;
  onMount?: boolean;
  className?: string;
}) {
  const Tag = TAGS[as];
  const step = stagger ?? (by === "char" ? 0.025 : 0.07);
  const text = lines
    .map((line) =>
      line.map((s) => (typeof s === "string" ? s : s.text)).join(""),
    )
    .join(" ");

  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  const piece: Variants = {
    hidden: { opacity: 0, y: "0.6em", filter: "blur(10px)" },
    shown: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: DURATION.cinematic, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      {...(onMount
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: VIEWPORT })}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className={cn(lines.length > 1 && "block")}>
            {line.map((segment, segmentIndex) => {
              const { text: run, className: tone } =
                typeof segment === "string" ? { text: segment } : segment;

              /* Split on spaces but keep them, so words still wrap and the
                 spacing matches the plain text exactly. */
              return run.split(/(\s+)/).map((word, wordIndex) => {
                if (!word) return null;
                if (/^\s+$/.test(word)) return word;

                const key = `${segmentIndex}-${wordIndex}`;
                if (by === "word") {
                  return (
                    <m.span
                      key={key}
                      data-motion
                      variants={piece}
                      className={cn("inline-block", tone)}
                    >
                      {word}
                    </m.span>
                  );
                }

                /* Letters of a word stay together, so a word never breaks
                   across two lines mid-animation. */
                return (
                  <span
                    key={key}
                    className={cn("inline-block whitespace-nowrap", tone)}
                  >
                    {Array.from(word).map((char, charIndex) => (
                      <m.span
                        key={charIndex}
                        data-motion
                        variants={piece}
                        className="inline-block"
                      >
                        {char}
                      </m.span>
                    ))}
                  </span>
                );
              });
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}

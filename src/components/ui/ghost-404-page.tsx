"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { ghost } from "@/lib/images";
import { FlowButton } from "./FlowButton";

/* One easing for the whole entrance, so the pieces read as a single gesture. */
const EASE = [0.43, 0.13, 0.23, 0.96] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE,
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* The two 4s fly in from opposite sides. */
const numberVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const ghostVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, y: 15, rotate: -5 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: EASE },
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      rotate: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  },
};

const FOUR = "font-heading text-ghost-m md:text-ghost text-text select-none";

/**
 * The page a missing address lands on: a ghost between two 4s that float
 * in, and a way home.
 *
 * Motion is honoured per the visitor's setting — `reducedMotion="user"`
 * turns the flights and floating off for anyone who asked for less — and
 * "What does 404 mean?" is a real disclosure instead of a dead link.
 */
export function NotFound() {
  const [explaining, setExplaining] = useState(false);
  const explanationId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-surface flex min-h-dvh flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className="mb-8 flex items-center justify-center gap-4 md:mb-12 md:gap-6"
            role="img"
            aria-label="404, with a ghost for the zero"
          >
            <motion.span
              aria-hidden
              className={FOUR}
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>
            <motion.div
              aria-hidden
              variants={ghostVariants}
              whileHover="hover"
              animate={["visible", "floating"]}
            >
              <Image
                src={ghost}
                alt=""
                /* The file's own size; CSS sets how big it is shown. */
                width={161}
                height={200}
                priority
                draggable={false}
                className="h-20 w-auto object-contain select-none md:h-30"
              />
            </motion.div>
            <motion.span
              aria-hidden
              className={FOUR}
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>

          <motion.h1
            className="text-h2-m md:text-h1 text-text mb-4 opacity-70 md:mb-6"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>

          <motion.p
            className="text-body-lg text-text mb-8 opacity-60 md:mb-12"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost &mdash; it&apos;s not here!
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <FlowButton text="Find shelter" href={ROUTES.HOME} />
          </motion.div>

          <motion.div className="mt-12" variants={itemVariants}>
            <button
              type="button"
              onClick={() => setExplaining((open) => !open)}
              aria-expanded={explaining}
              aria-controls={explanationId}
              className="text-text text-body-sm focus-visible:outline-brand underline opacity-60 transition-opacity hover:opacity-80"
            >
              What does 404 mean?
            </button>
            <p
              id={explanationId}
              hidden={!explaining ? true : undefined}
              className="text-body-sm text-muted mx-auto mt-3 max-w-sm"
            >
              It is the web&rsquo;s way of saying the address you asked for does
              not exist &mdash; usually a mistyped link, or a page that has
              moved on.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

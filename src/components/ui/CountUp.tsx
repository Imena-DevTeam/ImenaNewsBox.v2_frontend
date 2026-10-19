"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value` the first time it is scrolled into view.
 *
 * The final value is what renders on the server and what sits in the markup
 * before any of this runs, so the figure is correct without JavaScript, for a
 * crawler, and for anyone who asked for reduced motion. The animation only
 * ever replaces a number that is already right.
 */
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !("IntersectionObserver" in window)) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          /* Matches --ease-out-soft: quick off the mark, settling at the end. */
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        setShown(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {/* The accessible value never changes while the digits tick. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden>
        {shown}
        {suffix}
      </span>
    </span>
  );
}

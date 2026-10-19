"use client";

import { useCallback, useEffect, useState } from "react";

/** Counts down to zero once per second; `restart` puts it back to `seconds`. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const restart = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, isComplete: remaining <= 0, restart };
}

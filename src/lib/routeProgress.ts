/**
 * The top navigation bar's state, held outside React.
 *
 * A click starts it; the new route committing finishes it. Because there is
 * no real "percent compiled" to read — Turbopack does not report one, and
 * neither does a production navigation — the width is an honest fake, the
 * way YouTube's and nprogress's are: it eases quickly toward 90% and waits
 * there, then snaps to 100% the moment the page actually arrives. What it
 * promises is truthful: something is happening, and it is nearly done.
 *
 * It lives in a module, not in React state, so the effects that drive it only
 * *call* these functions — never a `useState` setter inside an effect, which
 * this project treats as an error. The bar reads it with `useSyncExternalStore`.
 */

export interface ProgressSnapshot {
  /** 0–100. Drives the bar's horizontal scale. */
  readonly width: number;
  /** Whether the bar is on screen (controls the fade). */
  readonly active: boolean;
}

const HIDDEN: ProgressSnapshot = { width: 0, active: false };

let snapshot: ProgressSnapshot = HIDDEN;
const listeners = new Set<() => void>();

let trickle: ReturnType<typeof setInterval> | null = null;
let hide: ReturnType<typeof setTimeout> | null = null;
let safety: ReturnType<typeof setTimeout> | null = null;

function set(next: ProgressSnapshot): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

function clearTimers(): void {
  if (trickle) clearInterval(trickle);
  if (hide) clearTimeout(hide);
  if (safety) clearTimeout(safety);
  trickle = hide = safety = null;
}

/** Show the bar and begin easing it toward 90%. A no-op if already running. */
export function start(): void {
  if (snapshot.active) return;
  clearTimers();
  set({ width: 10, active: true });

  trickle = setInterval(() => {
    const { width } = snapshot;
    if (width >= 90) return;
    // Ease: big steps early, small steps near the top, never past 90.
    const step = Math.max(0.6, (90 - width) * 0.1);
    set({ width: Math.min(90, width + step), active: true });
  }, 280);

  // A navigation that never commits (same-URL click, a block) must not leave
  // the bar stranded. Finish it either way after a generous wait.
  safety = setTimeout(finish, 15000);
}

/** Snap to 100% and fade out. A no-op when the bar is not showing. */
export function finish(): void {
  if (!snapshot.active) return;
  clearTimers();
  set({ width: 100, active: true });
  hide = setTimeout(() => set(HIDDEN), 280);
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): ProgressSnapshot {
  return snapshot;
}

export function getServerSnapshot(): ProgressSnapshot {
  return HIDDEN;
}

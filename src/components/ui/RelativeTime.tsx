const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "3 days ago", down to "just now". Past tense only; nothing here is future. */
function relative(from: Date, now: Date): string {
  const elapsed = now.getTime() - from.getTime();
  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(elapsed / DAY);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/**
 * A timestamp people can read, with the exact one kept in the markup.
 *
 * The face is relative because that is what a reader wants from an activity
 * list; the `datetime` attribute and the tooltip carry the precise value, so
 * nothing is lost and assistive technology gets a real date.
 *
 * `now` is a parameter so this renders identically on the server and the
 * client: computing it inside would differ between the two and hydrate
 * badly.
 */
export function RelativeTime({
  iso,
  now,
  className,
}: {
  iso: string;
  now: string;
  className?: string;
}) {
  const at = new Date(iso);
  const exact = at.toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  });

  return (
    <time dateTime={iso} title={exact} className={className}>
      {relative(at, new Date(now))}
    </time>
  );
}

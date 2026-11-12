/**
 * The day of an entry, as the two pieces the card sets on its own lines:
 * "31" over "MAY".
 *
 * UTC, and en-US like formatPostDate, so an entry never shifts a day
 * depending on where it is read.
 */
export function entryDay(iso: string): { day: string; month: string } {
  const at = new Date(`${iso}T00:00:00Z`);
  return {
    day: at.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" }),
    month: at.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
  };
}

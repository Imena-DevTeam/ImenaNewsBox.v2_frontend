/**
 * The lines that make the grid a tree. Drawn in a stretched 100 x 40 box,
 * with strokes that do not scale, so the curves meet the middle of each
 * column at any width. Decorative, and hidden below the width where the
 * tiers sit side by side.
 *
 * "leadership" joins the two elders down to the coordinators; "branches"
 * joins the coordinators out to the three families.
 */
export function TreeConnectorLines({
  kind,
}: {
  kind: "leadership" | "branches";
}) {
  const paths =
    kind === "leadership"
      ? [
          "M25 0 C25 18 50 12 50 20",
          "M75 0 C75 18 50 12 50 20",
          "M50 20 C50 28 25 22 25 40",
          "M50 20 C50 28 75 22 75 40",
        ]
      : [
          "M25 0 C25 12 50 8 50 16",
          "M75 0 C75 12 50 8 50 16",
          "M50 16 C50 28 16.67 22 16.67 40",
          "M50 16 V40",
          "M50 16 C50 28 83.33 22 83.33 40",
        ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={
        kind === "branches"
          ? "text-brand/30 hidden h-14 w-full lg:block"
          : "text-brand/30 hidden h-14 w-full md:block"
      }
    >
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

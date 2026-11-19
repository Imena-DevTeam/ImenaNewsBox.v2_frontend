/**
 * Names that carry one element across a page change. Kept apart from
 * `viewTransition.ts`, which pulls in `react-dom`, so a server component can
 * name its half of a transition too.
 */

/** The name a post's photograph carries from its card into its page. */
export function coverTransitionName(slug: string): string {
  return `cover-${slug.replace(/[^a-z0-9-]/gi, "")}`;
}

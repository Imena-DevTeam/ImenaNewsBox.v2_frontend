/**
 * The close of every member page: the design's grey bar, run the full width
 * of the page rather than the content column, and the family copyright
 * centred under it.
 */
export function MemberFooter() {
  return (
    <footer className="mt-9 w-full">
      <div aria-hidden className="bg-member-rule h-1.75 w-full" />
      <p className="text-muted text-body-sm py-8 text-center">
        &copy; Copyright {new Date().getFullYear()}, All Rights Reserved by
        IMENA FAMILY.
      </p>
    </footer>
  );
}

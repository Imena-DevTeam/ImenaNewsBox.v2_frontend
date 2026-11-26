/**
 * What the register says when the backend could not be asked. Never an
 * empty table: "nobody is in the family" and "we could not look" are not
 * the same answer.
 */
export function RegisterUnavailable() {
  return (
    <div className="border-member-border bg-member-panel rounded-md border px-5 py-6">
      <p role="alert" className="text-body-sm text-muted">
        The register could not be loaded. Reload the page in a moment.
      </p>
    </div>
  );
}

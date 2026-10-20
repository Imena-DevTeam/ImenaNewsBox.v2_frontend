/** "OR" between two flat rules. */
export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="bg-divider-line h-px flex-1" />
      <span className="text-divider-text text-sm font-medium">OR</span>
      <span className="bg-divider-line h-px flex-1" />
    </div>
  );
}

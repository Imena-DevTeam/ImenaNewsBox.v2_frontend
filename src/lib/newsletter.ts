/**
 * Shape and starting value for the footer newsletter form.
 *
 * These live outside the action file on purpose: a "use server" module may
 * only export async functions, so exporting this object from there makes the
 * request fail at runtime with "can only export async functions, found
 * object" — which type-checking and linting do not catch.
 */
export type NewsletterState = {
  status: "idle" | "error" | "notice";
  message: string;
};

export const NEWSLETTER_INITIAL: NewsletterState = {
  status: "idle",
  message: "",
};

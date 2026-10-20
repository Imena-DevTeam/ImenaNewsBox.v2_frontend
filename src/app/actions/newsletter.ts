"use server";

import { CONTACT_EMAIL } from "@/constants/site";
import type { NewsletterState } from "@/lib/newsletter";

/**
 * Handles the footer newsletter form.
 *
 * There is no subscriber store yet, so this validates the address and then
 * says plainly that nothing has been signed up, pointing at an inbox that
 * does work. It deliberately does not thank people for subscribing to a
 * newsletter they have not been added to.
 *
 * TODO: when the backend exists, persist the address here and return a real
 * confirmation.
 *
 * Only async functions may be exported from this file — see @/lib/newsletter
 * for the state type and its initial value.
 */
export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  return {
    status: "notice",
    message: `The family newsletter is not sending yet, so nothing has been signed up. Write to ${CONTACT_EMAIL} and we will add you when it starts.`,
  };
}

"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Handles the sign-in form.
 *
 * There is no authentication backend yet, so both the password form and the
 * Google button end at the step that does exist: the one-time code. The
 * provider is read here so that, when there is a backend, this branches
 * rather than the page growing a second form.
 *
 * Being a server action rather than a link is what makes the form behave like
 * one — pressing Enter in a field submits it, and it still works with no
 * JavaScript at all.
 *
 * TODO: verify the credentials, and send the code to the address on file.
 */
export async function signIn(formData: FormData) {
  const provider =
    formData.get("provider") === "google" ? "google" : "password";
  void provider;

  redirect(ROUTES.VERIFY);
}

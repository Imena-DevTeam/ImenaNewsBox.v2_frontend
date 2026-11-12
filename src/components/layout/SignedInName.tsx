"use client";

import { useSignedIn } from "./SignedIn";

/**
 * "Ngabe, Wihogora family" — the one line the footer shows about whoever is
 * reading it.
 *
 * The footer is a server component and the name comes from the session, so
 * this is the smallest possible client island rather than a reason to make
 * the whole footer one.
 */
export function SignedInName() {
  const person = useSignedIn();

  return (
    <>
      {person.name}
      {person.subfamily ? `, ${person.subfamily} family` : ""}
    </>
  );
}

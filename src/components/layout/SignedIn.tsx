"use client";

import { createContext, useContext, type ReactNode } from "react";
import { MEMBER, type Person } from "@/constants/member";

const SignedInContext = createContext<Person>(MEMBER);

/**
 * Who is reading the page, for the header, the footer and the dashboard.
 *
 * The member layout asks the server once per request (lib/viewer.ts) and
 * hands the answer down here, so no page has to think about it. With a
 * backend it is the signed-in account; in fixture mode, the sample person
 * the session's role stands for.
 */
export function SignedInProvider({
  person,
  children,
}: {
  person: Person;
  children: ReactNode;
}) {
  return <SignedInContext value={person}>{children}</SignedInContext>;
}

export function useSignedIn(): Person {
  return useContext(SignedInContext);
}

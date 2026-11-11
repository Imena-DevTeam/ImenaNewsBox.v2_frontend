"use client";

import { createContext, useContext, type ReactNode } from "react";
import { MEMBER, signedInPerson, type Person } from "@/constants/member";
import type { Role } from "@/lib/session";

const SignedInContext = createContext<Person>(MEMBER);

/**
 * Who is reading the page.
 *
 * The member frame showed one hard-coded name, so every studio page greeted
 * the blogger as "Aganze · Family Member" while the line underneath said
 * "Signed in as Ngabe · Family blogger". The page contradicted itself.
 *
 * The role already reaches the member layout, which is the one server
 * component every member page passes through; this carries it the rest of
 * the way to the header without every page having to think about it.
 *
 * TODO: the session carries a role and not an identity, so the name still
 * comes from a constant per role rather than from the register. When the
 * auth API issues a real token, this provider is where the real person
 * arrives, and nothing that reads it has to change.
 */
export function SignedInProvider({
  role,
  children,
}: {
  role?: Role | null;
  children: ReactNode;
}) {
  return (
    <SignedInContext value={signedInPerson(role)}>{children}</SignedInContext>
  );
}

export function useSignedIn(): Person {
  return useContext(SignedInContext);
}

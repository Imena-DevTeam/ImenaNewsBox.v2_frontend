"use client";

import { useSignedIn } from "@/components/layout/SignedIn";

/**
 * The dashboard's welcome line: WELCOME, the member's name, and a full stop.
 * The name is the one word in brand violet, and the whole line is set in the
 * heavy welcome face the design reserves for it.
 */
export function DashboardGreeting() {
  const person = useSignedIn();

  return (
    <h1 className="text-welcome-m lg:text-welcome text-text leading-none tracking-tight uppercase">
      Welcome <span className="text-brand">{person.name}.</span>
    </h1>
  );
}

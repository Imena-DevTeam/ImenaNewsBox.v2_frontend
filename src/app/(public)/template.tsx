import type { ReactNode } from "react";

/* A template, unlike a layout, mounts afresh on every navigation, so each
   page arrives with a short rise instead of cutting in. The navbar and
   footer live in the layout and stay where they are.

   The entrance is plain CSS, the same one the member area uses, so the page
   is on screen as soon as its HTML lands. A script-driven entrance would
   hold the whole page transparent until React had hydrated it. */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <div className="route-enter">{children}</div>;
}

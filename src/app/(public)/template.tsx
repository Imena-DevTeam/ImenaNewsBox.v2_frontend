import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/* A template, unlike a layout, mounts afresh on every navigation, so each
   page arrives with a short rise instead of cutting in. The navbar and
   footer live in the layout and stay where they are. */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return (
    <Reveal onMount distance={16} duration={0.5}>
      {children}
    </Reveal>
  );
}

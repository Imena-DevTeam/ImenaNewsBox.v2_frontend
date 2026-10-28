import {
  Compass,
  Crown,
  Heart,
  Shield,
  Sprout,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { HierarchyRole, Subfamily } from "./types";

/**
 * Each branch has its own spirit and its own colour: the Sanctuary's royal
 * indigo, Light's amber, Wihogora's rose and Hope's sky. The class names are
 * written out in full so Tailwind can see them.
 */
export const BRANCH_THEME: Record<
  Subfamily,
  { card: string; chip: string; panel: string; heading: string }
> = {
  Sanctuary: {
    card: "border-sanctuary-edge bg-sanctuary-tint/60 hover:bg-sanctuary-tint",
    chip: "border-sanctuary-edge bg-sanctuary-tint text-sanctuary-ink",
    panel: "border-sanctuary-edge bg-sanctuary-tint/30",
    heading: "text-sanctuary-ink",
  },
  Light: {
    card: "border-light-edge bg-light-tint/60 hover:bg-light-tint",
    chip: "border-light-edge bg-light-tint text-light-ink",
    panel: "border-light-edge bg-light-tint/30",
    heading: "text-light-ink",
  },
  Wihogora: {
    card: "border-wihogora-edge bg-wihogora-tint/60 hover:bg-wihogora-tint",
    chip: "border-wihogora-edge bg-wihogora-tint text-wihogora-ink",
    panel: "border-wihogora-edge bg-wihogora-tint/30",
    heading: "text-wihogora-ink",
  },
  Hope: {
    card: "border-hope-edge bg-hope-tint/60 hover:bg-hope-tint",
    chip: "border-hope-edge bg-hope-tint text-hope-ink",
    panel: "border-hope-edge bg-hope-tint/30",
    heading: "text-hope-ink",
  },
};

export const BRANCH_ICON: Record<Subfamily, LucideIcon> = {
  Sanctuary: Crown,
  Light: Sun,
  Wihogora: Heart,
  Hope: Sprout,
};

export const ROLE_ICON: Record<HierarchyRole, LucideIcon> = {
  grand_pere: Crown,
  grand_mere: Crown,
  coordinator: Compass,
  vice_coordinator: Shield,
  pere_light: Sun,
  mere_light: Sun,
  pere_wihogora: Heart,
  mere_wihogora: Heart,
  pere_hope: Sprout,
  mere_hope: Sprout,
};

export function branchName(subfamily: Subfamily): string {
  return subfamily === "Sanctuary" ? "Sanctuary" : `${subfamily} family`;
}

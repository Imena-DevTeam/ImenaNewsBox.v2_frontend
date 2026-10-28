import Image from "next/image";
import { cn } from "@/lib/cn";
import { branchName } from "../branch";
import { ALL_MEMBERS, PROMOTIONS } from "../promotions";
import type { TreePerson } from "../types";
import { PairedHearts } from "./PairedHearts";

type Size = "lg" | "md" | "sm";

const SIZES: Record<Size, string> = {
  lg: "size-20 md:size-24",
  md: "size-16 md:size-20",
  sm: "size-12 md:size-16",
};

/* Which person floats where, as a share of the hero (read off the design):
   a promotion and a place in its order, so each face is somebody real in the
   data and its tooltip can say who. */
const FACES: {
  year: number;
  role: number;
  size: Size;
  left: string;
  top: string;
}[] = [
  { year: 4, role: 0, size: "lg", left: "20%", top: "26%" },
  { year: 1, role: 4, size: "sm", left: "36%", top: "50%" },
  { year: 2, role: 5, size: "md", left: "14%", top: "62%" },
  { year: 5, role: 6, size: "md", left: "58%", top: "36%" },
  { year: 3, role: 1, size: "lg", left: "78%", top: "16%" },
  { year: 0, role: 7, size: "sm", left: "78%", top: "54%" },
  { year: 6, role: 8, size: "md", left: "54%", top: "68%" },
  { year: 4, role: 9, size: "lg", left: "90%", top: "72%" },
  { year: 2, role: 3, size: "sm", left: "42%", top: "88%" },
  { year: 1, role: 2, size: "sm", left: "6%", top: "34%" },
];

const HEARTS: { left: string; top: string; tilt: string }[] = [
  { left: "44%", top: "18%", tilt: "-rotate-12" },
  { left: "92%", top: "32%", tilt: "rotate-12" },
  { left: "22%", top: "88%", tilt: "-rotate-12" },
  { left: "82%", top: "94%", tilt: "rotate-6" },
];

/** Where the tooltip sits, kept inside the page at either edge. */
function tooltipSide(left: string): string {
  const at = parseInt(left, 10);
  if (at < 25) return "left-0";
  if (at > 75) return "right-0";
  return "left-1/2 -translate-x-1/2";
}

/**
 * A constellation of living faces. Each drifts gently; hover or focus one
 * and it lifts and names itself: who they are, their promotion and their
 * branch.
 */
export function FloatingFaceHero() {
  return (
    <div className="relative mt-2 h-80 w-full md:h-112">
      {HEARTS.map((heart) => (
        <PairedHearts
          key={`${heart.left}-${heart.top}`}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2",
            heart.tilt,
          )}
          style={{ left: heart.left, top: heart.top }}
        />
      ))}

      {FACES.map((face, index) => {
        const person: TreePerson | undefined =
          PROMOTIONS[face.year]?.members[face.role] ?? ALL_MEMBERS[index];
        if (!person) return null;
        return (
          <div
            key={`${face.left}-${face.top}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus-within:z-20 hover:z-20"
            style={{ left: face.left, top: face.top }}
          >
            {/* The drift lives on its own wrapper so the lift on hover and
                the centring above never fight it. */}
            <div
              className="motion-safe:animate-float-slow"
              style={{ animationDelay: `${index * -0.9}s` }}
            >
              <div className="group relative">
                <button
                  type="button"
                  aria-label={`${person.name}, ${person.promotionYear} promotion, ${branchName(person.subfamily)}`}
                  className={cn(
                    "focus-visible:outline-brand relative block overflow-hidden rounded-full shadow-sm ring-2 ring-white/60",
                    "transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl focus-visible:scale-110",
                    SIZES[face.size],
                  )}
                >
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 6rem, 5rem"
                    className="object-cover object-top"
                  />
                </button>

                <p
                  role="tooltip"
                  className={cn(
                    "bg-surface/85 text-member-ink shadow-menu text-caption absolute top-full z-30 mt-2 hidden w-max max-w-56 rounded-xl px-3 py-2 font-normal backdrop-blur-md",
                    "group-focus-within:block group-hover:block",
                    tooltipSide(face.left),
                  )}
                >
                  <span className="block font-semibold">{person.name}</span>
                  {person.promotionYear} · {branchName(person.subfamily)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

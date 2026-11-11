import Image from "next/image";
import { Crown, Users } from "lucide-react";
import type { Subfamily } from "../data";

/**
 * The branch's own opening: its photograph under the same brand wash the
 * trinity cards use, with the name, what it holds, and who leads the
 * current generation. Deliberately the same treatment as the card the
 * visitor just clicked, so the page reads as that card opening.
 */
export function SubfamilyHeader({ family }: { family: Subfamily }) {
  return (
    <section
      aria-labelledby="subfamily-name"
      className="shadow-member relative flex min-h-70 items-end overflow-hidden rounded-lg md:min-h-96"
    >
      <Image
        src={family.image}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 768px) 100vw, 100vw"
        className="object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/10"
      />

      <span className="text-member-ink text-caption absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1 font-semibold backdrop-blur-md">
        <Users aria-hidden className="text-brand size-3.5" />
        {family.members} members
      </span>

      <div className="text-surface relative w-full p-5 md:p-8">
        <p className="text-caption text-surface/80 font-semibold tracking-[0.14em] uppercase">
          Family branch
        </p>
        <h2
          id="subfamily-name"
          className="text-h2-m md:text-h2 mt-1 font-semibold"
        >
          {family.name}
        </h2>
        <p className="text-body-sm text-surface/85 mt-2 max-w-prose">
          {family.holds}
        </p>
        <p className="text-caption text-surface/80 mt-4 flex items-center gap-1.5 border-t border-white/20 pt-3">
          <Crown aria-hidden className="text-celebration-gold size-3.5" />
          Generation leader: {family.leader}
        </p>
      </div>
    </section>
  );
}

import { Quote } from "@/components/ui/Quote";
import type { Subfamily } from "../data";

/**
 * The branch's motto, given the room the design gives a quote, with its
 * English sense underneath so the Kinyarwanda is never the only way in.
 */
export function SloganCallout({ family }: { family: Subfamily }) {
  return (
    <div className="border-member-border bg-member-panel rounded-lg border px-5 py-8 md:px-8 md:py-10">
      <Quote
        size="lg"
        align="center"
        meaning={family.mottoMeaning}
        cite={`The ${family.name} motto, kept since ${family.founded}`}
      >
        {family.motto}
      </Quote>
    </div>
  );
}

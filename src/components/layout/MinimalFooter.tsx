import { CurrentYear } from "@/components/ui/CurrentYear";

/**
 * The close used on the five pages the design draws with a bare footer: a
 * single centred copyright line under a hairline. The "Our History…" tagline
 * those pages already carry is the line above it, so this adds only the rule
 * and the credit. Generous bottom padding keeps it clear of the mobile dock.
 */
export function MinimalFooter() {
  return (
    <footer className="w-full pb-28 md:pb-12">
      <div className="max-w-page mx-auto px-4 md:pr-8 md:pl-30">
        <div className="border-member-border mt-16 border-t pt-6 md:mt-20">
          <p className="text-caption text-member-rail-ink text-center font-normal">
            &copy; Copyright <CurrentYear />, All Rights Reserved by IMENA
            FAMILY.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { ButtonLink } from "@/components/ui/Button";
import { X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useStoredValue } from "@/hooks/useStoredValue";
import { useProfileCompletion } from "../completion";

/**
 * A short note on the dashboard when the register has no date of birth for
 * the member: the birthdays page cannot celebrate somebody it cannot place.
 * One button to add it, and it can be put away for later.
 */
export function ProfileNudge({
  registeredBornOn,
}: {
  registeredBornOn: string;
}) {
  const { complete } = useProfileCompletion(registeredBornOn);
  const [dismissed, setDismissed] = useStoredValue(
    "imena:profile_nudge_dismissed",
    "0",
  );

  if (complete || dismissed === "1") return null;

  return (
    <section
      aria-labelledby="profile-nudge"
      className="border-member-border bg-member-tint relative flex flex-wrap items-center gap-x-6 gap-y-4 rounded-md border p-5 pr-12"
    >
      <div className="min-w-0 flex-1">
        <h2
          id="profile-nudge"
          className="text-body text-member-ink font-semibold"
        >
          Add your date of birth
        </h2>
        <p className="text-body-sm text-muted mt-0.5">
          The birthdays page needs it to celebrate you with the family.
        </p>
      </div>

      <ButtonLink href={`${ROUTES.PROFILE}?edit=1`} size="sm">
        Add it
      </ButtonLink>

      <button
        type="button"
        onClick={() => setDismissed("1")}
        aria-label="Hide this until later"
        className="text-muted hover:bg-surface rounded-pill absolute top-2 right-2 grid size-9 place-items-center"
      >
        <X aria-hidden className="size-4" />
      </button>
    </section>
  );
}

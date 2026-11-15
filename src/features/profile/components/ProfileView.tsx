"use client";

import { Quote } from "@/components/ui/Quote";
import { useState } from "react";
import Image from "next/image";
import { Cake, CalendarDays, LogOut, PenLine, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSignedIn } from "@/components/layout/SignedIn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SubfamilyBadge } from "@/components/ui/SubfamilyBadge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { useProfileCompletion } from "../completion";

interface ProfileViewProps {
  onSignOut: () => Promise<void>;
  /** Opened from the dashboard's "Add it", straight into the editor. */
  startEditing?: boolean;
  registeredBornOn?: string;
  /** The official motto of the member's branch, set by the family. */
  motto: string;
  mottoMeaning?: string;
  /** The branch's name, for the badge. */
  branch?: string;
}

function readableDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The member's own page: who they are, their branch and its official motto,
 * the facts the family keeps about them, and the one thing they edit
 * themselves, their date of birth.
 */
export function ProfileView({
  onSignOut,
  startEditing = false,
  registeredBornOn = "",
  motto,
  mottoMeaning,
  branch,
}: ProfileViewProps) {
  const person = useSignedIn();
  const [isEditing, setIsEditing] = useState(startEditing);
  const editDialog = useModalDialog(isEditing);
  const { bornOn, setBornOn } = useProfileCompletion(registeredBornOn);
  const [tempBornOn, setTempBornOn] = useState(registeredBornOn);
  const branchName = branch ?? person.subfamily;

  function handleSave() {
    if (tempBornOn) setBornOn(tempBornOn);
    setIsEditing(false);
  }

  const facts = [
    {
      icon: ShieldCheck,
      label: "Family status",
      value: (
        <span className="inline-flex items-center gap-1.5">
          Verified member <VerifiedBadge />
        </span>
      ),
    },
    {
      icon: Cake,
      label: "Date of birth",
      value: bornOn ? readableDate(bornOn) : "Not added yet",
    },
    {
      icon: CalendarDays,
      label: "Promotion cohort",
      value: "2019–2020 handover",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-28">
      <PageHeader title="Profile" as="p" />

      <section className="border-member-border bg-surface shadow-member flex flex-col items-center gap-8 rounded-lg border p-6 text-center sm:flex-row sm:items-center sm:p-10 sm:text-left">
        <Image
          src={elder3}
          alt={`${person.name}'s profile photograph`}
          width={192}
          height={192}
          priority
          className="ring-member-tint size-40 shrink-0 rounded-full object-cover ring-4 sm:size-48"
        />

        <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
          {branchName ? (
            <SubfamilyBadge subfamily={`${branchName} family`} size="md" />
          ) : null}

          <h1 className="text-h1-m md:text-h1 text-member-ink mt-3">
            {person.name}
          </h1>

          {/* The branch's official motto. Set by the family, so it is shown
              here and never edited from a profile. */}
          <Quote size="md" meaning={mottoMeaning} className="mt-4">
            {motto}
          </Quote>

          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Button
              size="md"
              onClick={() => {
                setTempBornOn(bornOn);
                setIsEditing(true);
              }}
            >
              <PenLine aria-hidden className="size-4" />
              Edit date of birth
            </Button>
            <ButtonLink href={ROUTES.RESOURCES} variant="outline" size="md">
              View archive
            </ButtonLink>
            <form action={onSignOut}>
              <Button type="submit" variant="danger" size="md">
                <LogOut aria-hidden className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-4"
          >
            <span className="bg-member-tint text-brand grid size-10 shrink-0 place-items-center rounded-md">
              <Icon aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-caption text-muted">{label}</dt>
              <dd className="text-body-sm text-member-ink font-semibold">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {/* Native <dialog>: Escape, focus trapping, an inert page behind it
          and focus returning to the button that opened it. */}
      <dialog
        ref={editDialog}
        onClose={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsEditing(false);
        }}
        aria-labelledby="edit-profile-title"
        className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/40 m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg p-0 shadow-2xl motion-reduce:animate-none"
      >
        {isEditing ? (
          <div className="p-6">
            <h2 id="edit-profile-title" className="text-h4-m text-member-ink">
              Your date of birth
            </h2>
            <p className="text-body-sm text-muted mt-1">
              The birthdays page uses it to celebrate you. It is kept on this
              device until profiles can be saved.
            </p>

            <label
              htmlFor="profile-born-on"
              className="text-body-sm text-member-ink mt-5 block font-semibold"
            >
              Date of birth
            </label>
            <input
              id="profile-born-on"
              type="date"
              autoComplete="bday"
              value={tempBornOn}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setTempBornOn(e.target.value)}
              className="border-field-border text-body mt-2 h-12 w-full rounded-sm border px-3"
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save changes</Button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

"use client";

import { Quote } from "@/components/ui/Quote";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSign,
  Cake,
  GraduationCap,
  KeyRound,
  LogOut,
  PenLine,
} from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SubfamilyBadge } from "@/components/ui/SubfamilyBadge";
import { TextField } from "@/components/ui/TextField";
import { useToast } from "@/components/ui/Toaster";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { promotionLabel } from "@/features/members/wire";
import type { Device, MyAccount } from "@/types/member";
import {
  profileSchema,
  type ProfileChanges,
  type ProfileValues,
} from "../schemas";
import { DeviceList } from "./DeviceList";
import { EmailConfirmation } from "./EmailConfirmation";
import { ProfilePhoto } from "./ProfilePhoto";

interface ProfileViewProps {
  account: MyAccount;
  /** null when the backend could not be asked. */
  devices: Device[] | null;
  onSignOut: () => Promise<void>;
  /** Opened from the dashboard's "Add it", straight into the editor. */
  startEditing?: boolean;
  /** The official motto of the member's branch, set by the family. */
  motto: string;
  mottoMeaning?: string;
  /** The branch's name, for the badge. */
  branch?: string;
  /** Fixed on the server, so both sides agree what "an hour ago" means. */
  now: string;
}

function readableDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** What the form changed, in the shape the action takes: nothing else is
    sent. An empty date or bio clears it. */
function changesFrom(
  account: MyAccount,
  values: ProfileValues,
): ProfileChanges {
  const changes: ProfileChanges = {};
  const fullName = values.fullName.trim();
  const bio = values.bio.trim();
  if (fullName !== account.fullName) changes.fullName = fullName;
  if (values.bornOn !== account.bornOn) changes.bornOn = values.bornOn || null;
  if (bio !== account.bio) changes.bio = bio || null;
  return changes;
}

function ProfileEditor({
  account,
  onSaved,
  onClose,
}: {
  account: MyAccount;
  onSaved: (account: MyAccount) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: account.fullName,
      bornOn: account.bornOn,
      bio: account.bio,
    },
  });

  const submit = handleSubmit(async (values) => {
    const changes = changesFrom(account, values);
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }
    const outcome = await updateProfile(changes);
    if (!outcome.ok) {
      setError("root", { message: outcome.message });
      return;
    }
    /* The sample account sends nothing back, so the page keeps what was
       typed until it is loaded again. */
    onSaved(
      outcome.account ?? {
        ...account,
        fullName: values.fullName.trim(),
        bornOn: values.bornOn,
        bio: values.bio.trim(),
      },
    );
    toast({ message: outcome.message });
    onClose();
  });

  return (
    <form onSubmit={submit} noValidate className="p-6">
      <h2 id="edit-profile-title" className="text-h4-m text-member-ink">
        Your details
      </h2>
      <p className="text-body-sm text-muted mt-1">
        What the family sees on your page. Your family name and email address
        are changed by an administrator.
      </p>

      <div className="mt-5 flex flex-col gap-5">
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label="Date of birth"
          type="date"
          autoComplete="bday"
          max={new Date().toISOString().slice(0, 10)}
          error={errors.bornOn?.message}
          {...register("bornOn")}
        />
        <div>
          <label
            htmlFor="profile-bio"
            className="text-body-sm mb-2 block font-medium"
          >
            About you
          </label>
          <textarea
            id="profile-bio"
            rows={4}
            autoComplete="off"
            className="rounded-field bg-surface border-field-border text-text transition-fast w-full border px-4 py-3"
            {...register("bio")}
          />
          <p className="text-caption text-muted mt-1.5">
            Other members see this on your page. Members see your birthday
            without the year.
          </p>
        </div>
      </div>

      {errors.root ? (
        <p role="alert" className="text-body-sm text-danger mt-5">
          {errors.root.message}
        </p>
      ) : null}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

/**
 * The member's own page: their photograph, their name and what they wrote
 * about themselves, their branch and its official motto, the facts the
 * family keeps about them, and the devices they are signed in on.
 *
 * They change their name, birthday, bio and photograph themselves. Their
 * family name, email, branch and promotion are an administrator's to
 * change, and are shown as facts.
 */
export function ProfileView({
  account: initial,
  devices,
  onSignOut,
  startEditing = false,
  motto,
  mottoMeaning,
  branch,
  now,
}: ProfileViewProps) {
  const [account, setAccount] = useState(initial);
  const [isEditing, setIsEditing] = useState(startEditing);
  const editDialog = useModalDialog(isEditing);
  const toast = useToast();

  /* An outcome's account replaces the page's; the sample account sends
     none, so the page keeps what it has. */
  const take = (next: MyAccount | null) => {
    if (next) setAccount(next);
  };

  const facts = [
    {
      icon: KeyRound,
      label: "Family name",
      value: account.familyName,
      note: "What you log in with",
    },
    {
      icon: AtSign,
      label: "Email address",
      value: account.email,
      note: account.emailConfirmed ? undefined : "Not confirmed yet",
    },
    {
      icon: Cake,
      label: "Date of birth",
      value: account.bornOn ? readableDate(account.bornOn) : "Not added yet",
    },
    {
      icon: GraduationCap,
      label: "Promotion",
      value: account.promotion
        ? promotionLabel(account.promotion.name)
        : "Not added yet",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-28">
      <PageHeader title="Profile" as="p" />

      <section className="border-member-border bg-surface shadow-member flex flex-col items-center gap-8 rounded-lg border p-6 text-center sm:flex-row sm:items-center sm:p-10 sm:text-left">
        <ProfilePhoto
          name={account.fullName}
          photo={account.photo}
          onChanged={take}
        />

        <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
          {branch ? (
            <SubfamilyBadge subfamily={`${branch} family`} size="md" />
          ) : null}

          <h1 className="text-h1-m md:text-h1 text-member-ink mt-3">
            {account.fullName}
          </h1>

          {account.bio ? (
            <p className="text-body text-text mt-3 text-pretty whitespace-pre-line">
              {account.bio}
            </p>
          ) : null}

          {/* The branch's official motto. Set by the family, so it is shown
              here and never edited from a profile. */}
          <Quote size="md" meaning={mottoMeaning} className="mt-4">
            {motto}
          </Quote>

          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Button size="md" onClick={() => setIsEditing(true)}>
              <PenLine aria-hidden className="size-4" />
              Edit your details
            </Button>
            <form action={onSignOut}>
              <Button type="submit" variant="danger" size="md">
                <LogOut aria-hidden className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </section>

      {account.emailConfirmed ? null : (
        <EmailConfirmation
          email={account.email}
          onConfirmed={(next) => {
            setAccount(next ?? { ...account, emailConfirmed: true });
            toast({ message: "Your email address is confirmed." });
          }}
        />
      )}

      <dl className="grid gap-4 sm:grid-cols-2">
        {facts.map(({ icon: Icon, label, value, note }) => (
          <div
            key={label}
            className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-4"
          >
            <span className="bg-member-tint text-brand grid size-10 shrink-0 place-items-center rounded-md">
              <Icon aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-caption text-muted">{label}</dt>
              <dd className="text-body-sm text-member-ink font-semibold break-words">
                {value}
              </dd>
              {note ? (
                <dd className="text-caption text-muted">{note}</dd>
              ) : null}
            </div>
          </div>
        ))}
      </dl>

      <DeviceList devices={devices} now={now} />

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
        className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/40 m-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg p-0 shadow-2xl motion-reduce:animate-none"
      >
        {isEditing ? (
          <ProfileEditor
            account={account}
            onSaved={setAccount}
            onClose={() => setIsEditing(false)}
          />
        ) : null}
      </dialog>
    </div>
  );
}

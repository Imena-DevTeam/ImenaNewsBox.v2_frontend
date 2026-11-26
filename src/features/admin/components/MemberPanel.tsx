"use client";

import type { CSSProperties } from "react";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { branchName } from "@/features/members/data";
import { promotionLabel } from "@/features/members/wire";
import type { FamilyMember, RegisterChoices } from "@/types/member";
import { cn } from "@/lib/cn";
import { memberEditSchema, type MemberEditValues } from "../schemas";

const FIELD =
  "rounded-field bg-surface border-field-border text-text transition-fast h-12 w-full border px-4";

/** What a refused save says, and which field it is about, if one. */
export interface SaveRefusal {
  message: string;
  field?: "familyName" | "email";
}

interface FormProps {
  person: FamilyMember | null;
  choices: RegisterChoices;
  takenEmails: string[];
  takenFamilyNames: string[];
  /** The signed-in administrator's own record. */
  self: boolean;
  /** True when taking this person's administrator role away would put the
      register under MIN_ADMINS. */
  lastAdmins: boolean;
  onSave: (values: MemberEditValues) => Promise<SaveRefusal | null>;
  onResend?: () => void;
  resending: boolean;
  onClose: () => void;
}

/**
 * One person's record, open for editing, or an empty one for adding.
 *
 * It is a native <dialog> at every width rather than a side panel on wide
 * screens: the browser gives Escape, focus trapping and — the reason — focus
 * restoration back to the row that opened it. The admin's place in the list
 * is kept either way, because the table is never unmounted.
 *
 * The dialog stays open until the backend has answered, so a refusal (a
 * family name somebody else has, the two-administrator floor) is shown
 * beside what caused it rather than after the form has gone.
 */
function MemberForm({
  person,
  choices,
  takenEmails,
  takenFamilyNames,
  self,
  lastAdmins,
  onSave,
  onResend,
  resending,
  onClose,
}: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MemberEditValues>({
    resolver: zodResolver(memberEditSchema({ takenEmails, takenFamilyNames })),
    defaultValues: {
      fullName: person?.fullName ?? "",
      familyName: person?.familyName ?? "",
      email: person?.email ?? "",
      subFamilyId: String(
        choices.subFamilies.find((one) => one.slug === person?.branch)?.id ??
          choices.subFamilies[0]?.id ??
          "",
      ),
      promotionId: person?.promotion ? String(person.promotion.id) : "",
      bornOn: person?.bornOn ?? "",
      role: person?.role ?? "member",
    },
  });

  const submit = handleSubmit(async (values) => {
    const refusal = await onSave(values);
    if (refusal) {
      setError(refusal.field ?? "root", { message: refusal.message });
    }
  });

  /* Two different locks on one control, so the reason has to say which. The
     backend refuses an administrator changing their own role at all (409
     `cannot_change_own_role`), and refuses taking the role from one of the
     last two (409 `too_few_admins`). */
  const roleLocked = self || lastAdmins;
  const roleReason = self
    ? "This is your own record. Another administrator can change your role."
    : "The register needs two administrators, so that a locked-out one can be sent a new link. Make somebody else an administrator first.";

  /* A new link is for somebody who has not used theirs, and for any
     administrator: theirs sets a new password, so it is also the reset. */
  const mayResend =
    person !== null &&
    person.status !== "deactivated" &&
    (person.status === "invited" || person.role === "admin");

  return (
    <form onSubmit={submit} noValidate className="p-6">
      {/* The name carries in from the row that was clicked, where the
          browser supports it: see withViewTransition and `morphing` in
          MembersTable. Adding somebody came from a button, not a row, and
          has nothing to travel from. */}
      <h2
        className="text-h4 text-member-ink font-semibold"
        style={
          person
            ? ({ viewTransitionName: "member-open" } as CSSProperties)
            : undefined
        }
      >
        {person ? person.fullName : "Add a member"}
      </h2>
      <p className="text-body-sm text-muted mt-1">
        {person
          ? person.status === "deactivated"
            ? "Deactivated: kept in the register, and unable to log in."
            : "Everything here can be changed."
          : "An invitation link goes to their email address. They stay invited until they open it."}
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Name"
            placeholder="Uwimana Claire"
            autoComplete="off"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <div>
            <TextField
              label="Family name"
              placeholder="UWIMANA"
              autoComplete="off"
              error={errors.familyName?.message}
              {...register("familyName")}
            />
            {!errors.familyName ? (
              <p className="text-caption text-muted mt-1.5">
                What they log in with.
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <TextField
            label="Email address"
            type="email"
            placeholder="name@example.com"
            autoComplete="off"
            error={errors.email?.message}
            {...register("email")}
          />
          {!errors.email ? (
            <p className="text-caption text-muted mt-1.5">
              {person
                ? "Their login codes go here. A new address is confirmed with a code sent to it."
                : "Their invitation and login codes go here."}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="panel-branch"
              className="text-body-sm mb-2 block font-medium"
            >
              Family branch
            </label>
            <select
              id="panel-branch"
              className={FIELD}
              {...register("subFamilyId")}
            >
              {choices.subFamilies.map((one) => (
                <option key={one.id} value={one.id}>
                  {branchName(one.slug)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="panel-promotion"
              className="text-body-sm mb-2 block font-medium"
            >
              Promotion
            </label>
            <select
              id="panel-promotion"
              className={FIELD}
              {...register("promotionId")}
            >
              <option value="">None yet</option>
              {choices.promotions.map((one) => (
                <option key={one.id} value={one.id}>
                  {promotionLabel(one.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            autoComplete="off"
            label="Date of birth"
            type="date"
            error={errors.bornOn?.message}
            {...register("bornOn")}
          />

          <div>
            <label
              htmlFor="panel-role"
              className="text-body-sm mb-2 block font-medium"
            >
              Role
            </label>
            <select
              id="panel-role"
              disabled={roleLocked}
              aria-describedby={roleLocked ? "panel-role-locked" : undefined}
              className={cn(FIELD, roleLocked && "opacity-60")}
              {...register("role")}
            >
              <option value="member">Member</option>
              <option value="social_media_manager">Social media manager</option>
              <option value="admin">Administrator</option>
            </select>
            {roleLocked ? (
              <p
                id="panel-role-locked"
                className="text-caption text-muted mt-1.5"
              >
                {roleReason}
              </p>
            ) : null}
          </div>
        </div>

        {mayResend ? (
          <div className="border-member-border flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <p className="text-body-sm text-muted min-w-0 flex-1">
              {person.role === "admin"
                ? "A new link lets them choose a new password. The old link stops working."
                : "They have not opened their invitation. A new link replaces the old one."}
            </p>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={resending}
              onClick={onResend}
            >
              <Send aria-hidden className="size-4" />
              {resending ? "Sending…" : "Send a new link"}
            </Button>
          </div>
        ) : null}
      </div>

      {errors.root ? (
        <p role="alert" className="text-body-sm text-danger mt-6">
          {errors.root.message}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="brand" size="sm" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? person
              ? "Saving…"
              : "Sending…"
            : person
              ? "Save changes"
              : "Send the invitation"}
        </Button>
      </div>
    </form>
  );
}

export function MemberPanel({ open, ...props }: FormProps & { open: boolean }) {
  const ref = useModalDialog(open);

  return (
    <dialog
      ref={ref}
      onClose={props.onClose}
      onCancel={props.onClose}
      className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/50 m-auto w-[min(36rem,calc(100vw-2rem))] rounded-lg p-0 shadow-xl motion-reduce:animate-none"
    >
      {/* Keyed, so opening a different person rebuilds the fields rather
          than resetting them from an effect. */}
      {open ? <MemberForm key={props.person?.id ?? "new"} {...props} /> : null}
    </dialog>
  );
}

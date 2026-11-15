"use client";

import type { CSSProperties } from "react";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TRINITY } from "@/features/families/data";
import type { FamilyMember } from "@/features/members/data";
import { SIGNED_IN_ID } from "@/features/members/data";
import { cn } from "@/lib/cn";
import { memberEditSchema, type MemberEditValues } from "../schemas";

const FIELD =
  "rounded-field bg-surface border-field-border text-text transition-fast h-12 w-full border px-4";

const STATUSES: { value: MemberEditValues["status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited, not yet signed in" },
  { value: "suspended", label: "Suspended" },
];

/**
 * One person's record, open for editing.
 *
 * It is a native <dialog> at every width rather than a side panel on wide
 * screens, which is a deliberate departure from the plan: the browser gives
 * Escape, focus trapping and — the reason — focus restoration back to the
 * row that opened it. A hand-built side panel gives none of the three, and
 * the admin's place in the list is kept either way, because the table is
 * never unmounted.
 *
 * Nothing saves. Every outcome is reported by the table and stops there,
 * with a TODO naming the members service.
 */
function MemberForm({
  person,
  takenEmails,
  lastAdmins,
  onSave,
  onClose,
}: {
  person: FamilyMember | null;
  takenEmails: string[];
  /** True when taking this person's administrator role away would put the
      register under MIN_ADMINS. */
  lastAdmins: boolean;
  onSave: (values: MemberEditValues) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberEditValues>({
    resolver: zodResolver(memberEditSchema(takenEmails)),
    defaultValues: {
      fullName: person?.fullName ?? "",
      email: person?.email ?? "",
      branch: person?.branch ?? TRINITY[0]!.slug,
      bornOn: person?.bornOn ?? "",
      role: person?.role ?? "member",
      status: person?.status ?? "invited",
    },
  });

  /* Taking your own admin role away locks you out of the page you are
     standing on. The control says why rather than failing on save. */
  const self = person?.id === SIGNED_IN_ID;

  /* Two different locks on one control, so the reason has to say which. Your
     own record locks because you would lose the page you are standing on;
     the floor locks because the register needs two administrators for a
     locked-out one to be helped at all — see MIN_ADMINS. */
  const roleLocked = self || lastAdmins;
  const roleReason = self
    ? "This is your own record. You cannot take your own administrator role away."
    : "The register needs two administrators, so that a locked-out one can be sent a reset link. Make somebody else an administrator first.";

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate className="p-6">
      {/* The name carries in from the row that was clicked, where the
          browser supports it: see withViewTransition and `morphing` in
          MembersTable, which hands this name over on the frame before the
          dialog opens. A name can only belong to one element at a time, so
          only the record being edited claims it — adding somebody came from
          a button, not from a row, and has nothing to travel from. */}
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
          ? "Everything here can be changed."
          : "An invitation link goes to their email address. They stay invited until they open it."}
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <TextField
          label="Full name"
          placeholder="Uwimana Claire"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <div>
          <TextField
            label="Email address"
            type="email"
            placeholder="name@imenafamily.rw"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          {!errors.email ? (
            <p className="text-caption text-muted mt-1.5">
              This is the address they sign in with. Changing it changes how
              they reach the site.
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
            <select id="panel-branch" className={FIELD} {...register("branch")}>
              {TRINITY.map((family) => (
                <option key={family.slug} value={family.slug}>
                  {family.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <TextField
              autoComplete="bday"
              label="Date of birth"
              type="date"
              error={errors.bornOn?.message}
              {...register("bornOn")}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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
              <option value="blogger">Blogger</option>
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

          <div>
            <label
              htmlFor="panel-status"
              className="text-body-sm mb-2 block font-medium"
            >
              Status
            </label>
            {/* Suspending an administrator takes the role away as surely as
                demoting them: a suspended administrator cannot send anybody
                a reset link. So the floor closes this door too, rather than
                leaving it as the way around the one above. */}
            <select
              id="panel-status"
              aria-describedby={lastAdmins ? "panel-status-floor" : undefined}
              className={FIELD}
              {...register("status")}
            >
              {STATUSES.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={lastAdmins && option.value === "suspended"}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {lastAdmins ? (
              <p
                id="panel-status-floor"
                className="text-caption text-muted mt-1.5"
              >
                They cannot be suspended while the register needs them as an
                administrator.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="brand" size="sm" type="submit" disabled={isSubmitting}>
          {person ? "Save changes" : "Send the invitation"}
        </Button>
      </div>
    </form>
  );
}

export function MemberPanel({
  open,
  person,
  takenEmails,
  lastAdmins = false,
  onSave,
  onClose,
}: {
  open: boolean;
  /** null adds somebody; a record edits them. */
  person: FamilyMember | null;
  takenEmails: string[];
  lastAdmins?: boolean;
  onSave: (values: MemberEditValues) => void;
  onClose: () => void;
}) {
  const ref = useModalDialog(open);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className="bg-surface open:animate-dialog-pop backdrop:bg-member-ink/50 m-auto w-[min(36rem,calc(100vw-2rem))] rounded-lg p-0 shadow-xl motion-reduce:animate-none"
    >
      {/* Keyed, so opening a different person rebuilds the fields rather
          than resetting them from an effect. */}
      {open ? (
        <MemberForm
          key={person?.id ?? "new"}
          person={person}
          takenEmails={takenEmails}
          lastAdmins={lastAdmins}
          onSave={onSave}
          onClose={onClose}
        />
      ) : null}
    </dialog>
  );
}

"use client";

import { useDeferredValue, useMemo, useState, type CSSProperties } from "react";
import { Search, Trash2, Undo2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { CONTROL, Picker } from "@/components/ui/Picker";
import { TRINITY } from "@/features/families/data";
import {
  branchName,
  missingBirthday,
  queryMembers,
  type FamilyMember,
  type MemberSort,
  type MemberStatus,
} from "@/features/members/data";
import { cn } from "@/lib/cn";
import { withViewTransition } from "@/lib/viewTransition";
import type { MemberEditValues } from "../schemas";
import { MemberPanel } from "./MemberPanel";

/** How many rows before the list stops and offers the rest. */
const PAGE = 25;

/** Matches the row-leave animation in globals.css. */
const LEAVE_MS = 200;

/** Rows past this one arrive together. A stagger that runs the length of a
    twenty-five row page reads as the page being slow. */
const STAGGER_CAP = 8;

const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  blogger: "Blogger",
  admin: "Administrator",
};

const STATUS_LABEL: Record<MemberStatus, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
};

/** Stored ISO, read US-ordered, the way every other date on the site is. */
function readDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The family register, and the administrator's work on it.
 *
 * A table, not cards: name, email, branch, role and joining date all carry
 * comparison, which is exactly why /admin/posts stopped being one and this
 * is. Narrow screens drop the columns from the right and the name cell picks
 * up what they were carrying, so nothing scrolls sideways and nothing is
 * lost.
 *
 * Only a status that is not "active" is marked. Active is the norm, and
 * marking the norm is noise — the same judgement the archive makes about
 * published posts.
 *
 * There is no select-all and no bulk action. Bulk-editing people is how an
 * administrator removes forty relatives at once, and nobody asked for it.
 *
 * Nothing saves: the CRUD runs over a copy of the register in state, and
 * every outcome says so.
 *
 * Four things move, and each of them is telling the administrator something
 * they would otherwise have to find for themselves:
 *
 * - The row just edited flashes once, because coming back from the dialog to
 *   seventy-three rows with no idea which one changed is the normal case —
 *   and for an email change the only visible difference is one address.
 * - The row being removed slides out before it goes, which both shows what
 *   left and buys the second in which **Undo** is still offered.
 * - Rows arrive in order after a filter, so a list that has become a
 *   different list reads as one.
 * - The name clicked carries into the dialog's heading, where the browser
 *   supports it, so there is never a question of whose record is open.
 */
export function MembersTable({
  people,
  initialAdd = false,
  initialSearch,
  initialBranch,
}: {
  people: FamilyMember[];
  /** /admin/members/new renders this page with the panel already open. */
  initialAdd?: boolean;
  /** A name, from a link that came here asking about one person. */
  initialSearch?: string;
  initialBranch?: string;
}) {
  const [register, setRegister] = useState(people);
  const [search, setSearch] = useState(initialSearch ?? "");
  const [branch, setBranch] = useState(initialBranch ?? "all");
  const [status, setStatus] = useState<MemberStatus | "all">("all");
  const [gaps, setGaps] = useState(false);
  const [sort, setSort] = useState<MemberSort>("newest");
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [adding, setAdding] = useState(initialAdd);
  const [removing, setRemoving] = useState<FamilyMember | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);

  /* The row to flash, and the row on its way out. Both are ids rather than
     records: they point at a row, they are not a copy of one. */
  const [changed, setChanged] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);

  /* The one removal that can still be taken back, kept with the place it
     came from so Undo puts it back where it was rather than at the top. */
  const [undo, setUndo] = useState<{ person: FamilyMember; at: number } | null>(
    null,
  );

  /* The name that travels into the dialog. It is set on the frame before the
     dialog opens, because a view transition needs the name present in the
     old state and in the new one, and never in both at once. */
  const [morphing, setMorphing] = useState<string | null>(null);

  /* Typing rebuilds twenty-five rows per keystroke. Deferring the needle
     lets the keystroke land first and the table catch up, which is what a
     debounce is for without a timer to clean up — and without the debounce's
     own cost, a list that is briefly wrong after you stop typing. */
  const needle = useDeferredValue(search);

  const found = useMemo(
    () =>
      queryMembers(register, {
        search: needle,
        branch,
        status,
        missingBornOn: gaps,
        sort,
      }),
    [register, needle, branch, status, gaps, sort],
  );

  const shown = showAll ? found : found.slice(0, PAGE);

  /* Rows replay their arrival when the list becomes a different list, and
     sit still when it is the same list with one record edited. A key, so
     React remounts them and the animation runs again. */
  const listing = `${needle}|${branch}|${status}|${gaps}|${sort}|${showAll}`;
  const open = adding || editing !== null;

  /* Opening a record: the row takes the shared name, then the dialog takes
     it over inside a view transition, so the name slides from the table into
     the heading. flushSync is what makes the first of those two a frame of
     its own. Where the API is missing this is one plain state change.

     The flash is cleared here too: opening the same row twice should flash
     it twice. */
  const edit = (person: FamilyMember) => {
    setChanged(null);
    setMorphing(person.id);
    withViewTransition(() => {
      setEditing(person);
      setMorphing(null);
    });
  };

  /* Everyone else's address, so the panel can refuse a duplicate without
     refusing the record its own email. */
  const takenEmails = register
    .filter((person) => person.id !== editing?.id)
    .map((person) => person.email);

  // TODO: post to the members service once the API exists.
  const save = (values: MemberEditValues) => {
    if (editing) {
      const before = editing.email;
      setRegister((was) =>
        was.map((person) =>
          person.id === editing.id ? { ...person, ...values } : person,
        ),
      );
      setOutcome(
        before === values.email
          ? `${values.fullName} would be saved. Nothing was stored: the members service does not exist yet.`
          : `${values.fullName} would sign in with ${values.email} instead of ${before}. Nothing was stored, and no email was sent.`,
      );
      setChanged(editing.id);
    } else {
      const id = `m-new-${register.length + 1}`;
      /* Joined today, because they were added today. */
      const joinedOn = new Date().toISOString().slice(0, 10);
      setRegister((was) => [{ id, joinedOn, ...values }, ...was]);
      setOutcome(
        `${values.fullName} would be added to the register and invited at ${values.email}. Nothing was stored, and no email was sent.`,
      );
      setChanged(id);
    }
    setEditing(null);
    setAdding(false);
    setUndo(null);
  };

  /* Removing somebody has two halves. The outcome is reported at once, so
     nothing waits on an animation that may never run; the row slides out and
     is taken from the register when it has, which is also the second in
     which Undo is worth offering. */
  const remove = (person: FamilyMember) => {
    const at = register.findIndex((one) => one.id === person.id);
    setRemoving(null);
    setLeaving(person.id);
    setOutcome(
      `${person.fullName} would be removed from the register. Nothing was stored: the members service does not exist yet.`,
    );

    window.setTimeout(() => {
      setRegister((was) => was.filter((one) => one.id !== person.id));
      setLeaving(null);
      setUndo({ person, at });
    }, LEAVE_MS);
  };

  /* Nothing was stored, so putting somebody back costs one splice. It is
     offered because the confirmation is the only thing standing between a
     mis-aimed click and a relative disappearing from the register. */
  const putBack = () => {
    if (!undo) return;
    const { person, at } = undo;
    setRegister((was) => {
      const next = [...was];
      next.splice(Math.min(at, next.length), 0, person);
      return next;
    });
    setChanged(person.id);
    setOutcome(`${person.fullName} is back in the register.`);
    setUndo(null);
  };

  const withoutBirthday = missingBirthday(register).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-muted">
          {register.length} people
          {withoutBirthday > 0
            ? `, ${withoutBirthday} without a date of birth`
            : ""}
        </p>
        <Button
          variant="brand"
          size="sm"
          type="button"
          onClick={() => setAdding(true)}
        >
          <UserPlus aria-hidden className="size-4" />
          Add a member
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <label htmlFor="members-search" className="sr-only">
            Search members
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="text-muted pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
            />
            <input
              id="members-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email"
              className={cn(CONTROL, "w-full pl-11")}
            />
          </div>
        </div>

        <Picker
          id="members-branch"
          label="Filter by branch"
          value={branch}
          onChange={setBranch}
        >
          <option value="all">Any branch</option>
          {TRINITY.map((family) => (
            <option key={family.slug} value={family.slug}>
              {family.name}
            </option>
          ))}
        </Picker>

        <Picker
          id="members-status"
          label="Filter by status"
          value={status}
          onChange={(next) => setStatus(next as MemberStatus | "all")}
        >
          <option value="all">Any status</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="suspended">Suspended</option>
        </Picker>

        <Picker
          id="members-sort"
          label="Order members"
          value={sort}
          onChange={(next) => setSort(next as MemberSort)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </Picker>

        <label className="text-body-sm text-muted hover:text-member-ink transition-fast flex h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={gaps}
            onChange={() => setGaps((was) => !was)}
            className="accent-brand size-4"
          />
          Missing a date of birth
        </label>
      </div>

      {/* One live region, so a save and a filter are announced as one
          sentence rather than racing each other. It says which slice is on
          screen as well as how many matched: without that, page one and the
          first twenty-five of seventy-three look identical. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p role="status" aria-live="polite" className="text-body-sm text-muted">
          {found.length} of {register.length} people
          {!showAll && found.length > PAGE ? `, showing the first ${PAGE}` : ""}
          {outcome ? ` · ${outcome}` : ""}
        </p>

        {undo ? (
          <button
            type="button"
            onClick={putBack}
            className="text-body-sm text-brand hover:bg-member-tint focus-visible:outline-brand transition-fast rounded-pill inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold"
          >
            <Undo2 aria-hidden className="size-4" />
            Undo
          </button>
        ) : null}
      </div>

      {found.length === 0 ? (
        <div className="border-member-border bg-member-panel rounded-md border">
          <EmptyState
            title="Nobody matches that."
            description="Try a different name or address, or clear the filters."
          />
        </div>
      ) : (
        <div className="border-member-border bg-surface overflow-hidden rounded-md border">
          <table className="w-full text-left">
            <caption className="sr-only">
              Everyone in the family register
            </caption>
            {/* Sticky, because seventy-three rows is three screens and the
                columns are what the rows mean. It needs its own background:
                a transparent head over scrolling rows is unreadable. */}
            <thead className="border-member-border bg-member-panel/95 sticky top-0 z-10 border-b backdrop-blur-sm">
              <tr className="text-caption text-muted">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 font-semibold md:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 font-semibold lg:table-cell"
                >
                  Branch
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 font-semibold lg:table-cell"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 font-semibold xl:table-cell"
                >
                  Joined
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody key={listing} className="divide-member-border divide-y">
              {shown.map((person, index) => (
                <tr
                  key={person.id}
                  style={
                    { "--i": Math.min(index, STAGGER_CAP) } as CSSProperties
                  }
                  className={cn(
                    "hover:bg-member-tint transition-fast row-in",
                    person.id === leaving && "row-leave",
                    person.id === changed && "row-flash",
                  )}
                >
                  <th scope="row" className="px-4 py-3 font-normal">
                    <span
                      className="text-body-sm text-member-ink block font-medium"
                      style={
                        person.id === morphing
                          ? ({
                              viewTransitionName: "member-open",
                            } as CSSProperties)
                          : undefined
                      }
                    >
                      {person.fullName}
                      {person.status !== "active" ? (
                        <span className="text-caption bg-member-tint text-brand ml-2 rounded-full px-2.5 py-1 font-semibold">
                          {STATUS_LABEL[person.status]}
                        </span>
                      ) : null}
                    </span>
                    {/* What the dropped columns were carrying. */}
                    <span className="text-caption text-muted mt-0.5 block md:hidden">
                      {person.email}
                    </span>
                    <span className="text-caption text-muted mt-0.5 block lg:hidden">
                      {branchName(person.branch)}
                      {person.role !== "member"
                        ? ` · ${ROLE_LABEL[person.role]}`
                        : ""}
                    </span>
                  </th>
                  <td className="text-body-sm text-muted hidden px-4 py-3 md:table-cell">
                    {person.email}
                  </td>
                  <td className="text-body-sm text-muted hidden px-4 py-3 lg:table-cell">
                    {branchName(person.branch)}
                  </td>
                  <td className="text-body-sm text-muted hidden px-4 py-3 lg:table-cell">
                    {ROLE_LABEL[person.role] ?? person.role}
                  </td>
                  <td className="text-body-sm text-muted hidden px-4 py-3 tabular-nums xl:table-cell">
                    {readDate(person.joinedOn)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => edit(person)}
                        className="text-body-sm text-brand focus-visible:outline-brand hover:bg-member-tint rounded-pill px-3 py-2 font-semibold"
                      >
                        Edit
                        <span className="sr-only"> {person.fullName}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRemoving(person)}
                        aria-label={`Remove ${person.fullName}`}
                        className="text-muted hover:text-danger focus-visible:outline-brand transition-fast flex size-10 items-center justify-center rounded-full"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 73 rows is 73 rows: the admin would scroll past the person they
          came for. The rest is one click away, not hidden behind paging. */}
      {!showAll && found.length > PAGE ? (
        <div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setShowAll(true)}
          >
            Show all {found.length}
          </Button>
        </div>
      ) : null}

      <MemberPanel
        open={open}
        person={editing}
        takenEmails={takenEmails}
        onSave={save}
        onClose={() => {
          setEditing(null);
          setAdding(false);
        }}
      />

      <ConfirmDialog
        open={removing !== null}
        destructive
        title={
          removing
            ? `Remove ${removing.fullName} from the register?`
            : "Remove this person?"
        }
        description="They leave the family tree and the birthdays page with their record. Suspending them instead keeps the record and takes away their access, and that can be undone."
        confirmLabel="Remove them"
        cancelLabel="Keep them"
        onCancel={() => setRemoving(null)}
        onConfirm={() => removing && remove(removing)}
      />
    </div>
  );
}

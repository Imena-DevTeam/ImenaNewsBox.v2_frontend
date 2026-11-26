"use client";

import { useDeferredValue, useMemo, useState, type CSSProperties } from "react";
import { RotateCcw, Search, UserMinus, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { CONTROL, Picker } from "@/components/ui/Picker";
import {
  addMember,
  deactivateMember,
  reactivateMember,
  sendNewLink,
  updateMember,
} from "@/app/actions/members";
import { TRINITY } from "@/features/families/data";
import {
  branchName,
  mayLoseAdmin,
  MIN_ADMINS,
  missingBirthday,
  queryMembers,
  type FamilyMember,
  type MemberSort,
  type MemberStatus,
} from "@/features/members/data";
import { cn } from "@/lib/cn";
import { withViewTransition } from "@/lib/viewTransition";
import type { RegisterChoices } from "@/types/member";
import {
  toFields,
  type MemberChanges,
  type MemberEditValues,
  type MemberFields,
} from "../schemas";
import { MemberPanel, type SaveRefusal } from "./MemberPanel";

/** How many rows before the list stops and offers the rest. */
const PAGE = 25;

/** Rows past this one arrive together. A stagger that runs the length of a
    twenty-five row page reads as the page being slow. */
const STAGGER_CAP = 8;

const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  social_media_manager: "Social media manager",
  admin: "Administrator",
};

const STATUS_LABEL: Record<MemberStatus, string> = {
  active: "Active",
  invited: "Invited",
  deactivated: "Deactivated",
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

/** A record's editable fields, in the shape the form saves. */
function fieldsOf(
  person: FamilyMember,
  choices: RegisterChoices,
): MemberFields {
  return {
    fullName: person.fullName,
    familyName: person.familyName,
    email: person.email,
    subFamilyId:
      choices.subFamilies.find((one) => one.slug === person.branch)?.id ?? 0,
    promotionId: person.promotion?.id ?? null,
    bornOn: person.bornOn || null,
    role: person.role,
  };
}

/** Only what the form changed: the backend is sent nothing else. */
function changesFrom(before: MemberFields, after: MemberFields): MemberChanges {
  const changes: Record<string, unknown> = {};
  for (const key of Object.keys(after) as (keyof MemberFields)[]) {
    if (after[key] !== before[key]) changes[key] = after[key];
  }
  return changes as MemberChanges;
}

/** The record as the form left it: what the table shows when the sample
    register answered, since no record comes back from a backend. */
function applied(
  person: FamilyMember,
  fields: MemberFields,
  choices: RegisterChoices,
): FamilyMember {
  return {
    ...person,
    fullName: fields.fullName,
    familyName: fields.familyName,
    email: fields.email,
    branch:
      choices.subFamilies.find((one) => one.id === fields.subFamilyId)?.slug ??
      person.branch,
    promotion:
      choices.promotions.find((one) => one.id === fields.promotionId) ?? null,
    bornOn: fields.bornOn ?? "",
    role: fields.role,
  };
}

/**
 * The family register, and the administrator's work on it.
 *
 * A table, not cards: name, email, branch, role and joining date all carry
 * comparison. Narrow screens drop the columns from the right and the name
 * cell picks up what they were carrying, so nothing scrolls sideways and
 * nothing is lost.
 *
 * Only a status that is not "active" is marked. Active is the norm, and
 * marking the norm is noise.
 *
 * There is no select-all and no bulk action. Bulk-editing people is how an
 * administrator deactivates forty relatives at once, and nobody asked for it.
 *
 * Every change goes to the backend through a server action, and the row
 * shows the record the backend sent back. The table keeps its own copy of
 * the register, so the row changes the moment the answer arrives.
 *
 * Three things move, and each tells the administrator something they would
 * otherwise have to find for themselves:
 *
 * - The row just changed flashes once, because coming back from the dialog
 *   to a long list with no idea which row changed is the normal case — and
 *   for an email change the only visible difference is one address.
 * - Rows arrive in order after a filter, so a list that has become a
 *   different list reads as one.
 * - The name clicked carries into the dialog's heading, where the browser
 *   supports it, so there is never a question of whose record is open.
 */
export function MembersTable({
  people,
  choices,
  selfId,
  initialAdd = false,
  initialSearch,
  initialBranch,
}: {
  people: FamilyMember[];
  choices: RegisterChoices;
  /** The signed-in administrator's own record. */
  selfId: string;
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
  const [deactivating, setDeactivating] = useState<FamilyMember | null>(null);
  /* The person with a request on its way, so their buttons wait for it. */
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();
  const say = (message: string) => toast({ message });

  /* The row to flash: an id, pointing at a row rather than copying one. */
  const [changed, setChanged] = useState<string | null>(null);

  /* The name that travels into the dialog. It is set on the frame before the
     dialog opens, because a view transition needs the name present in the
     old state and in the new one, and never in both at once. */
  const [morphing, setMorphing] = useState<string | null>(null);

  /* Typing rebuilds twenty-five rows per keystroke. Deferring the needle
     lets the keystroke land first and the table catch up, which is what a
     debounce is for without a timer to clean up. */
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
     it over inside a view transition. The flash is cleared here too:
     opening the same row twice should flash it twice. */
  const edit = (person: FamilyMember) => {
    setChanged(null);
    setMorphing(person.id);
    withViewTransition(() => {
      setEditing(person);
      setMorphing(null);
    });
  };

  /* The floor, read from the register in state rather than from the module,
     so it answers about the list as it now stands: promote somebody and the
     locks open on the same render.

     > [!IMPORTANT]
     > This disables controls and says why. It is a courtesy, not a rule:
     > the backend refuses the same thing (409 `too_few_admins`), because a
     > disabled <select> stops a mis-click and not a request. */
  const floorHolds = editing !== null && !mayLoseAdmin(editing, register);

  /* Everyone else's address and family name, so the panel can refuse a
     duplicate without refusing the record its own. */
  const others = register.filter((person) => person.id !== editing?.id);
  const takenEmails = others.map((person) => person.email);
  const takenFamilyNames = others.map((person) => person.familyName);

  /* The backend's record replaces the row, or a new one leads the list. */
  const put = (next: FamilyMember) => {
    setRegister((was) => {
      const at = was.findIndex((one) => one.id === next.id);
      if (at === -1) return [next, ...was];
      const copy = [...was];
      copy[at] = next;
      return copy;
    });
    setChanged(next.id);
  };

  const close = () => {
    setEditing(null);
    setAdding(false);
  };

  const save = async (
    values: MemberEditValues,
  ): Promise<SaveRefusal | null> => {
    const fields = toFields(values);

    if (editing) {
      const changes = changesFrom(fieldsOf(editing, choices), fields);
      if (Object.keys(changes).length === 0) {
        close();
        return null;
      }
      const outcome = await updateMember(editing.id, changes);
      if (!outcome.ok) return outcome;
      put(outcome.person ?? applied(editing, fields, choices));
      say(outcome.message);
      close();
      return null;
    }

    const outcome = await addMember(fields);
    if (!outcome.ok) return outcome;
    const blank: FamilyMember = {
      id: `m-new-${register.length + 1}`,
      fullName: "",
      familyName: "",
      email: "",
      branch: "",
      promotion: null,
      bornOn: "",
      role: "member",
      status: "invited",
      /* Joined today, because they were added today. */
      joinedOn: new Date().toISOString().slice(0, 10),
      photo: "",
    };
    put(outcome.person ?? applied(blank, fields, choices));
    say(outcome.message);
    close();
    return null;
  };

  /* Deactivating asks first, then offers Undo as well: it signs somebody
     out of every device, and a relative is worth the extra click. Undo is
     reactivating them, which the backend allows at any time. */
  const deactivate = async (person: FamilyMember) => {
    setDeactivating(null);
    setBusy(person.id);
    const outcome = await deactivateMember(person.id);
    setBusy(null);
    if (!outcome.ok) {
      say(outcome.message);
      return;
    }
    put(outcome.person ?? { ...person, status: "deactivated" });
    toast({
      message: outcome.message,
      action: { label: "Undo", run: () => void reactivate(person) },
    });
  };

  /* `person` is the record as it was before it was deactivated, so the
     sample register can put back the status it had. */
  const reactivate = async (person: FamilyMember) => {
    setBusy(person.id);
    const outcome = await reactivateMember(person.id);
    setBusy(null);
    if (!outcome.ok) {
      say(outcome.message);
      return;
    }
    const back = person.status === "deactivated" ? "active" : person.status;
    put(outcome.person ?? { ...person, status: back });
    say(
      outcome.person ? outcome.message : `${person.fullName} can log in again.`,
    );
  };

  const resend = async (person: FamilyMember) => {
    setBusy(person.id);
    const outcome = await sendNewLink(person.id);
    setBusy(null);
    if (outcome.ok && outcome.person) put(outcome.person);
    say(outcome.message);
  };

  const withoutBirthday = missingBirthday(
    register.filter((person) => person.status !== "deactivated"),
  ).length;

  /* Deactivating has two locks, like the role: yourself, and the floor. */
  const deactivateLabel = (person: FamilyMember): string | null => {
    if (person.id === selfId) {
      return `${person.fullName} is you: another administrator can deactivate your account`;
    }
    if (!mayLoseAdmin(person, register)) {
      return `${person.fullName} cannot be deactivated: the register needs ${MIN_ADMINS} administrators`;
    }
    return null;
  };

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
              autoComplete="off"
              id="members-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, family name or email"
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
          <option value="deactivated">Deactivated</option>
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
          screen as well as how many matched. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p role="status" aria-live="polite" className="text-body-sm text-muted">
          {found.length} of {register.length} people
          {!showAll && found.length > PAGE ? `, showing the first ${PAGE}` : ""}
        </p>
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
            {/* Sticky, because a long register is several screens and the
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
              {shown.map((person, index) => {
                const locked = deactivateLabel(person);
                const gone = person.status === "deactivated";
                return (
                  <tr
                    key={person.id}
                    style={
                      { "--i": Math.min(index, STAGGER_CAP) } as CSSProperties
                    }
                    className={cn(
                      "hover:bg-member-tint transition-fast row-in",
                      person.id === changed && "row-flash",
                    )}
                  >
                    <th scope="row" className="px-4 py-3 font-normal">
                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          name={person.fullName}
                          photo={person.photo}
                          sizes="2.25rem"
                          className={cn(
                            "text-caption size-9",
                            gone && "opacity-50",
                          )}
                        />
                        <div className="min-w-0">
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
                          {/* What they log in with, when it is not simply
                              their name. */}
                          {person.familyName !== person.fullName ? (
                            <span className="text-caption text-muted mt-0.5 block">
                              {person.familyName}
                            </span>
                          ) : null}
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
                        </div>
                      </div>
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
                          <span className="sr-only">{` ${person.fullName}`}</span>
                        </button>
                        {gone ? (
                          <button
                            type="button"
                            onClick={() => void reactivate(person)}
                            disabled={busy === person.id}
                            aria-label={`Reactivate ${person.fullName}`}
                            className="text-muted hover:text-brand focus-visible:outline-brand transition-fast flex size-10 items-center justify-center rounded-full disabled:pointer-events-none disabled:opacity-40"
                          >
                            <RotateCcw aria-hidden className="size-4" />
                          </button>
                        ) : (
                          /* The reason a person cannot be deactivated is on
                             the control, in its label, rather than waiting
                             for the backend to refuse the confirmation. */
                          <button
                            type="button"
                            onClick={() => setDeactivating(person)}
                            disabled={locked !== null || busy === person.id}
                            aria-label={
                              locked ?? `Deactivate ${person.fullName}`
                            }
                            className="text-muted hover:text-danger focus-visible:outline-brand transition-fast flex size-10 items-center justify-center rounded-full disabled:pointer-events-none disabled:opacity-40"
                          >
                            <UserMinus aria-hidden className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* A long list is a long list: the admin would scroll past the person
          they came for. The rest is one click away, not hidden behind
          paging. */}
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
        choices={choices}
        takenEmails={takenEmails}
        takenFamilyNames={takenFamilyNames}
        self={editing?.id === selfId}
        lastAdmins={floorHolds}
        onSave={save}
        onResend={editing ? () => void resend(editing) : undefined}
        resending={editing !== null && busy === editing.id}
        onClose={close}
      />

      <ConfirmDialog
        open={deactivating !== null}
        destructive
        title={
          deactivating
            ? `Deactivate ${deactivating.fullName}?`
            : "Deactivate this person?"
        }
        description="They are signed out of every device and cannot log in. Their record, family name and wishes are kept, and they can be reactivated at any time."
        confirmLabel="Deactivate"
        cancelLabel="Keep them"
        onCancel={() => setDeactivating(null)}
        onConfirm={() => deactivating && void deactivate(deactivating)}
      />
    </div>
  );
}

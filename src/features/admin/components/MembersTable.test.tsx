import { ToastProvider } from "@/components/ui/Toaster";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  administrators,
  countByBranch,
  FAMILY_REGISTER,
  missingBirthday,
  SAMPLE_CHOICES,
  SIGNED_IN_ID,
} from "@/features/members/data";
import type { FamilyMember } from "@/types/member";

/* The server actions are the backend's door; here they are stand-ins, so
   each test says what the backend answered. */
const actions = vi.hoisted(() => ({
  addMember: vi.fn(),
  updateMember: vi.fn(),
  deactivateMember: vi.fn(),
  reactivateMember: vi.fn(),
  sendNewLink: vi.fn(),
}));
vi.mock("@/app/actions/members", () => actions);

const { MembersTable } = await import("./MembersTable");

afterEach(() => {
  for (const action of Object.values(actions)) action.mockReset();
});

function show(
  props: Partial<Parameters<typeof MembersTable>[0]> = {},
  people: FamilyMember[] = FAMILY_REGISTER,
) {
  render(
    <MembersTable
      people={people}
      choices={SAMPLE_CHOICES}
      selfId={SIGNED_IN_ID}
      {...props}
    />,
    { wrapper: ToastProvider },
  );
}

/* The status line, then whatever the toast is saying about the last action. */
const said = () =>
  `${screen.getByRole("status").textContent ?? ""} ${
    document.querySelector("[data-toaster]")?.textContent ?? ""
  }`;

const rows = () => screen.getAllByRole("row").length - 1; // less the header

const search = (text: string) =>
  fireEvent.change(screen.getByLabelText("Search members"), {
    target: { value: text },
  });

const openFirstEdit = () => fireEvent.click(screen.getAllByText("Edit")[0]!);

const aMember = FAMILY_REGISTER.find(
  (one) => one.role === "member" && one.status === "active" && one.bornOn,
)!;

describe("MembersTable, reading", () => {
  it("shows a screenful and keeps the rest one click away", () => {
    show();

    expect(rows()).toBe(25);
    expect(said()).toMatch("showing the first 25");
    fireEvent.click(screen.getByText(`Show all ${FAMILY_REGISTER.length}`));
    expect(rows()).toBe(FAMILY_REGISTER.length);
    expect(said()).not.toMatch("showing the first");
  });

  it("finds a person by email, by name, and by the family name they log in with", () => {
    show();

    search(FAMILY_REGISTER[9]!.email);
    expect(said()).toMatch(`1 of ${FAMILY_REGISTER.length} people`);

    search(FAMILY_REGISTER[3]!.fullName);
    expect(rows()).toBe(1);

    const admin = FAMILY_REGISTER.find((one) => one.id === SIGNED_IN_ID)!;
    search(admin.familyName);
    expect(rows()).toBe(1);
    expect(screen.getByRole("rowheader")).toHaveTextContent(admin.fullName);
  });

  it("narrows to one branch, and says how many of how many", () => {
    show();

    fireEvent.change(screen.getByLabelText("Filter by branch"), {
      target: { value: "wihogora" },
    });

    expect(said()).toMatch(
      `${countByBranch()["wihogora"]} of ${FAMILY_REGISTER.length} people`,
    );
  });

  it("narrows to the people with no date of birth", () => {
    show();

    fireEvent.click(screen.getByLabelText("Missing a date of birth"));

    expect(said()).toMatch(
      `${missingBirthday().length} of ${FAMILY_REGISTER.length} people`,
    );
  });

  it("says so in a sentence when nobody matches", () => {
    show();

    search("nobody at all");

    expect(screen.getByText("Nobody matches that.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  /* Active is the norm, and marking the norm is noise. */
  it("marks only the people who are not active", () => {
    show();
    fireEvent.click(screen.getByText(`Show all ${FAMILY_REGISTER.length}`));

    const table = screen.getByRole("table");
    const notActive = FAMILY_REGISTER.filter(
      (person) => person.status !== "active",
    );

    expect(within(table).queryByText("Active")).not.toBeInTheDocument();
    expect(within(table).getAllByText(/^(Invited|Deactivated)$/)).toHaveLength(
      notActive.length,
    );
  });

  it("opens with the person a link asked about", () => {
    show({ initialSearch: FAMILY_REGISTER[11]!.fullName });

    expect(rows()).toBe(1);
    /* Twice: the email column, and the copy the name cell carries on a
       narrow screen where that column is dropped. */
    expect(screen.getAllByText(FAMILY_REGISTER[11]!.email)).toHaveLength(2);
  });
});

describe("MembersTable, editing", () => {
  it("sends only what changed, and shows the record the backend sent back", async () => {
    actions.updateMember.mockResolvedValue({
      ok: true,
      person: { ...aMember, email: "somebody.new@example.com" },
      message: `${aMember.fullName} now uses somebody.new@example.com, and was asked to confirm it there.`,
    });
    show();
    search(aMember.fullName);
    openFirstEdit();

    expect(
      screen.getByRole("heading", { name: aMember.fullName }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "somebody.new@example.com" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(said()).toMatch(/was asked to confirm it there/),
    );
    expect(actions.updateMember).toHaveBeenCalledWith(aMember.id, {
      email: "somebody.new@example.com",
    });
    expect(screen.getAllByText("somebody.new@example.com")).toHaveLength(2);
  });

  it("sends nothing when nothing changed", async () => {
    show();
    search(aMember.fullName);
    openFirstEdit();
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: aMember.fullName }),
      ).not.toBeInTheDocument(),
    );
    expect(actions.updateMember).not.toHaveBeenCalled();
  });

  it("changes the branch and the promotion by their ids", async () => {
    actions.updateMember.mockResolvedValue({
      ok: true,
      person: null,
      message: "The changes were kept.",
    });
    show();
    search(aMember.fullName);
    openFirstEdit();

    const other = SAMPLE_CHOICES.subFamilies.find(
      (one) => one.slug !== aMember.branch,
    )!;
    fireEvent.change(screen.getByLabelText("Family branch"), {
      target: { value: String(other.id) },
    });
    fireEvent.change(screen.getByLabelText("Promotion"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => expect(actions.updateMember).toHaveBeenCalled());
    const [, changes] = actions.updateMember.mock.calls[0]!;
    expect(changes).toMatchObject({ subFamilyId: other.id });
    if (aMember.promotion) expect(changes).toMatchObject({ promotionId: null });
  });

  /* The backend's own refusal lands on the field it is about, and the
     dialog stays open so it can be corrected. */
  it("shows a family name somebody else has on that field", async () => {
    actions.updateMember.mockResolvedValue({
      ok: false,
      field: "familyName",
      message: "That family name is already taken.",
    });
    show();
    search(aMember.fullName);
    openFirstEdit();
    fireEvent.change(screen.getByLabelText("Family name"), {
      target: { value: "SOMEONE" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    expect(
      await screen.findByText("That family name is already taken."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: aMember.fullName }),
    ).toBeInTheDocument();
  });

  it("shows any other refusal under the form", async () => {
    actions.updateMember.mockResolvedValue({
      ok: false,
      message: "There must always be at least two active admins.",
    });
    show();
    search(aMember.fullName);
    openFirstEdit();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "A new name" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "There must always be at least two active admins.",
    );
  });

  /* Checked before anything is sent: two people on one address is a code
     that reaches the wrong person. */
  it("refuses an address or a family name somebody else already has", async () => {
    const [first, second] = FAMILY_REGISTER;
    show();
    search(second!.fullName);
    openFirstEdit();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: first!.email.toUpperCase() },
    });
    fireEvent.change(screen.getByLabelText("Family name"), {
      target: { value: first!.familyName },
    });
    fireEvent.click(screen.getByText("Save changes"));

    expect(
      await screen.findByText(
        "Somebody else in the register already uses that address",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Somebody else already logs in with that family name"),
    ).toBeInTheDocument();
    expect(actions.updateMember).not.toHaveBeenCalled();
  });

  it("will not let the signed-in admin change their own role", () => {
    const me = FAMILY_REGISTER.find((person) => person.id === SIGNED_IN_ID)!;
    show();
    search(me.fullName);
    openFirstEdit();

    expect(screen.getByLabelText("Role")).toBeDisabled();
    expect(screen.getByText(/This is your own record/)).toBeInTheDocument();
  });
});

describe("MembersTable, adding", () => {
  it("adds a person through the same panel, and shows them first", async () => {
    actions.addMember.mockResolvedValue({
      ok: true,
      person: null,
      message: "Keza Marie would be added and sent an invitation link.",
    });
    show({ initialAdd: true });

    expect(
      screen.getByRole("heading", { name: "Add a member" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Keza Marie" },
    });
    fireEvent.change(screen.getByLabelText("Family name"), {
      target: { value: "KEZA" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "keza@example.com" },
    });
    fireEvent.click(screen.getByText("Send the invitation"));

    await waitFor(() => expect(said()).toMatch(/Keza Marie would be added/));
    expect(actions.addMember).toHaveBeenCalledWith({
      fullName: "Keza Marie",
      familyName: "KEZA",
      email: "keza@example.com",
      subFamilyId: SAMPLE_CHOICES.subFamilies[0]!.id,
      promotionId: null,
      bornOn: null,
      role: "member",
    });
    search("KEZA");
    expect(rows()).toBe(1);
    expect(screen.getByRole("rowheader")).toHaveTextContent("Keza Marie");
    expect(screen.getByRole("rowheader")).toHaveTextContent("Invited");
  });
});

describe("MembersTable, deactivating", () => {
  it("asks first, keeps them if told to, and offers Undo, which reactivates", async () => {
    actions.deactivateMember.mockResolvedValue({
      ok: true,
      person: null,
      message: `${aMember.fullName} was deactivated and signed out everywhere.`,
    });
    actions.reactivateMember.mockResolvedValue({
      ok: true,
      person: null,
      message: "",
    });
    show();
    search(aMember.fullName);

    fireEvent.click(screen.getByLabelText(`Deactivate ${aMember.fullName}`));
    expect(
      screen.getByRole("heading", { name: `Deactivate ${aMember.fullName}?` }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Keep them"));
    expect(actions.deactivateMember).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText(`Deactivate ${aMember.fullName}`));
    fireEvent.click(screen.getByRole("button", { name: "Deactivate" }));

    const undo = await screen.findByText("Undo");
    expect(actions.deactivateMember).toHaveBeenCalledWith(aMember.id);
    expect(
      within(screen.getByRole("table")).getByText("Deactivated"),
    ).toBeInTheDocument();
    /* Still in the register: deactivating keeps the record. */
    expect(rows()).toBe(1);

    fireEvent.click(undo);

    await waitFor(() =>
      expect(said()).toMatch(`${aMember.fullName} can log in again`),
    );
    expect(actions.reactivateMember).toHaveBeenCalledWith(aMember.id);
    expect(
      within(screen.getByRole("table")).queryByText("Deactivated"),
    ).not.toBeInTheDocument();
  });

  it("reactivates somebody deactivated from their row", async () => {
    const gone = FAMILY_REGISTER.find((one) => one.status === "deactivated")!;
    actions.reactivateMember.mockResolvedValue({
      ok: true,
      person: { ...gone, status: "active" },
      message: `${gone.fullName} can log in again.`,
    });
    show();
    search(gone.fullName);

    fireEvent.click(screen.getByLabelText(`Reactivate ${gone.fullName}`));

    await waitFor(() =>
      expect(said()).toMatch(`${gone.fullName} can log in again`),
    );
  });

  it("says what the backend said when it refuses", async () => {
    actions.deactivateMember.mockResolvedValue({
      ok: false,
      message: "We could not reach the server. Try again in a moment.",
    });
    show();
    search(aMember.fullName);
    fireEvent.click(screen.getByLabelText(`Deactivate ${aMember.fullName}`));
    fireEvent.click(screen.getByRole("button", { name: "Deactivate" }));

    await waitFor(() => expect(said()).toMatch(/could not reach the server/));
    expect(
      within(screen.getByRole("table")).queryByText("Deactivated"),
    ).not.toBeInTheDocument();
  });

  it("will not offer to deactivate the signed-in administrator", () => {
    const me = FAMILY_REGISTER.find((person) => person.id === SIGNED_IN_ID)!;
    show();
    search(me.fullName);

    expect(
      screen.getByRole("button", { name: new RegExp(`${me.fullName} is you`) }),
    ).toBeDisabled();
  });
});

describe("MembersTable, a new link", () => {
  it("is offered to somebody who has not used theirs, and sent on request", async () => {
    const invited = FAMILY_REGISTER.find((one) => one.status === "invited")!;
    actions.sendNewLink.mockResolvedValue({
      ok: true,
      person: null,
      message: `A new invitation link went to ${invited.email}.`,
    });
    show();
    search(invited.fullName);
    openFirstEdit();

    fireEvent.click(screen.getByText("Send a new link"));

    await waitFor(() =>
      expect(said()).toMatch(`A new invitation link went to ${invited.email}`),
    );
    expect(actions.sendNewLink).toHaveBeenCalledWith(invited.id);
  });

  it("is not offered to a member who has already joined", () => {
    show();
    search(aMember.fullName);
    openFirstEdit();

    expect(screen.queryByText("Send a new link")).not.toBeInTheDocument();
  });
});

/**
 * The two-administrator floor.
 *
 * One administrator means one forgotten password locks the register for
 * good: the reset works by another administrator sending the link. These
 * hold both routes to breaking it — demote and deactivate — closed from the
 * UI. They are a courtesy and not a rule: the backend refuses the same
 * thing with 409 `too_few_admins`.
 */
describe("the two-administrator floor", () => {
  const anAdmin = administrators(FAMILY_REGISTER).find(
    (person) => person.id !== SIGNED_IN_ID,
  )!;

  it("will not let the last administrators be deactivated", () => {
    show();
    search(anAdmin.fullName);

    expect(
      screen.getByRole("button", {
        name: new RegExp(`${anAdmin.fullName} cannot be deactivated`),
      }),
    ).toBeDisabled();
  });

  it("will not let their role be changed, and says why", async () => {
    show();
    search(anAdmin.fullName);
    openFirstEdit();

    await waitFor(() => expect(screen.getByLabelText("Role")).toBeDisabled());
    expect(
      screen.getByText(/register needs two administrators/),
    ).toBeInTheDocument();
  });

  /* An administrator's new link is also their password reset. */
  it("offers an administrator a new link", () => {
    show();
    search(anAdmin.fullName);
    openFirstEdit();

    expect(screen.getByText(/choose a new password/)).toBeInTheDocument();
  });

  it("leaves everybody else alone", () => {
    show();
    search(aMember.fullName);

    expect(
      screen.getByRole("button", { name: `Deactivate ${aMember.fullName}` }),
    ).toBeEnabled();
  });
});

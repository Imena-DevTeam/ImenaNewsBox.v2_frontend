import { ToastProvider } from "@/components/ui/Toaster";
import { describe, expect, it } from "vitest";
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
  SIGNED_IN_ID,
} from "@/features/members/data";
import { MembersTable } from "./MembersTable";

/* The status line, then whatever the toast is saying about the last action. */
const count = () =>
  `${screen.getByRole("status").textContent ?? ""} ${
    document.querySelector("[data-toaster]")?.textContent ?? ""
  }`;

const rows = () => screen.getAllByRole("row").length - 1; // less the header

const search = (text: string) =>
  fireEvent.change(screen.getByLabelText("Search members"), {
    target: { value: text },
  });

const openFirstEdit = () => fireEvent.click(screen.getAllByText("Edit")[0]!);

describe("MembersTable", () => {
  it("shows a screenful and keeps the rest one click away", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    expect(rows()).toBe(25);
    fireEvent.click(screen.getByText(`Show all ${FAMILY_REGISTER.length}`));
    expect(rows()).toBe(FAMILY_REGISTER.length);
  });

  /* Whoever is looking a person up has the name or the address, not both. */
  it("finds a person by their email address", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    search(FAMILY_REGISTER[9]!.email);

    expect(count()).toMatch(`1 of ${FAMILY_REGISTER.length} people`);
    expect(rows()).toBe(1);
  });

  it("finds a person by name", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    search(FAMILY_REGISTER[3]!.fullName);

    expect(rows()).toBe(1);
  });

  it("narrows to one branch, and says how many of how many", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    fireEvent.change(screen.getByLabelText("Filter by branch"), {
      target: { value: "wihogora" },
    });

    expect(count()).toMatch(
      `${countByBranch()["wihogora"]} of ${FAMILY_REGISTER.length} people`,
    );
  });

  /* The one data gap the rest of the site visibly suffers from: these people
     are missing from the Birthdays page until somebody fills it in. */
  it("narrows to the people with no date of birth", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    fireEvent.click(screen.getByLabelText("Missing a date of birth"));

    expect(count()).toMatch(
      `${missingBirthday().length} of ${FAMILY_REGISTER.length} people`,
    );
  });

  it("says so in a sentence when nobody matches", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    search("nobody at all");

    expect(screen.getByText("Nobody matches that.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  /* Active is the norm, and marking the norm is noise — the same judgement
     the archive makes about published posts. */
  it("marks only the people who are not active", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });
    fireEvent.click(screen.getByText(`Show all ${FAMILY_REGISTER.length}`));

    const table = screen.getByRole("table");
    const notActive = FAMILY_REGISTER.filter(
      (person) => person.status !== "active",
    );

    expect(within(table).queryByText("Active")).not.toBeInTheDocument();
    expect(within(table).getAllByText(/^(Invited|Suspended)$/)).toHaveLength(
      notActive.length,
    );
  });

  it("opens a person for editing, and reports an email change", async () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    const person = FAMILY_REGISTER.find(
      (one) => one.id !== SIGNED_IN_ID && one.bornOn,
    )!;
    search(person.fullName);
    openFirstEdit();

    expect(
      screen.getByRole("heading", { name: person.fullName }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "somebody.new@imenafamily.rw" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(count()).toMatch(/would sign in with somebody.new@imenafamily.rw/),
    );
    expect(count()).toMatch(/Nothing was stored/);
  });

  /* Two people on one address is a broken login, not an untidy register. */
  it("refuses an address somebody else already uses", async () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    const [first, second] = FAMILY_REGISTER;
    search(second!.fullName);
    openFirstEdit();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: first!.email },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(
        screen.getByText(
          "Somebody else in the register already uses that address",
        ),
      ).toBeInTheDocument(),
    );
  });

  /* Taking your own admin role away locks you out of the page you are on. */
  it("will not let the signed-in admin drop their own role", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    const me = FAMILY_REGISTER.find((person) => person.id === SIGNED_IN_ID)!;
    search(me.fullName);
    openFirstEdit();

    expect(screen.getByLabelText("Role")).toBeDisabled();
  });

  it("adds a person through the same panel, and says nothing was stored", async () => {
    render(<MembersTable people={FAMILY_REGISTER} initialAdd />, {
      wrapper: ToastProvider,
    });

    expect(
      screen.getByRole("heading", { name: "Add a member" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Keza Marie" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "keza.marie@imenafamily.rw" },
    });
    fireEvent.click(screen.getByText("Send the invitation"));

    await waitFor(() =>
      expect(count()).toMatch(/Keza Marie would be added to the register/),
    );
    expect(count()).toMatch(/no email was sent/);
  });

  it("asks before removing somebody, and keeps them if told to", async () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    const person = FAMILY_REGISTER[5]!;
    search(person.fullName);
    fireEvent.click(screen.getByLabelText(`Remove ${person.fullName}`));

    expect(
      screen.getByRole("heading", {
        name: `Remove ${person.fullName} from the register?`,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Keep them"));
    expect(rows()).toBe(1);

    fireEvent.click(screen.getByLabelText(`Remove ${person.fullName}`));
    fireEvent.click(screen.getByText("Remove them"));

    await waitFor(() =>
      expect(count()).toMatch(new RegExp(`${person.fullName} was removed`)),
    );
  });

  it("opens with the person a link asked about", () => {
    const person = FAMILY_REGISTER[11]!;
    render(
      <MembersTable people={FAMILY_REGISTER} initialSearch={person.fullName} />,
    );

    expect(rows()).toBe(1);
    /* Twice: the email column, and the copy the name cell carries on a
       narrow screen where that column is dropped. One of the two is always
       hidden by CSS. */
    expect(screen.getAllByText(person.email)).toHaveLength(2);
  });
  /* The confirmation is the only thing between a mis-aimed click and a
     relative disappearing from the register, so the removal is offered back
     for as long as the outcome line is on screen. Nothing was stored, so
     putting them back costs one splice. */
  it("offers a removal back, and puts them where they were", async () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    const person = FAMILY_REGISTER[7]!;
    search(person.fullName);
    fireEvent.click(screen.getByLabelText(`Remove ${person.fullName}`));
    fireEvent.click(screen.getByText("Remove them"));

    /* The row slides out before it goes, so the register catches up a beat
       after the outcome is reported. */
    const undo = await screen.findByText("Undo");
    expect(screen.queryByText("Nobody matches that.")).toBeInTheDocument();

    fireEvent.click(undo);

    expect(count()).toMatch(`${person.fullName} is back in the register`);
    expect(rows()).toBe(1);
    expect(screen.queryByText("Undo")).not.toBeInTheDocument();
  });

  /* Twenty-five of seventy-three looks exactly like all twenty-five of
     twenty-five, and the difference matters to somebody about to say the
     register is short. */
  it("says which slice of the register is on screen", () => {
    render(<MembersTable people={FAMILY_REGISTER} />, {
      wrapper: ToastProvider,
    });

    expect(count()).toMatch("showing the first 25");

    fireEvent.click(screen.getByText(`Show all ${FAMILY_REGISTER.length}`));
    expect(count()).not.toMatch("showing the first");
  });
  /**
   * The two-administrator floor.
   *
   * One administrator means one forgotten password locks the register for
   * good: the reset works by another administrator sending the link, so
   * there has to be another administrator. These hold the three routes to
   * breaking it — demote, suspend, remove — closed from the UI.
   *
   * They are a courtesy and not a rule, and the test says so because the
   * backend has to refuse the same thing: a disabled control stops a
   * mis-click, not a request.
   */
  describe("the two-administrator floor", () => {
    const anAdmin = administrators(FAMILY_REGISTER).find(
      (person) => person.id !== SIGNED_IN_ID,
    )!;

    it("will not let the last administrators be removed", () => {
      render(<MembersTable people={FAMILY_REGISTER} />, {
        wrapper: ToastProvider,
      });
      search(anAdmin.fullName);

      const remove = screen.getByRole("button", {
        name: new RegExp(`${anAdmin.fullName} cannot be removed`),
      });
      expect(remove).toBeDisabled();
    });

    it("will not let their role be changed, and says why", async () => {
      render(<MembersTable people={FAMILY_REGISTER} />, {
        wrapper: ToastProvider,
      });
      search(anAdmin.fullName);
      openFirstEdit();

      await waitFor(() => expect(screen.getByLabelText("Role")).toBeDisabled());
      expect(
        screen.getByText(/register needs two administrators/),
      ).toBeInTheDocument();
    });

    /* Suspending an administrator takes the role away as surely as demoting
       them, so closing one door and leaving the other open would be worse
       than closing neither. */
    it("will not let them be suspended either", async () => {
      render(<MembersTable people={FAMILY_REGISTER} />, {
        wrapper: ToastProvider,
      });
      search(anAdmin.fullName);
      openFirstEdit();

      /* Scoped to the panel's own select: the filter row above the table
         offers a Suspended option too, and that one is not the floor's
         business. */
      const status = await screen.findByLabelText("Status");
      expect(
        within(status).getByRole("option", { name: "Suspended" }),
      ).toBeDisabled();
    });

    /* Nobody else is locked: the floor is about the role, not about being
       in the register. */
    it("leaves everybody else alone", () => {
      const member = FAMILY_REGISTER.find(
        (person) => person.role === "member",
      )!;
      render(<MembersTable people={FAMILY_REGISTER} />, {
        wrapper: ToastProvider,
      });
      search(member.fullName);

      expect(
        screen.getByRole("button", { name: `Remove ${member.fullName}` }),
      ).toBeEnabled();
    });
  });

  /* An invitation is the only way in, and the outcome has to say so rather
     than implying an account now exists. */
  it("reports the invitation, not an account", async () => {
    render(<MembersTable people={FAMILY_REGISTER} initialAdd />, {
      wrapper: ToastProvider,
    });

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Kalisa Shema" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "kalisa.shema@imenafamily.rw" },
    });
    fireEvent.click(screen.getByText("Send the invitation"));

    await waitFor(() =>
      expect(count()).toMatch(
        /sent an invitation link at kalisa.shema@imenafamily\.rw/,
      ),
    );
    expect(count()).toMatch(/stay invited until they opened it/);
  });
});

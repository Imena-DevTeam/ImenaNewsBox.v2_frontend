import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/components/ui/Toaster";
import type { Device, MyAccount } from "@/types/member";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

/* The server actions are the backend's door; each test says what it
   answered. */
const actions = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  setProfilePhoto: vi.fn(),
  removeProfilePhoto: vi.fn(),
  sendEmailCode: vi.fn(),
  confirmEmail: vi.fn(),
  signOutDevice: vi.fn(),
}));
vi.mock("@/app/actions/profile", () => actions);

const { ProfileView } = await import("./ProfileView");

afterEach(() => {
  for (const action of Object.values(actions)) action.mockReset();
});

const account: MyAccount = {
  id: "u-1",
  fullName: "Rwema Jean",
  familyName: "RWEMA",
  email: "rwema@example.com",
  emailConfirmed: true,
  branch: "hope",
  promotion: { id: 3, name: "SHEJA_NGABO" },
  bornOn: "1990-05-04",
  bio: "",
  photo: "",
};

const NOW = "2026-11-26T10:00:00Z";

const devices: Device[] = [
  {
    id: "s-1",
    label: "Firefox on Windows",
    signedInAt: "2026-11-20T10:00:00Z",
    lastUsedAt: NOW,
    current: true,
  },
  {
    id: "s-2",
    label: "Safari on iPhone",
    signedInAt: "2026-11-01T10:00:00Z",
    lastUsedAt: "2026-11-26T08:00:00Z",
    current: false,
  },
];

function show(
  props: Partial<Parameters<typeof ProfileView>[0]> = {},
  mine: MyAccount = account,
) {
  render(
    <ProfileView
      account={mine}
      devices={devices}
      onSignOut={async () => {}}
      motto="Twese hamwe"
      mottoMeaning="All of us together"
      branch="Hope"
      now={NOW}
      {...props}
    />,
    { wrapper: ToastProvider },
  );
}

const toast = () => document.querySelector("[data-toaster]")?.textContent;

describe("ProfileView", () => {
  it("shows the account: name, family name, email, birthday and promotion", () => {
    show();
    expect(
      screen.getByRole("heading", { level: 1, name: "Rwema Jean" }),
    ).toBeInTheDocument();
    expect(screen.getByText("RWEMA")).toBeInTheDocument();
    expect(screen.getByText("rwema@example.com")).toBeInTheDocument();
    expect(screen.getByText("May 4, 1990")).toBeInTheDocument();
    expect(screen.getByText("Sheja Ngabo")).toBeInTheDocument();
  });

  it("shows the branch's official motto, and offers no way to change it", () => {
    show({ startEditing: true });
    expect(screen.getByText("“Twese hamwe”")).toBeInTheDocument();
    expect(screen.queryByLabelText(/motto/i)).toBeNull();
  });

  it("sends only what changed, and shows what the backend kept", async () => {
    actions.updateProfile.mockResolvedValue({
      ok: true,
      message: "Your profile was saved.",
      account: { ...account, bio: "I keep the family photographs." },
    });
    show({ startEditing: true });

    fireEvent.change(screen.getByLabelText("About you"), {
      target: { value: "  I keep the family photographs. " },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(
        screen.getByText("I keep the family photographs."),
      ).toBeInTheDocument(),
    );
    expect(actions.updateProfile).toHaveBeenCalledWith({
      bio: "I keep the family photographs.",
    });
    expect(toast()).toMatch("Your profile was saved.");
  });

  it("clears a birthday by sending null", async () => {
    actions.updateProfile.mockResolvedValue({
      ok: true,
      message: "Your profile was saved.",
      account: null,
    });
    show({ startEditing: true });

    fireEvent.change(screen.getByLabelText("Date of birth"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() =>
      expect(actions.updateProfile).toHaveBeenCalledWith({ bornOn: null }),
    );
  });

  it("keeps the dialog open with the backend's refusal", async () => {
    actions.updateProfile.mockResolvedValue({
      ok: false,
      message: "We could not reach the server. Try again in a moment.",
    });
    show({ startEditing: true });

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jean" },
    });
    fireEvent.click(screen.getByText("Save changes"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not reach the server",
    );
    expect(screen.getByText("Your details")).toBeInTheDocument();
  });

  it("asks for nothing to confirm while the address is confirmed", () => {
    show();
    expect(screen.queryByText("Confirm your email address")).toBeNull();
  });

  it("confirms a changed address with the code sent to it", async () => {
    actions.confirmEmail.mockResolvedValue({
      ok: true,
      message: "Your email address is confirmed.",
      account: { ...account, emailConfirmed: true },
    });
    show({}, { ...account, emailConfirmed: false });

    expect(screen.getByText("Not confirmed yet")).toBeInTheDocument();
    fireEvent.paste(screen.getAllByRole("textbox")[0]!, {
      clipboardData: { getData: () => "12345" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() =>
      expect(screen.queryByText("Confirm your email address")).toBeNull(),
    );
    expect(actions.confirmEmail).toHaveBeenCalledWith("12345");
    expect(screen.queryByText("Not confirmed yet")).toBeNull();
  });

  it("marks this device, and signs another one out", async () => {
    actions.signOutDevice.mockResolvedValue({
      ok: true,
      message: "That device was signed out.",
    });
    show();

    expect(screen.getByText(/^This device/)).toBeInTheDocument();
    expect(screen.getByText(/Last used 2 hours ago/)).toBeInTheDocument();
    /* This device signs out with the button at the top, which clears its
       cookies too. */
    expect(
      screen.queryByRole("button", { name: "Sign out Firefox on Windows" }),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Sign out Safari on iPhone" }),
    );

    await waitFor(() =>
      expect(screen.queryByText("Safari on iPhone")).toBeNull(),
    );
    expect(actions.signOutDevice).toHaveBeenCalledWith("s-2");
  });

  it("says so when the devices could not be loaded", () => {
    show({ devices: null });
    expect(
      screen.getByText(/list of devices could not be loaded/),
    ).toBeInTheDocument();
  });

  it("refuses a photograph over 5 MB before sending it", async () => {
    show();
    const input =
      document.querySelector<HTMLInputElement>('input[type="file"]')!;
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(input, { target: { files: [big] } });

    await waitFor(() => expect(toast()).toMatch(/over 5 MB/));
    expect(actions.setProfilePhoto).not.toHaveBeenCalled();
  });
});

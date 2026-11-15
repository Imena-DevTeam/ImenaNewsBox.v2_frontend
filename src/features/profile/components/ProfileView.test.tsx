import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ProfileView } from "./ProfileView";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

const props = {
  onSignOut: async () => {},
  motto: "Twese hamwe",
  mottoMeaning: "All of us together",
};

describe("ProfileView", () => {
  it("shows the branch's official motto", () => {
    render(<ProfileView {...props} />);
    expect(screen.getByText("“Twese hamwe”")).toBeInTheDocument();
    expect(screen.getByText("All of us together")).toBeInTheDocument();
  });

  it("offers no way to change the motto", () => {
    render(<ProfileView {...props} startEditing />);
    expect(screen.getByLabelText("Date of birth")).toBeInTheDocument();
    expect(screen.queryByLabelText(/motto/i)).toBeNull();
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("keeps a date of birth the member adds", () => {
    render(<ProfileView {...props} startEditing />);
    fireEvent.change(screen.getByLabelText("Date of birth"), {
      target: { value: "1992-03-14" },
    });
    fireEvent.click(screen.getByText("Save changes"));
    expect(localStorage.getItem("imena:profile_born_on")).toBe("1992-03-14");
  });
});

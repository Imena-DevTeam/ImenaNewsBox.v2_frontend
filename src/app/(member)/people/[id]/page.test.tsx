import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FAMILY_REGISTER } from "@/features/members/data";
import PersonPage from "./page";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  usePathname: () => "/people/x",
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/components/layout/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <p>{title}</p>,
}));

async function open(id: string) {
  render(await PersonPage({ params: Promise.resolve({ id }) }));
}

describe("a person's page", () => {
  it("shows the name, branch link and birthday, and never the email", async () => {
    const person = FAMILY_REGISTER.find(
      (p) => p.bornOn && p.status === "active",
    )!;
    await open(person.id);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      person.fullName,
    );
    expect(screen.getByRole("link", { name: /family$/ })).toHaveAttribute(
      "href",
      `/families/${person.branch}`,
    );
    expect(screen.queryByText(person.email)).toBeNull();
    /* Day and month only: the year of birth stays private. */
    expect(
      screen.queryByText(new RegExp(person.bornOn.slice(0, 4))),
    ).toBeNull();
  });

  it("shows a portrait when the register has one, initials when not", async () => {
    const withPhoto = FAMILY_REGISTER.find((p) => p.photo)!;
    await open(withPhoto.id);
    expect(
      document.querySelector(`img[src="${withPhoto.photo}"]`),
    ).not.toBeNull();
  });

  it("is not found for somebody who is suspended, or nobody", async () => {
    const suspended = FAMILY_REGISTER.find((p) => p.status === "suspended")!;
    await expect(open(suspended.id)).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(open("m-999")).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

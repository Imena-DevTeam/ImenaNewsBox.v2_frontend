import { describe, expect, it } from "vitest";
import type { UserRead } from "@/types/wire";
import {
  accountFromMe,
  deviceFromSession,
  memberFromAccount,
  personFromPublic,
  promotionLabel,
  statusOf,
} from "./wire";

function account(changes: Partial<UserRead> = {}): UserRead {
  return {
    id: "u-1",
    family_name: "RWEMA",
    display_name: "Rwema Jean",
    photo_url: null,
    sub_family: { id: 3, name: "WIHOGORA" },
    promotion: { id: 3, name: "SHEJA_NGABO" },
    birthday: "1990-05-04",
    bio: null,
    email: "rwema@example.com",
    email_verified_at: "2026-11-18T07:44:50Z",
    invited_at: "2026-11-17T10:00:00Z",
    role: "member",
    has_password: false,
    sanity_author_id: null,
    deactivated_at: null,
    created_at: "2026-11-17T10:00:00Z",
    ...changes,
  };
}

describe("the backend's people, as the register reads them", () => {
  it("turns an account into a register row", () => {
    expect(memberFromAccount(account())).toEqual({
      id: "u-1",
      fullName: "Rwema Jean",
      familyName: "RWEMA",
      email: "rwema@example.com",
      branch: "wihogora",
      promotion: { id: 3, name: "SHEJA_NGABO" },
      bornOn: "1990-05-04",
      role: "member",
      status: "active",
      joinedOn: "2026-11-17",
      photo: "",
    });
  });

  /* A member uses their invitation by confirming the address; an
     administrator by choosing a password, without which they cannot log in. */
  it("reads who is still invited, by role", () => {
    expect(statusOf(account({ email_verified_at: null }))).toBe("invited");
    expect(statusOf(account({ role: "admin", has_password: false }))).toBe(
      "invited",
    );
    expect(statusOf(account({ role: "admin", has_password: true }))).toBe(
      "active",
    );
  });

  it("reads deactivation before anything else", () => {
    expect(
      statusOf(
        account({ email_verified_at: null, deactivated_at: "2026-11-20" }),
      ),
    ).toBe("deactivated");
  });

  it("names a promotion the way people say it", () => {
    expect(promotionLabel("SHEJA_NGABO")).toBe("Sheja Ngabo");
    expect(promotionLabel("IBIMANUKA")).toBe("Ibimanuka");
  });

  it("keeps a member's public page to what every member may see", () => {
    expect(
      personFromPublic({
        id: "u-1",
        family_name: "RWEMA",
        display_name: "Rwema Jean",
        photo_url: "https://res.cloudinary.com/x.jpg",
        sub_family: { id: 1, name: "HOPE" },
        promotion: null,
        birthday: { month: 5, day: 4 },
        bio: "Hello",
      }),
    ).toEqual({
      id: "u-1",
      fullName: "Rwema Jean",
      familyName: "RWEMA",
      branch: "hope",
      promotion: null,
      birthday: { month: 5, day: 4 },
      photo: "https://res.cloudinary.com/x.jpg",
      bio: "Hello",
    });
  });

  /* An administrator's change of address clears the confirmation, and the
     profile asks for the code until it is typed in. */
  it("reads your own account, and whether its address is confirmed", () => {
    expect(accountFromMe(account())).toMatchObject({
      familyName: "RWEMA",
      emailConfirmed: true,
      bornOn: "1990-05-04",
      bio: "",
    });
    expect(
      accountFromMe(account({ email_verified_at: null })).emailConfirmed,
    ).toBe(false);
  });

  it("reads a signed-in device", () => {
    expect(
      deviceFromSession({
        id: "s-1",
        device_label: "Safari on iPhone",
        created_at: "2026-11-01T10:00:00Z",
        last_used_at: "2026-11-26T08:00:00Z",
        expires_at: "2027-02-24T08:00:00Z",
        current: false,
      }),
    ).toEqual({
      id: "s-1",
      label: "Safari on iPhone",
      signedInAt: "2026-11-01T10:00:00Z",
      lastUsedAt: "2026-11-26T08:00:00Z",
      current: false,
    });
  });
});

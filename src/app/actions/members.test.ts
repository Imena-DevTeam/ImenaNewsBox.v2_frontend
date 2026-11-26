// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ACCESS_COOKIE } from "@/lib/session";
import type { UserRead } from "@/types/wire";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === ACCESS_COOKIE ? { name, value: "access-1" } : undefined,
  }),
  headers: async () => new Headers({ "user-agent": "Firefox 140" }),
}));

const {
  addMember,
  deactivateMember,
  reactivateMember,
  sendNewLink,
  updateMember,
} = await import("./members");

const ID = "4f9c2a8e-0000-4000-8000-000000000001";

function account(changes: Partial<UserRead> = {}): UserRead {
  return {
    id: ID,
    family_name: "KEZA",
    display_name: "Keza Marie",
    photo_url: null,
    sub_family: { id: 2, name: "LIGHT" },
    promotion: null,
    birthday: null,
    bio: null,
    email: "keza@example.com",
    email_verified_at: null,
    invited_at: "2026-11-26T08:00:00Z",
    role: "member",
    has_password: false,
    sanity_author_id: null,
    deactivated_at: null,
    created_at: "2026-11-26T08:00:00Z",
    ...changes,
  };
}

const fields = {
  fullName: "Keza Marie",
  familyName: "KEZA",
  email: "keza@example.com",
  subFamilyId: 2,
  promotionId: null,
  bornOn: null,
  role: "member" as const,
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const refusal = (status: number, code: string, message: string) =>
  json({ error: { code, message } }, status);

let fetchMock: ReturnType<typeof vi.fn>;

const call = (index = 0) => {
  const [url, init] = fetchMock.mock.calls[index]! as [string, RequestInit];
  return {
    url: String(url),
    method: init.method,
    body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
    authorization: new Headers(init.headers).get("authorization"),
  };
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  revalidatePath.mockReset();
});

describe("the register, against the backend", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("adds somebody in the backend's words, and says the invitation went", async () => {
    fetchMock.mockResolvedValue(json(account(), 201));

    const outcome = await addMember(fields);

    expect(call()).toMatchObject({
      url: "http://api.test/api/v1/users",
      method: "POST",
      authorization: "Bearer access-1",
      body: {
        family_name: "KEZA",
        display_name: "Keza Marie",
        email: "keza@example.com",
        sub_family_id: 2,
        promotion_id: null,
        birthday: null,
        role: "member",
      },
    });
    expect(outcome).toMatchObject({
      ok: true,
      person: {
        id: ID,
        familyName: "KEZA",
        branch: "light",
        status: "invited",
      },
    });
    expect(outcome.message).toMatch(/invitation link went to keza@example.com/);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/members");
  });

  /* The backend keeps the person when the email fails, and says so by
     leaving invited_at empty. */
  it("says when the invitation email could not be sent", async () => {
    fetchMock.mockResolvedValue(json(account({ invited_at: null }), 201));

    const outcome = await addMember(fields);

    expect(outcome.ok).toBe(true);
    expect(outcome.message).toMatch(/could not be sent.*send a new link/);
  });

  it("puts a family name or an address somebody else has on its field", async () => {
    fetchMock.mockResolvedValueOnce(
      refusal(409, "family_name_taken", "That family name is taken."),
    );
    expect(await addMember(fields)).toEqual({
      ok: false,
      field: "familyName",
      message: "That family name is taken.",
    });

    fetchMock.mockResolvedValueOnce(
      refusal(409, "email_taken", "That email is taken."),
    );
    expect(await addMember(fields)).toEqual({
      ok: false,
      field: "email",
      message: "That email is taken.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("refuses details the form would have refused, without asking", async () => {
    expect(await addMember({ ...fields, email: "not an address" })).toEqual({
      ok: false,
      message: "Some of those details cannot be used.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends an edit as only the fields that changed, in the backend's names", async () => {
    fetchMock.mockResolvedValue(
      json(account({ email: "new@example.com", email_verified_at: null })),
    );

    const outcome = await updateMember(ID, {
      email: "new@example.com",
      promotionId: null,
    });

    expect(call()).toMatchObject({
      url: `http://api.test/api/v1/users/${ID}`,
      method: "PATCH",
      body: { email: "new@example.com", promotion_id: null },
    });
    expect(Object.keys(call().body as object)).toHaveLength(2);
    expect(outcome.message).toMatch(
      /now uses new@example.com, and was asked to confirm it/,
    );
  });

  it("says a new administrator was sent a link for their password", async () => {
    fetchMock.mockResolvedValue(json(account({ role: "admin" })));

    const outcome = await updateMember(ID, { role: "admin" });

    expect(outcome.message).toMatch(/choose their administrator password/);
  });

  /* The floor is the backend's rule: its refusal is shown in its words. */
  it("keeps the backend's words when it refuses for the floor", async () => {
    fetchMock.mockResolvedValue(
      refusal(409, "too_few_admins", "There must be two active admins."),
    );

    expect(await updateMember(ID, { role: "member" })).toEqual({
      ok: false,
      message: "There must be two active admins.",
    });
  });

  it("deactivates, reactivates and sends a new link", async () => {
    fetchMock
      .mockResolvedValueOnce(
        json(account({ deactivated_at: "2026-11-26T09:00:00Z" })),
      )
      .mockResolvedValueOnce(json(account()))
      .mockResolvedValueOnce(json(account()));

    const off = await deactivateMember(ID);
    expect(call(0)).toMatchObject({
      url: `http://api.test/api/v1/users/${ID}/deactivate`,
      method: "POST",
    });
    expect(off).toMatchObject({
      ok: true,
      person: { status: "deactivated" },
    });
    expect(off.message).toMatch(/deactivated and signed out everywhere/);

    expect((await reactivateMember(ID)).message).toMatch(/can log in again/);
    expect(call(1).url).toMatch(/\/reactivate$/);

    expect((await sendNewLink(ID)).message).toMatch(
      /new invitation link went to keza@example.com/,
    );
    expect(call(2).url).toMatch(/\/invitation$/);
  });

  it("says the server could not be reached, rather than that it refused", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    expect(await deactivateMember(ID)).toEqual({
      ok: false,
      message: "We could not reach the server. Try again in a moment.",
    });
  });
});

describe("the register, without a backend", () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("stores nothing in fixture mode, and says so", async () => {
    const outcome = await addMember(fields);

    expect(outcome).toMatchObject({ ok: true, person: null });
    expect(outcome.message).toMatch(/nothing was stored or sent/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers nobody in a production build", async () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(await deactivateMember(ID)).toMatchObject({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

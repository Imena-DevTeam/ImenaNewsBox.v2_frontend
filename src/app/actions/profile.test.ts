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

const ID = "4f9c2a8e-0000-4000-8000-000000000001";

/* The viewer is the backend's /users/me; here it is the account below. */
vi.mock("@/lib/viewer", () => ({
  getViewer: async () => ({ id: ID, role: "member" }),
}));

const {
  confirmEmail,
  removeProfilePhoto,
  sendEmailCode,
  setProfilePhoto,
  signOutDevice,
  updateProfile,
} = await import("./profile");

function account(changes: Partial<UserRead> = {}): UserRead {
  return {
    id: ID,
    family_name: "RWEMA",
    display_name: "Rwema Jean",
    photo_url: null,
    sub_family: { id: 1, name: "HOPE" },
    promotion: null,
    birthday: null,
    bio: null,
    email: "rwema@example.com",
    email_verified_at: "2026-11-18T07:44:50Z",
    invited_at: null,
    role: "member",
    has_password: false,
    sanity_author_id: null,
    deactivated_at: null,
    created_at: "2026-11-17T10:00:00Z",
    ...changes,
  };
}

const json = (body: unknown, status = 200) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
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
    init,
    body:
      typeof init.body === "string"
        ? (JSON.parse(init.body) as unknown)
        : undefined,
  };
};

const photo = (bytes: number, type = "image/jpeg") => {
  const form = new FormData();
  form.append("photo", new File([new Uint8Array(bytes)], "me.jpg", { type }));
  return form;
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  revalidatePath.mockReset();
});

describe("your own account, against the backend", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.test/api/v1");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("saves only what changed, in the backend's names, and refreshes the frame", async () => {
    fetchMock.mockResolvedValue(
      json(account({ bio: "Hello", birthday: null })),
    );

    const outcome = await updateProfile({ bio: "Hello", bornOn: null });

    expect(call()).toMatchObject({
      url: "http://api.test/api/v1/users/me",
      method: "PATCH",
      body: { bio: "Hello", birthday: null },
    });
    expect(outcome).toMatchObject({
      ok: true,
      account: { bio: "Hello", bornOn: "", emailConfirmed: true },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("sends a photograph as a form, to the viewer's own account", async () => {
    fetchMock.mockResolvedValue(
      json(account({ photo_url: "https://res.cloudinary.com/me.jpg" })),
    );

    const outcome = await setProfilePhoto(photo(1000));

    expect(call()).toMatchObject({
      url: `http://api.test/api/v1/users/${ID}/photo`,
      method: "PUT",
    });
    expect(call().init.body).toBeInstanceOf(FormData);
    expect(outcome).toMatchObject({
      ok: true,
      account: { photo: "https://res.cloudinary.com/me.jpg" },
    });
  });

  it("refuses a photograph that is too large or not an image, without sending it", async () => {
    expect(await setProfilePhoto(photo(5 * 1024 * 1024 + 1))).toMatchObject({
      ok: false,
      message: expect.stringMatching(/over 5 MB/),
    });
    expect(await setProfilePhoto(photo(10, "application/pdf"))).toMatchObject({
      ok: false,
      message: expect.stringMatching(/JPEG, PNG, WebP or HEIC/),
    });
    expect(await setProfilePhoto(new FormData())).toMatchObject({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the backend's words when it refuses the photograph", async () => {
    fetchMock.mockResolvedValue(
      refusal(400, "unsupported_image", "That file is not a photograph."),
    );

    expect(await setProfilePhoto(photo(1000))).toEqual({
      ok: false,
      message: "That file is not a photograph.",
    });
  });

  it("removes the photograph", async () => {
    fetchMock.mockResolvedValue(json(account()));

    expect(await removeProfilePhoto()).toMatchObject({ ok: true });
    expect(call()).toMatchObject({
      url: `http://api.test/api/v1/users/${ID}/photo`,
      method: "DELETE",
    });
  });

  it("asks for another code and says how long to wait for the next", async () => {
    fetchMock.mockResolvedValue(
      json({
        message: "A code is on its way.",
        expires_in: 600,
        resend_after: 60,
      }),
    );

    expect(await sendEmailCode()).toEqual({
      ok: true,
      message: "A code is on its way.",
      resendAfter: 60,
    });
    expect(call().url).toBe("http://api.test/api/v1/users/me/email/resend");
  });

  it("treats an address already confirmed as done", async () => {
    fetchMock.mockResolvedValue(
      refusal(409, "email_already_verified", "It is confirmed already."),
    );

    expect(await sendEmailCode()).toMatchObject({ ok: true, resendAfter: 0 });
  });

  it("confirms the address with the code, and refuses a wrong one in the backend's words", async () => {
    fetchMock
      .mockResolvedValueOnce(
        refusal(401, "invalid_code", "That code is wrong."),
      )
      .mockResolvedValueOnce(json(account()));

    expect(await confirmEmail("12345")).toEqual({
      ok: false,
      message: "That code is wrong.",
    });
    expect(call().body).toEqual({ code: "12345" });

    expect(await confirmEmail("12345")).toMatchObject({
      ok: true,
      account: { emailConfirmed: true },
    });
  });

  it("does not send a code that is not five digits", async () => {
    expect(await confirmEmail("12a4")).toMatchObject({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("signs another device out, and takes one already gone as done", async () => {
    fetchMock
      .mockResolvedValueOnce(json(undefined, 204))
      .mockResolvedValueOnce(
        refusal(404, "session_not_found", "No such session."),
      );

    expect(await signOutDevice("s-2")).toMatchObject({ ok: true });
    expect(call()).toMatchObject({
      url: "http://api.test/api/v1/auth/sessions/s-2",
      method: "DELETE",
    });
    expect(await signOutDevice("s-3")).toMatchObject({ ok: true });
  });
});

describe("your own account, without a backend", () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("stores nothing in fixture mode, and says so", async () => {
    expect(await updateProfile({ bio: "Hello" })).toMatchObject({
      ok: true,
      account: null,
      message: expect.stringMatching(/nothing was stored/),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers nobody in a production build", async () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(await signOutDevice("s-2")).toMatchObject({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

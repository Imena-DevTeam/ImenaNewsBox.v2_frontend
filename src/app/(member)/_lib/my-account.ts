import { cache } from "react";
import { signedInPerson } from "@/constants/member";
import { matchesName } from "@/features/auth/roles";
import { FAMILY_REGISTER } from "@/features/members/data";
import { accountFromMe, deviceFromSession } from "@/features/members/wire";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { getViewer } from "@/lib/viewer";
import { authService } from "@/services/auth.service";
import type { Device, MyAccount } from "@/types/member";

/** Nobody signs in on more devices than one page of them. */
const DEVICES_PAGE = 100;

/**
 * The signed-in person's own account, for their profile and the dashboard's
 * nudge. **Server-only.**
 *
 * With a backend it is the `/users/me` the viewer already asked for, so the
 * page costs no second call. In fixture mode it is the sample register's
 * row for whoever the sample session stands for.
 */
export const loadMyAccount = cache(async (): Promise<MyAccount | null> => {
  const viewer = await getViewer();
  if (!viewer) return null;
  if (viewer.account) return accountFromMe(viewer.account);
  if (authMode() !== "fixture") return null;

  const person = signedInPerson(viewer.role);
  const row = FAMILY_REGISTER.find((one) =>
    matchesName(one.fullName, person.name),
  );
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.fullName,
    familyName: row.familyName,
    email: row.email,
    emailConfirmed: row.status !== "invited",
    branch: row.branch,
    promotion: row.promotion,
    bornOn: row.bornOn,
    bio: "",
    photo: row.photo,
  };
});

/**
 * The devices signed in to this account, most recently used first.
 *
 * `null` when the backend could not be asked, so the list says so rather
 * than claiming nobody is signed in — which would be untrue on the very
 * device reading it.
 */
export async function loadDevices(): Promise<Device[] | null> {
  const mode = authMode();
  if (mode === "off") return null;
  if (mode === "fixture") {
    const now = new Date().toISOString();
    return [
      {
        id: "sample-device",
        label: "This browser",
        signedInAt: now,
        lastUsedAt: now,
        current: true,
      },
    ];
  }

  try {
    const page = await authService.sessions(
      { page: 1, limit: DEVICES_PAGE },
      await apiAuth(),
    );
    return page.items.map(deviceFromSession);
  } catch {
    return null;
  }
}

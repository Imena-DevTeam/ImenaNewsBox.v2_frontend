import { cache } from "react";
import {
  FAMILY_REGISTER,
  SAMPLE_CHOICES,
  SIGNED_IN_ID,
} from "@/features/members/data";
import { branchSlug, memberFromAccount } from "@/features/members/wire";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { usersService } from "@/services/users.service";
import type { FamilyMember, RegisterChoices } from "@/types/member";

/** The backend's largest page. */
const PAGE_SIZE = 100;

/** A runaway loop would be a backend that never stops saying "more". */
const MAX_PAGES = 50;

export interface Register {
  people: FamilyMember[];
  choices: RegisterChoices;
  /** The signed-in administrator's own record, which the panel will not let
      them demote or deactivate. */
  selfId: string;
}

/**
 * Every account, deactivated ones included, with the lookup lists the
 * panel's selects offer. Administrators only: the backend refuses anybody
 * else, and the admin layout has already turned them away.
 *
 * The whole register, every page of it, because the table searches, filters
 * and sorts on the client: a family is hundreds of people, not millions.
 *
 * `null` when the backend could not be asked, so the page says so rather
 * than showing an empty register.
 */
export const loadRegister = cache(
  async (viewerId: string): Promise<Register | null> => {
    const mode = authMode();
    if (mode === "fixture") {
      /* The sample session is not a row in the sample register, so the
         seeded administrator stands in for whoever is signed in. */
      return {
        people: FAMILY_REGISTER,
        choices: SAMPLE_CHOICES,
        selfId: SIGNED_IN_ID,
      };
    }
    if (mode === "off") return null;

    try {
      const auth = await apiAuth();
      const [people, subFamilies, promotions] = await Promise.all([
        everyAccount(auth),
        usersService.subFamilies(auth),
        usersService.promotions(auth),
      ]);
      return {
        people,
        choices: {
          subFamilies: subFamilies.map((one) => ({
            id: one.id,
            name: one.name,
            slug: branchSlug(one),
          })),
          promotions: promotions.map((one) => ({ id: one.id, name: one.name })),
        },
        selfId: viewerId,
      };
    } catch {
      return null;
    }
  },
);

async function everyAccount(
  auth: Awaited<ReturnType<typeof apiAuth>>,
): Promise<FamilyMember[]> {
  const people: FamilyMember[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await usersService.accounts(
      { page, limit: PAGE_SIZE, include_deactivated: true },
      auth,
    );
    people.push(...batch.items.map(memberFromAccount));
    if (people.length >= batch.total || batch.items.length < PAGE_SIZE) break;
  }
  return people;
}

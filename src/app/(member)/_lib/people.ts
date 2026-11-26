import { cache } from "react";
import { FAMILY_REGISTER, sampleDirectory } from "@/features/members/data";
import { personFromPublic } from "@/features/members/wire";
import { apiAuth } from "@/lib/api-auth";
import { authMode } from "@/lib/auth-mode";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/types/api";
import type {
  DirectoryEntry,
  FamilyMember,
  PublicPerson,
} from "@/types/member";

/** The backend's largest page. */
const PAGE_SIZE = 100;
const MAX_PAGES = 50;

function samplePerson(person: FamilyMember): PublicPerson {
  const [, month, day] = person.bornOn.split("-").map(Number);
  return {
    id: person.id,
    fullName: person.fullName,
    familyName: person.familyName,
    branch: person.branch,
    promotion: person.promotion,
    birthday: month && day ? { month, day } : null,
    photo: person.photo,
    bio: "",
  };
}

/**
 * Every active member, as members see each other (`GET /users`), for the
 * search palette. Deactivated people are not in it.
 *
 * The palette is a convenience, so a backend that cannot be asked leaves
 * it without people rather than breaking the page around it.
 */
export const loadDirectory = cache(async (): Promise<DirectoryEntry[]> => {
  const mode = authMode();
  if (mode === "fixture") return sampleDirectory();
  if (mode === "off") return [];

  try {
    const auth = await apiAuth();
    const people: DirectoryEntry[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const batch = await usersService.directory(
        { page, limit: PAGE_SIZE },
        auth,
      );
      for (const user of batch.items) {
        const one = personFromPublic(user);
        people.push({ id: one.id, name: one.fullName, branch: one.branch });
      }
      if (people.length >= batch.total || batch.items.length < PAGE_SIZE) {
        break;
      }
    }
    return people;
  } catch {
    return [];
  }
});

/**
 * One relative, as every member sees them. Null for nobody, and for
 * somebody who has been deactivated: the backend answers both with 404
 * `user_not_found`, and an id that is not an id at all with 422.
 *
 * A backend that cannot be reached is neither, so that throws, and the
 * page's error boundary says so.
 */
export const loadPerson = cache(
  async (id: string): Promise<PublicPerson | null> => {
    const mode = authMode();
    if (mode === "fixture") {
      const person = FAMILY_REGISTER.find((one) => one.id === id);
      return person && person.status !== "deactivated"
        ? samplePerson(person)
        : null;
    }
    if (mode === "off") return null;

    try {
      return personFromPublic(await usersService.member(id, await apiAuth()));
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 404 || error.status === 422)
      ) {
        return null;
      }
      throw error;
    }
  },
);

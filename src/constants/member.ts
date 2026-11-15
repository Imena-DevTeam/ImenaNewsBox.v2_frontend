/**
 * The signed-in member. It arrives with the session once the auth API
 * exists; until then it is a sample, and it lives here rather than inside a
 * feature because every member frame's header shows it.
 */
export interface Person {
  name: string;
  /** What they are called in the frame, not the session's role name. */
  role: string;
  subfamily?: string;
}

export const MEMBER: Person = {
  name: "Aganze",
  role: "Family Member",
  subfamily: "Wihogora",
};

/**
 * The family's blogger.
 *
 * She signs in at the member login like everybody else; the register says
 * she is the blogger, and that is what opens the studio — see
 * features/auth/roles.ts. Her name lives here beside the member's for the
 * same reason: until the session carries an identity, the frames need
 * somebody to greet.
 */
export const BLOGGER: Person = {
  name: "Ngabe",
  role: "Family Blogger",
  subfamily: "Wihogora",
};

/** The administrator, who is the member with one extra door. */
export const ADMINISTRATOR: Person = {
  name: MEMBER.name,
  role: "Family Administrator",
  subfamily: MEMBER.subfamily,
};

/**
 * The second administrator.
 *
 * Named here rather than left as one of the generated rows, because the
 * password reset is the first feature that needs **two** people who can
 * actually sign in: one asks for a link and the other sends it. A reviewer
 * has to be able to log in as both, so both have names worth typing.
 *
 * Her surname is outside the register's two pools on purpose, the same way
 * Aganze's and Ngabe's are, so the seeded name cannot collide with a
 * generated one.
 */
export const SECOND_ADMINISTRATOR: Person = {
  name: "Shema",
  role: "Family Administrator",
  subfamily: "Hope",
};

/**
 * Who the session belongs to.
 *
 * The token carries a role and not an identity, so this is the nearest
 * honest answer until the auth API issues a real one. It lives here rather
 * than in a component so the header, the studio and the admin overview all
 * name the same person the same way.
 */
export function signedInPerson(role?: string | null): Person {
  if (role === "blogger") return BLOGGER;
  if (role === "admin") return ADMINISTRATOR;
  return MEMBER;
}

/**
 * The signed-in member. It arrives with the session once the auth API
 * exists; until then it is a sample, and it lives here rather than inside a
 * feature because every member frame's header shows it.
 */
export const MEMBER = {
  name: "Aganze",
  role: "Family Member",
  subfamily: "Wihogora",
} as const;

import { useStoredValue } from "@/hooks/useStoredValue";

export const BORN_ON_KEY = "imena:profile_born_on";

/**
 * Whether the member's profile still lacks a date of birth, the one thing a
 * member fills in themselves: the birthdays page cannot place somebody
 * without it. Mottos are not here on purpose: they are the family's official
 * branch mottos, and nobody edits their own.
 *
 * The date is kept on this device until the profile service exists;
 * `registeredBornOn` is what the register already knows, so nobody is asked
 * for a date it holds.
 *
 * TODO: the members service, once a member can update their own record.
 */
export function useProfileCompletion(registeredBornOn = "") {
  const [storedBornOn, setBornOn] = useStoredValue(BORN_ON_KEY, "");
  const bornOn = storedBornOn || registeredBornOn;
  return { bornOn, setBornOn, complete: Boolean(bornOn) };
}

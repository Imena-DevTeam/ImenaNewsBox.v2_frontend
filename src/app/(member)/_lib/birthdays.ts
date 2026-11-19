import { celebrantsFrom, type Celebrant } from "@/features/birthdays/data";
import { FAMILY_REGISTER, branchName } from "@/features/members/data";

/**
 * Every birthday the family register can place. Composed here, at the route
 * layer, because it joins the register and the birthdays feature; and run on
 * the server, so the register is not shipped to the browser to do it.
 *
 * TODO: the members service, once the register comes from the API.
 */
export function registerCelebrants(): Celebrant[] {
  return celebrantsFrom(FAMILY_REGISTER, branchName);
}

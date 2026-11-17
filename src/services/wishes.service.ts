import type { ApiAuth } from "@/lib/api-auth";
import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type { UpcomingBirthday, WishRead } from "@/types/wire";
import { ENDPOINTS } from "./endpoints";

/**
 * Birthday wishes.
 *
 * One wish per sender, recipient and birthday, only for a birthday today or
 * in the next thirty days, and never to yourself. The backend enforces all
 * three; the year is its choice, not the caller's.
 */
export type WishQuery = ListQuery & { year?: number; user_id?: string };

export const wishesService = {
  send: (recipientId: string, message: string, auth: ApiAuth) =>
    api.post<WishRead>(
      ENDPOINTS.wishes.send,
      { recipient_id: recipientId, message },
      auth,
    ),

  /** The next thirty days, soonest first, and whether you have wished each
      person yet. Not paginated. */
  upcomingBirthdays: (auth: ApiAuth) =>
    api.get<UpcomingBirthday[]>(ENDPOINTS.wishes.upcomingBirthdays, auth),

  received: (query: WishQuery, auth: ApiAuth) =>
    api.get<Paginated<WishRead>>(ENDPOINTS.wishes.received, {
      ...auth,
      query,
    }),

  sent: (query: WishQuery, auth: ApiAuth) =>
    api.get<Paginated<WishRead>>(ENDPOINTS.wishes.sent, { ...auth, query }),

  /** Only its sender may change a wish. */
  update: (wishId: string, message: string, auth: ApiAuth) =>
    api.patch<WishRead>(ENDPOINTS.wishes.one(wishId), { message }, auth),

  remove: (wishId: string, auth: ApiAuth) =>
    api.delete<void>(ENDPOINTS.wishes.one(wishId), auth),
};

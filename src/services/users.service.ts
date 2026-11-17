import type { ApiAuth } from "@/lib/api-auth";
import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type {
  AuthorLink,
  CodeSent,
  ProfileUpdate,
  PromotionRead,
  SubFamilyRead,
  UserCreate,
  UserPublicRead,
  UserRead,
  UserUpdate,
} from "@/types/wire";
import { ENDPOINTS } from "./endpoints";

/**
 * People: the directory every member reads, their own account, and the
 * register administrators keep.
 *
 * Two read shapes, never one with fields hidden: `UserPublicRead` is what
 * members see of each other (a birthday without its year, no email), and
 * `UserRead` is the whole account, for its owner and administrators.
 *
 * There is no delete. Removing somebody is `deactivate`, which keeps them in
 * the register and out of the site, and `reactivate` undoes it.
 */
export type AccountQuery = ListQuery & { include_deactivated?: boolean };

export const usersService = {
  /** Active members, A–Z by display name. */
  directory: (query: ListQuery, auth: ApiAuth) =>
    api.get<Paginated<UserPublicRead>>(ENDPOINTS.users.list, {
      ...auth,
      query,
    }),

  member: (userId: string, auth: ApiAuth) =>
    api.get<UserPublicRead>(ENDPOINTS.users.one(userId), auth),

  me: (auth: ApiAuth) => api.get<UserRead>(ENDPOINTS.users.me, auth),

  /** Display name, birthday and bio. Everything else is an admin's. */
  updateMe: (changes: ProfileUpdate, auth: ApiAuth) =>
    api.patch<UserRead>(ENDPOINTS.users.me, changes, auth),

  resendEmailCode: (auth: ApiAuth) =>
    api.post<CodeSent>(ENDPOINTS.users.resendEmailCode, undefined, auth),

  verifyEmail: (code: string, auth: ApiAuth) =>
    api.post<UserRead>(ENDPOINTS.users.verifyEmail, { code }, auth),

  subFamilies: (auth: ApiAuth) =>
    api.get<SubFamilyRead[]>(ENDPOINTS.users.subFamilies, auth),

  promotions: (auth: ApiAuth) =>
    api.get<PromotionRead[]>(ENDPOINTS.users.promotions, auth),

  /** Your own account, or anybody's for administrators. */
  account: (userId: string, auth: ApiAuth) =>
    api.get<UserRead>(ENDPOINTS.users.account(userId), auth),

  /* Administrators only, from here down. */

  accounts: (query: AccountQuery, auth: ApiAuth) =>
    api.get<Paginated<UserRead>>(ENDPOINTS.users.accounts, {
      ...auth,
      query,
    }),

  /** Adds somebody and emails them their invitation. */
  create: (person: UserCreate, auth: ApiAuth) =>
    api.post<UserRead>(ENDPOINTS.users.list, person, auth),

  /** Send only what changes. */
  update: (userId: string, changes: UserUpdate, auth: ApiAuth) =>
    api.patch<UserRead>(ENDPOINTS.users.one(userId), changes, auth),

  deactivate: (userId: string, auth: ApiAuth) =>
    api.post<UserRead>(ENDPOINTS.users.deactivate(userId), undefined, auth),

  reactivate: (userId: string, auth: ApiAuth) =>
    api.post<UserRead>(ENDPOINTS.users.reactivate(userId), undefined, auth),

  /** A new invitation link, replacing the old one. */
  invite: (userId: string, auth: ApiAuth) =>
    api.post<UserRead>(ENDPOINTS.users.invitation(userId), undefined, auth),

  linkAuthor: (userId: string, link: AuthorLink, auth: ApiAuth) =>
    api.put<UserRead>(ENDPOINTS.users.sanityAuthor(userId), link, auth),

  /** Your own photo, or anybody's for administrators. JPEG, PNG, WebP or
      HEIC, at most 5 MB. */
  setPhoto: (userId: string, photo: Blob, auth: ApiAuth) => {
    const form = new FormData();
    form.append("photo", photo);
    return api.put<UserRead>(ENDPOINTS.users.photo(userId), form, auth);
  },

  removePhoto: (userId: string, auth: ApiAuth) =>
    api.delete<UserRead>(ENDPOINTS.users.photo(userId), auth),
};

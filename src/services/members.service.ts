import { api } from "@/lib/api-client";
import type { ListQuery, Paginated } from "@/types/api";
import type { FamilyMember, MemberPatch, NewMember } from "@/types/member";
import { ENDPOINTS } from "./endpoints";

/**
 * The family register, from the backend.
 *
 * One file per resource, every function typed at both ends, and no path
 * written here — the paths live in `endpoints.ts`. A service does transport
 * and nothing else: no React, no formatting, no decisions about what the
 * page should do when it fails.
 *
 * The shape of these calls is what `MembersTable` already does to a copy of
 * the register held in state, which is why the CRUD can be connected a
 * function at a time rather than all at once.
 */
export type MemberQuery = ListQuery & {
  branch?: string;
  status?: string;
  missingBornOn?: boolean;
};

export const membersService = {
  list: (query: MemberQuery = {}, token?: string) =>
    api.get<Paginated<FamilyMember>>(ENDPOINTS.members.list, {
      query: { ...query, missingBornOn: query.missingBornOn || undefined },
      token,
    }),

  byId: (id: string, token?: string) =>
    api.get<FamilyMember>(ENDPOINTS.members.one(id), { token }),

  create: (member: NewMember, token?: string) =>
    api.post<FamilyMember>(ENDPOINTS.members.list, member, { token }),

  update: (id: string, patch: MemberPatch, token?: string) =>
    api.patch<FamilyMember>(ENDPOINTS.members.one(id), patch, { token }),

  remove: (id: string, token?: string) =>
    api.delete<void>(ENDPOINTS.members.one(id), { token }),
};
